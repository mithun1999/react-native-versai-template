import { VersaiNativeChatSdk } from '@/modules/chat/services'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import dayjs, { Dayjs } from 'dayjs'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { cloneDeep, isEqual, uniqBy } from 'lodash'
import { View } from 'native-base'
import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList as RNFlatList } from 'react-native'
import userDataAtom from '../../atoms/userData.atom'
import chatAtom, { chatStorageAtom } from '../../modules/chat/atoms/chat.atom'
import memberAtom from '../../modules/chat/atoms/member.atom'
import roomAtom from '../../modules/chat/atoms/room.atom'
import roomChatAtom from '../../modules/chat/atoms/roomChat.atom'
import useChat from '../../modules/chat/hooks/useChat'
import { IChatMessage, IFbChatRoom } from '../../modules/chat/interfaces/chatAtom.interface'
import { getRoomInformation } from '../../modules/chat/utils/chat.utils'
import { AppStackParam } from '../../navigation/stack.interface'
import FlatList from '../../ui/molecules/flatlist'
import AppLayout from '../../ui/templates/appLayout'
import ChatRoomText from './components/ChatRoomText'
import Header from './components/Header'
import SendInput from './components/SendInput'

type Props = NativeStackScreenProps<AppStackParam, 'ChatRoom'>

function ChatRoom({ route }: Props) {
  const { roomId } = route.params
  const chatInstance = VersaiNativeChatSdk.getInstance()
  const todaysDate = useRef<Dayjs>()
  const firstMessageKey = useAtomValue(chatStorageAtom).firstMessageKey
  const isChatInitialized = useAtomValue(chatAtom).initialized
  const setFirstMessageKey = useSetAtom(chatStorageAtom)
  const rooms = useAtomValue(roomAtom)
  const setRooms = useSetAtom(roomAtom)
  const members = useAtomValue(memberAtom)
  const userId = useAtomValue(userDataAtom)?.id
  const mediaOwnerId = useAtomValue(userDataAtom)?.songs?.id
  const [chatRoom, setChatRoom] = useAtom(roomChatAtom)
  const flatListRef = useRef<RNFlatList>(null)
  const roomInfo = useMemo(() => rooms.find((room) => room.id === roomId), [rooms])
  const roomData = useMemo(() => {
    const roomInfo = rooms.find((room) => room.id === roomId)
    return roomInfo && userId ? getRoomInformation(roomInfo, userId, members) : null
  }, [rooms])
  const lastMessageKey = useMemo(() => {
    if (chatRoom && chatRoom[roomId]) {
      const messages = chatRoom[roomId]
      return messages[messages.length - 1].id
    } else {
      return null
    }
  }, [chatRoom])
  const roomIdMessages = useMemo(() => {
    if (chatRoom && chatRoom[roomId]) {
      const messages = cloneDeep(chatRoom[roomId])
      const sortedMessages = messages.sort((acc, nxt) => {
        const accDate = dayjs(acc.timestamp)
        const nxtDate = dayjs(nxt.timestamp)
        if (accDate.isBefore(nxtDate)) return 1
        if (accDate.isSame(nxtDate)) return 0
        return -1
      })
      return sortedMessages
    } else return []
  }, [roomId, chatRoom])
  const isTyping = roomData?.typing?.includes(roomData?.user?.id) ?? false
  const { sendChat } = useChat(roomId, flatListRef)

  // console.log('chatRoom', chatRoom)
  // console.log('roomIdMessages', roomIdMessages)
  // console.log(useAtomValue(userDataAtom))

  function fetchMessages() {
    if (chatInstance) {
      const fMessageKey = (firstMessageKey && firstMessageKey[roomId]) ?? ''
      chatInstance?.fetchRoomMessages(roomId, { limit: 50, endAt: fMessageKey }, async (msg) => {
        if (!msg.length) return
        if (chatRoom && chatRoom[roomId] && msg.length > 0) {
          await setChatRoom((prev) => {
            if (prev && prev[roomId]) {
              const prevChatRoomMessages = prev[roomId]
              const loadedMsg = uniqBy([...msg, ...prevChatRoomMessages], 'id')
              return { ...prev, [roomId]: [...loadedMsg] }
            }
            return { ...prev }
          })
        } else if (msg.length > 0) {
          await setChatRoom((prev) => ({ ...prev, [roomId]: [...msg] }))
        }
        const firstVisibleKey = msg[0]?.id
        if (firstVisibleKey && fMessageKey !== firstVisibleKey)
          await setFirstMessageKey((prev) => ({
            ...prev,
            firstMessageKey: { ...prev.firstMessageKey, [roomId]: firstVisibleKey },
          }))
      })
    }
  }

  async function handleNewMessage(msg: IChatMessage) {
    if (chatRoom && chatRoom[roomId]) {
      await setChatRoom((prev) => {
        if (prev && prev[roomId]) {
          const prevChatRoomMessages = prev[roomId]
          const isPrevMessage = prevChatRoomMessages.find((m) => m.id === msg.id)
          if (!isPrevMessage) return { ...prev, [roomId]: [msg, ...prevChatRoomMessages] }
        }
        return { ...prev }
      })
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    }
  }

  function handleDateAvatarVisibility(msg: IChatMessage, index: number) {
    let dateStatus = false
    const prevMsg = index < roomIdMessages.length ? roomIdMessages[index + 1] : null
    const tstampInstance = dayjs(msg.timestamp)
    const msgDate = tstampInstance.isSame(todaysDate.current, 'date') ? 'Today' : tstampInstance.format('MM/DD/YYYY')
    if (prevMsg) {
      const prevMsgDate = dayjs(prevMsg.timestamp).isSame(todaysDate.current, 'date')
        ? 'Today'
        : tstampInstance.format('MM/DD/YYYY')
      if (prevMsgDate === msgDate) dateStatus = false
      else dateStatus = true
    } else {
      dateStatus = true
    }
    return { dateStatus, msgDate }
  }

  async function onStartReached() {
    return fetchMessages()
  }

  async function onEndReached() {
    // return fetchMessages()
  }

  async function updateRoom(room: IFbChatRoom) {
    // console.log(room)
    if (roomInfo && !isEqual(room, roomInfo)) {
      setRooms((prev) => {
        const cloneRooms = cloneDeep(prev)
        const foundIndex = cloneRooms.findIndex((r) => r.id == room.id)
        cloneRooms[foundIndex] = room
        return cloneRooms
      })
    }
  }

  useEffect(() => {
    todaysDate.current = dayjs()
    if (chatInstance && isChatInitialized) {
      // fetchMessages()
      chatInstance.listenForRoomStatus(roomId, updateRoom)
    }
    // DEBUGGER
    // setChatRoom(RESET)
    // setFirstMessageKey(RESET)
  }, [chatInstance, roomId, isChatInitialized])

  useEffect(() => {
    if (chatInstance && isChatInitialized) {
      chatInstance?.listenForNewMessageInARoom(roomId, { startAt: lastMessageKey }, handleNewMessage)
    }
  }, [chatInstance, roomId, isChatInitialized, lastMessageKey])

  return (
    <AppLayout>
      <Header room={roomData} />
      <View mt={5} height="85%" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <View pb={3}>
          <FlatList
            data={roomIdMessages}
            ref={flatListRef}
            inverted
            onStartReached={onStartReached}
            onEndReached={onEndReached}
            keyExtractor={(item) => item.id}
            renderItem={(props) => {
              const { item, index } = props
              const { dateStatus, msgDate } = handleDateAvatarVisibility(item, index)
              return (
                <ChatRoomText
                  messageText={item.messageText}
                  isSender={item.isSender}
                  id={item.id}
                  sendBy={item.sendBy}
                  timestamp={item.timestamp}
                  showTime={dateStatus}
                  date={msgDate}
                  isTyping={isTyping}
                  attachments={item.attachments}
                />
              )
            }}
            showDefaultLoadingIndicators={true}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <SendInput sendChat={sendChat} roomId={roomId} />
      </View>
    </AppLayout>
  )
}

export default ChatRoom
