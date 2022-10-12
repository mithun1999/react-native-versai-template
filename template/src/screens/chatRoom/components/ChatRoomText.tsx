import React from 'react'
import { Button, HStack, Image, ScrollView, Spinner, Text, View } from 'native-base'
import { hp, wp } from '@/utils/responsive.util'
import { IChatRoomText } from '../interfaces/chatRoom.interface'
import dayjs from 'dayjs'
import { TypingAnimation } from 'react-native-typing-animation'
import { sendInputStyles as styles } from '../chatRoom.style'
// import FIcon from 'react-native-vector-icons/Feather'
import MIcon from 'react-native-vector-icons/MaterialIcons'

function ChatRoomText(props: IChatRoomText) {
  const { showTime = false, isSender, timestamp, messageText, date, isTyping, attachments } = props
  const time = dayjs(timestamp).format('h:mm a')

  return (
    <>
      {isTyping && (
        <HStack width="100%" mt={showTime ? 5 : 2}>
          <TypingAnimation dotColor="#fff" dotSpeed={0.2} />
        </HStack>
      )}
      {isSender ? (
        <HStack width="100%" justifyContent="flex-end" mt={showTime ? 5 : 2}>
          <HStack space={3} alignItems="center" maxWidth="75%">
            <Text fontSize={hp(12)} opacity={0.7}>
              {time}
            </Text>
            <ScrollView bg="#4D00E1" px={5} py={1.5} borderLeftRadius={15} borderBottomRightRadius={15}>
              <Text fontWeight={500}>{messageText}</Text>
            </ScrollView>
          </HStack>
        </HStack>
      ) : (
        <HStack width="100%" mt={showTime ? 5 : 2}>
          <HStack space={3} alignItems="center" maxWidth="75%">
            <ScrollView bg="rgba(255,255,255,0.1)" px={5} py={1.5} borderRightRadius={15} borderBottomLeftRadius={15}>
              <Text fontWeight={500}>{messageText}</Text>
            </ScrollView>
            <Text fontSize={hp(12)} opacity={0.7}>
              {time}
            </Text>
          </HStack>
        </HStack>
      )}
      {!!attachments &&
        attachments.length > 0 &&
        attachments.map((att) => (
          <HStack
            key={att.id ?? att.localId}
            width="100%"
            justifyContent={isSender ? 'flex-end' : 'flex-start'}
            mt={showTime ? 5 : 2}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: att.url ? att.url : att.localUrl }}
                width={wp(150)}
                height={hp(150)}
                resizeMode="cover"
                alt="attachment-images"
              />
              {(att.isUploading || att.isFailed) && (
                <View style={styles.ogImageOverlay}>
                  {att.isUploading && <Spinner accessibilityLabel="Uploading images" color="white" />}
                  {att.isFailed && (
                    <Button
                      bg="rgba(0,0,0,0.5)"
                      borderRadius="full"
                      // leftIcon={<FIcon name="upload" size={20} color="#fff" />}
                      leftIcon={<MIcon name="error-outline" size={20} color="#fff" />}
                    >
                      <Text>Failed</Text>
                    </Button>
                  )}
                </View>
              )}
            </View>
          </HStack>
        ))}
      {showTime && (
        <HStack width="100%" justifyContent="center">
          <Text fontWeight={500}>{date}</Text>
        </HStack>
      )}
    </>
  )
}

export default ChatRoomText
