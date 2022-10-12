import { VersaiNativeChatSdk } from '@/modules/chat/services'
import { useNetInfo } from '@react-native-community/netinfo'
import chatAtom from '@/modules/chat/atoms/chat.atom'
import { useTyping } from '@/modules/chat/hooks/useTyping'
import { hp, wp } from '@/utils/responsive.util'
import { useAtomValue } from 'jotai'
import { Actionsheet, HStack, IconButton, Image, Input, Pressable, ScrollView, useDisclose, View } from 'native-base'
import React, { useEffect, useState, memo } from 'react'
import { Dimensions } from 'react-native'
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Snackbar from 'react-native-snackbar'
import FIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { sendInputStyles as styles } from '../chatRoom.style'

function SendInput({
  sendChat,
  roomId,
}: {
  sendChat(payload: { messageText: string; attachments: Asset[] }): void
  roomId: string
}) {
  const netInfo = useNetInfo()
  const { typing, startTyping, stopTyping } = useTyping()
  const [messageText, setMessageText] = useState<string>('')
  const [attachments, setAttachments] = useState<Asset[]>([])
  const [selectedAttachment, setSelectedAttachment] = useState<Asset | null>(null)
  const chatInstance = VersaiNativeChatSdk.getInstance()
  const isChatInitialized = useAtomValue(chatAtom).initialized
  const { isOpen, onOpen, onClose } = useDisclose()
  const { width } = Dimensions.get('window')

  function handleChatSend() {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      sendChat({ messageText, attachments })
      setMessageText('')
      onClose()
    } else {
      Snackbar.show({
        text: 'Please check your internet connection',
        backgroundColor: '#d32f2f',
      })
    }
  }

  function handleTextChange(text: string) {
    setMessageText(text)
    startTyping()
    stopTyping()
  }

  async function pickImage() {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      })
      if (result.errorCode) {
        if (result.errorCode === 'camera_unavailable') {
          Snackbar.show({
            text: 'Camera in unavailable in this device',
            backgroundColor: '#d32f2f',
          })
        } else if (result.errorCode === 'permission') {
          Snackbar.show({
            text: 'Gallery permission is not granted',
            backgroundColor: '#d32f2f',
          })
        } else {
          Snackbar.show({
            text: 'Somthing went wrong. Unable to access Gallery.',
            backgroundColor: '#d32f2f',
          })
        }
      } else if (result.assets) {
        const imgResponse = result.assets[0]
        setAttachments((prev) => [...prev, imgResponse])
        setSelectedAttachment(imgResponse)
        onOpen()
      }
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong. Unable to upload image.',
        backgroundColor: '#d32f2f',
      })
      console.log(error)
    }
  }

  async function pickImageFromCamera() {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
      })
      if (result.errorCode) {
        if (result.errorCode === 'camera_unavailable') {
          Snackbar.show({
            text: 'Camera in unavailable in this device',
            backgroundColor: '#d32f2f',
          })
        } else if (result.errorCode === 'permission') {
          Snackbar.show({
            text: 'Gallery permission is not granted',
            backgroundColor: '#d32f2f',
          })
        } else {
          Snackbar.show({
            text: 'Somthing went wrong. Unable to access Camera.',
            backgroundColor: '#d32f2f',
          })
        }
      } else if (result.assets) {
        const imgResponse = result.assets[0]
        setAttachments((prev) => [...prev, imgResponse])
        setSelectedAttachment(imgResponse)
        onOpen()
      }
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong. Unable to upload image.',
        backgroundColor: '#d32f2f',
      })
      console.log(error)
    }
  }

  function removeImage(attachment: Asset) {
    const filteredAttachments = attachments.filter((att) => att.uri !== attachment.uri)
    setAttachments(filteredAttachments)
  }

  function updateTypingStatus(status: boolean) {
    if (chatInstance && isChatInitialized) chatInstance?.updateTypingStatus(roomId, status)
  }

  useEffect(() => {
    updateTypingStatus(typing)
    return () => {
      updateTypingStatus(false)
    }
  }, [typing, chatInstance, isChatInitialized])

  return (
    <>
      <Input
        bg="rgba(255,255,255, 0.15)"
        borderRadius="full"
        placeholder="Type your message"
        value={messageText}
        onChangeText={handleTextChange}
        placeholderTextColor="rgba(255,255,255,0.7)"
        height={hp(52)}
        _focus={{ borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent' }}
        _hover={{ borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent' }}
        InputRightElement={
          <HStack>
            <IconButton
              onPress={pickImageFromCamera}
              icon={<MCIcon name="camera" size={20} color="rgba(255,255,255,0.6)" />}
              p={0}
            />
            <IconButton
              onPress={pickImage}
              icon={<MCIcon name="attachment" size={20} color="rgba(255,255,255,0.6)" />}
            />
            <IconButton
              disabled={/^ *$/.test(messageText)}
              onPress={handleChatSend}
              variant="solid"
              rounded="full"
              bg="#fff"
              mr={2}
              icon={<FIcon name="send" size={18} color="#0057FF" />}
            />
          </HStack>
        }
      />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content bg="rgba(96, 72, 240, 1)">
          {attachments && attachments.length && (
            <View px={wp(20)}>
              <Image
                resizeMode="cover"
                source={{ uri: selectedAttachment ? selectedAttachment.uri : attachments[0].uri }}
                alt="attachment"
                width={wp(width)}
                height={hp(300)}
              />
              {attachments.length > 1 && (
                <View height={hp(60)} mt={5}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {attachments.map((att) => (
                      <Pressable
                        key={att.uri}
                        onPress={() => setSelectedAttachment(att)}
                        mr={3}
                        style={styles.imageContainer}
                      >
                        <Image
                          alt="attachement-preview"
                          source={{ uri: att.uri }}
                          width={wp(60)}
                          height={hp(60)}
                          resizeMode="cover"
                        />
                        {!!selectedAttachment && att.uri !== selectedAttachment.uri && (
                          <Pressable
                            onPress={() => removeImage(att)}
                            style={styles.imageDeleteIcon}
                            bg="rgba(0,0,0,0.5)"
                            borderRadius="full"
                            p={0.5}
                          >
                            <MCIcon name="delete-empty-outline" size={hp(20)} color="#FFF" />
                          </Pressable>
                        )}
                        {!!selectedAttachment && att.uri === selectedAttachment.uri && (
                          <>
                            <View style={styles.imageOverlay}>
                              <MCIcon name="checkbox-marked-circle-outline" size={hp(20)} color="#FFF" />
                            </View>
                          </>
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Input
                bg="rgba(255,255,255, 0.15)"
                borderRadius="full"
                placeholder="Type your message"
                mt={hp(10)}
                pl={0}
                value={messageText}
                onChangeText={handleTextChange}
                placeholderTextColor="rgba(255,255,255,0.7)"
                borderColor="transparent"
                _focus={{ borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent' }}
                _hover={{ borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent' }}
                InputLeftElement={
                  <IconButton
                    rounded="full"
                    ml={1}
                    icon={<MIcon name="add-photo-alternate" size={18} color="#FFF" />}
                    onPress={pickImage}
                  />
                }
                InputRightElement={
                  <HStack>
                    <IconButton
                      bg="#fff"
                      variant="solid"
                      onPress={handleChatSend}
                      rounded="full"
                      mr={2}
                      p={1.5}
                      icon={<FIcon name="send" size={18} color="#0057FF" />}
                    />
                  </HStack>
                }
              />
            </View>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  )
}

export default memo(SendInput)
