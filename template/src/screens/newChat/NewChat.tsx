import { VersaiNativeChatSdk } from '@/modules/chat/services'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Fuse from 'fuse.js'
import { useAtom, useAtomValue } from 'jotai'
import { Pressable, ScrollView, VStack } from 'native-base'
import React, { useMemo, useState } from 'react'
import userDataAtom from '../../atoms/userData.atom'
import chatAtom from '../../modules/chat/atoms/chat.atom'
import roomAtom from '../../modules/chat/atoms/room.atom'
import { IFbChatRoom } from '../../modules/chat/interfaces/chatAtom.interface'
import { useCustomListAllQuery } from '../../modules/chat/queries/chat.query'
import { AppStackParam } from '../../navigation/stack.interface'
import LoadingWrapper from '../../ui/molecules/loadingWrapper'
import AppLayout from '../../ui/templates/appLayout'
import { hp } from '../../utils/responsive.util'
import Header from './components/Header'
import NewChatList from './components/NewChatList'

export default function NewChat() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParam>>()
  const { data, isLoading } = useCustomListAllQuery()
  const newChatList = useMemo(() => data.filter((stu: any) => stu.userId), [data])
  const [searchText, setSearchText] = useState('')
  const userId = useAtomValue(userDataAtom)?.id
  const [rooms, setRooms] = useAtom(roomAtom)
  const chatInstance = VersaiNativeChatSdk.getInstance()
  const isChatInitialized = useAtomValue(chatAtom).initialized

  const filteredChatList = useMemo(() => {
    const fuse = new Fuse(newChatList, { keys: ['name'] })
    const fuseRes = fuse.search(searchText)
    if (searchText) return fuseRes.map((res) => res.item)
    return newChatList
  }, [newChatList, searchText])

  async function handleNewRoom(roomUserId: string) {
    if (userId) {
      const allMembers = [userId, roomUserId]
      const selectedRoom = rooms.find((room) => {
        return room.members.every((member) => allMembers.includes(member))
      })
      if (selectedRoom) {
        navigation.navigate('ChatRoom', { roomId: selectedRoom.id })
      } else if (chatInstance && isChatInitialized) {
        const createdRoomId = await chatInstance?.createRoom([roomUserId])
        if (createdRoomId) {
          const roomData = (await chatInstance?.getRoomInfo(createdRoomId)) as IFbChatRoom | null
          navigation.navigate('ChatRoom', { roomId: createdRoomId })
          if (roomData) await setRooms((prev) => [...prev, roomData])
        }
      }
    }
  }

  return (
    <AppLayout>
      <Header loading={isLoading} setSearchText={setSearchText} searchText={searchText} />
      <LoadingWrapper loading={isLoading}>
        <ScrollView mt={hp(15)}>
          <VStack space={5}>
            {filteredChatList &&
              filteredChatList.map((person: any) => (
                <Pressable key={person.id} onPress={() => handleNewRoom(person.userId)}>
                  <NewChatList name={person.name} source={person.image} />
                </Pressable>
              ))}
          </VStack>
        </ScrollView>
      </LoadingWrapper>
    </AppLayout>
  )
}
