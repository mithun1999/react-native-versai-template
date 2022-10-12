import { useIsFocused, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import { Fab, Icon, Pressable, ScrollView, Spinner, VStack } from 'native-base'
import React, { useMemo, useState } from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import userDataAtom from '../../atoms/userData.atom'
import memberAtom from '../../modules/chat/atoms/member.atom'
import roomAtom from '../../modules/chat/atoms/room.atom'
import { getMessageSendTime, getRoomInformation } from '../../modules/chat/utils/chat.utils'
import { AppStackParam } from '../../navigation/stack.interface'
import AppLayout from '../../ui/templates/appLayout'
import { hp, wp } from '../../utils/responsive.util'
import ChatList from './components/ChatList'
import Header from './components/Header'
import Fuse from 'fuse.js'
import chatAtom from '../../modules/chat/atoms/chat.atom'

function Inbox() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParam>>()
  const isFocused = useIsFocused()
  const rawRooms = useAtomValue(roomAtom)
  const userId = useAtomValue(userDataAtom)?.id as string
  const members = useAtomValue(memberAtom)
  const isRoomFetchLoading = useAtomValue(chatAtom).isRoomFetchLoading
  const [searchText, setSearchText] = useState('')
  const rooms = useMemo(() => {
    const updatedRooms = rawRooms.map((room) => getRoomInformation(room, userId, members))
    const sortedMessages = updatedRooms.sort((acc, nxt) => {
      if (acc?.recentMessage && nxt?.recentMessage) {
        const accDate = dayjs(acc.recentMessage.timestamp)
        const nxtDate = dayjs(nxt.recentMessage.timestamp)
        if (accDate.isBefore(nxtDate)) return 1
        if (accDate.isSame(nxtDate)) return 0
        return -1
      } else return -1
    })
    const fuse = new Fuse(sortedMessages, { keys: ['name'] })
    const fuseRes = fuse.search(searchText)
    if (searchText) return fuseRes.map((res) => res.item)
    return sortedMessages
  }, [rawRooms, userId, members, searchText])

  const navigateNewConversation = () => {
    navigation.navigate('NewConversation')
  }

  const navigateFeedback = () => {
    navigation.navigate('Feedback')
  }

  // console.log(rawRooms);

  return (
    <AppLayout>
      <Header searchText={searchText} setSearchText={setSearchText} />
      <ScrollView mt={hp(15)}>
        <VStack space={5}>
          {isRoomFetchLoading && <Spinner color="white" />}
          {!!rooms &&
            !!rooms.length &&
            rooms.map((room) => (
              <Pressable key={room.id} onPress={() => navigation.navigate('ChatRoom', { roomId: room.id })}>
                <ChatList
                  name={room.name}
                  message={room?.recentMessage?.messageText}
                  receivedTime={room.recentMessage && getMessageSendTime(room?.recentMessage?.timestamp)}
                  peerUser={room?.user}
                  image={room?.user?.image}
                  roomId={room?.id}
                />
              </Pressable>
            ))}
        </VStack>
      </ScrollView>
      {isFocused && (
        <>
          <Fab
            placement="bottom-right"
            mb={hp(80)}
            colorScheme="blue"
            size="lg"
            onPress={navigateNewConversation}
            icon={<Icon name="plus" as={FeatherIcon} />}
          />
          <Fab
            placement="bottom-right"
            mb={hp(150)}
            mr={wp(5)}
            colorScheme="coolGray"
            size="xs"
            onPress={navigateFeedback}
            icon={<Icon name="dynamic-form" as={MaterialIcon} />}
          />
        </>
      )}
    </AppLayout>
  )
}

export default Inbox
