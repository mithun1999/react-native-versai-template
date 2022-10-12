import {VersaiNativeChatSdk} from '@/modules/chat/services';
import userDataAtom from '@/atoms/userData.atom';
import {axiosInstance} from '@/utils/axios.utils';
import axios from 'axios';
import dayjs from 'dayjs';
import {useAtom, useAtomValue} from 'jotai';
import {cloneDeep} from 'lodash';
import {nanoid} from 'nanoid';
import {RefObject, useMemo} from 'react';
import {Platform} from 'react-native';
import {Asset} from 'react-native-image-picker';
import memberAtom from '../atoms/member.atom';
import roomAtom from '../atoms/room.atom';
import roomChatAtom from '../atoms/roomChat.atom';
import {IChatMessage, IChatUser} from '../interfaces/chatAtom.interface';
import {getRoomInformation} from '../utils/chat.utils';
import {FlatList as RNFlatList} from 'react-native';

function useChat(roomId: string, flatListRef?: RefObject<RNFlatList<any>>) {
  const chatInstance = VersaiNativeChatSdk.getInstance();
  const mediaOwnerId = useAtomValue(userDataAtom)?.songs?.id;
  const [chatRoom, setChatRoom] = useAtom(roomChatAtom);
  const rooms = useAtomValue(roomAtom);
  const userId = useAtomValue(userDataAtom)?.id;
  const members = useAtomValue(memberAtom);
  const roomData = useMemo(() => {
    const roomInfo = rooms.find(room => room.id === roomId);
    return roomInfo && userId
      ? getRoomInformation(roomInfo, userId, members)
      : null;
  }, [rooms]);

  async function uploadMultipleFiles(
    attachments: Asset[],
    keys: string[],
    chatId: string,
  ) {
    let attachmentPayload: {id: string; ext: string; url: string}[] = [];
    const rawAttachmentsReq: any[] = [];
    const multipleReq = attachments.map((att, idx) => {
      const formData = new FormData() as any;
      const payload = {
        name: att.fileName,
        type: att.type,
        uri:
          Platform.OS === 'android'
            ? att.uri
            : att?.uri?.replace('file://', ''),
        size: att.fileSize as number,
        originalname: att.fileName,
        localId: keys[idx],
        localUrl: att?.uri,
      };
      formData.append('files', payload);
      rawAttachmentsReq.push(payload);
      return axiosInstance.post(`/v1/media/add/${mediaOwnerId}`, formData);
    });
    const resolvedMultipleReq = multipleReq.map(req =>
      req.catch(error => ({error})),
    );

    await axios
      .all(resolvedMultipleReq)
      .then(
        axios.spread((...res) => {
          res.forEach(async (r: any, index) => {
            if (r && r.error) {
              if (chatRoom && chatRoom[roomId] && userId) {
                await setChatRoom(prev => {
                  const cloneRoomMessages = cloneDeep(prev);
                  if (cloneRoomMessages && cloneRoomMessages[roomId]) {
                    const roomIdMessages = cloneRoomMessages[roomId];
                    const idx = roomIdMessages.findIndex(
                      message => message.id === chatId,
                    );
                    const dupChatData = roomIdMessages[idx];
                    const dupChatAttachments = dupChatData.attachments;
                    if (dupChatAttachments) {
                      const matchedAttachment = dupChatAttachments[index];
                      matchedAttachment.isUploading = false;
                      matchedAttachment.isFailed = true;
                    }
                    return {...prev, [roomId]: roomIdMessages};
                  }
                  return {...prev};
                });
              }
            } else if (r && r.data) {
              const data = r.data;
              attachmentPayload.push({
                id: data.id,
                ext: data.ext,
                url: data.url,
              });
              if (chatRoom && chatRoom[roomId] && userId) {
                await setChatRoom(prev => {
                  const cloneRoomMessages = cloneDeep(prev);
                  if (cloneRoomMessages && cloneRoomMessages[roomId]) {
                    const roomIdMessages = cloneRoomMessages[roomId];
                    const idx = roomIdMessages.findIndex(
                      message => message.id === chatId,
                    );
                    const dupChatData = roomIdMessages[idx];
                    const dupChatAttachments = dupChatData.attachments;
                    if (dupChatAttachments) {
                      const matchedAttachment = dupChatAttachments[index];
                      matchedAttachment.isUploading = false;
                      matchedAttachment.isFailed = false;
                    }
                    return {...prev, [roomId]: roomIdMessages};
                  }
                  return {...prev};
                });
              }
            }
          });
        }),
      )
      .catch(error => console.log('error while uploading media', error));
    return attachmentPayload;
  }

  async function sendChat(payload: {
    messageText?: string;
    attachments?: Asset[];
  }) {
    const {attachments} = payload;
    let attachmentPayload: {id: string; ext: string; url: string}[] = [];
    if (chatInstance && roomData && members) {
      const memberIdsBesideSender = roomData.members
        .filter((memberId: string) => memberId !== chatInstance?.user.id)
        .reduce((acc: IChatUser[], id) => {
          acc.push(members?.[id]);
          return acc;
        }, []);
      const chatId = `${dayjs().valueOf()}-${nanoid()}`;
      const attachmentKeys: string[] | undefined =
        attachments && new Array(attachments.length).fill(nanoid());
      const localAttachments =
        attachments &&
        attachmentKeys &&
        attachments.map((att, idx) => {
          const data = {
            localId: attachmentKeys[idx],
            localUrl: att.uri,
            isUploading: true,
          };
          return data;
        });
      const timestamp = dayjs().valueOf() as any;
      // Set the message locally
      if (chatRoom && chatRoom[roomId] && userId) {
        const atomData: IChatMessage = {
          sendBy: userId,
          timestamp,
          messageText: payload.messageText,
          isSender: true,
          id: chatId,
          attachments: localAttachments,
        };
        await setChatRoom(prev => {
          if (prev && prev[roomId]) {
            // console.log('set chat called')
            const prevChatRoomMessages = prev[roomId];
            const isPrevMessage = prevChatRoomMessages.find(
              m => m.id === chatId,
            );
            if (!isPrevMessage)
              return {...prev, [roomId]: [atomData, ...prevChatRoomMessages]};
          }
          return {...prev};
        });
        flatListRef?.current?.scrollToOffset({animated: true, offset: 0});
      }
      // Send message to server
      if (
        payload.attachments &&
        payload.attachments.length > 0 &&
        attachmentKeys
      )
        attachmentPayload = await uploadMultipleFiles(
          payload.attachments,
          attachmentKeys,
          chatId,
        );

      const req = {
        messageText: payload.messageText,
        attachments: attachmentPayload,
      };
      const serverRes = await chatInstance.sendChatToRoom(
        roomId,
        memberIdsBesideSender,
        req,
        chatId,
      );
      if (serverRes && serverRes.error) {
        if (chatRoom && chatRoom[roomId] && userId) {
          await setChatRoom(prev => {
            const cloneRoomMessages = cloneDeep(prev);
            if (cloneRoomMessages && cloneRoomMessages[roomId]) {
              const roomIdMessages = cloneRoomMessages[roomId];
              const idx = roomIdMessages.findIndex(
                message => message.id === chatId,
              );
              const dupChatData = roomIdMessages[idx];
              roomIdMessages[idx] = {...dupChatData, isError: true};
              return {...prev, [roomId]: roomIdMessages};
            }
            return {...prev};
          });
        }
      }
    }
  }

  return {uploadMultipleFiles, sendChat};
}

export default useChat;
