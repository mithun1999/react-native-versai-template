import { hp, wp } from '@/utils/responsive.util'
import { getAvatarName } from '@/utils/string.utils'
import { Actionsheet, Avatar, HStack, Text, useDisclose, View, VStack } from 'native-base'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { IChatListProps } from '../interfaces/chatList.interface'
import ProfileDrawer from './ProfileDrawer'

function ChatList({ image, name, receivedTime, message, peerUser, roomId }: IChatListProps) {
  const avatarName = getAvatarName(name)
  const online = peerUser && peerUser?.presence && peerUser?.presence === 'ONLINE'

  const { onOpen, isOpen, onClose } = useDisclose()
  return (
    <View mx={wp(10)}>
      <HStack justifyContent="space-between" alignItems="center">
        <View>
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <TouchableOpacity activeOpacity={0.8} onPress={onOpen}>
              <Avatar bg="#544d80" size="md" source={{ uri: image }}>
                {avatarName}
                {online && <Avatar.Badge bg="green.500" />}
              </Avatar>
            </TouchableOpacity>
            <View maxWidth={wp(180)}>
              <Text fontSize={hp(16)} fontWeight={600}>
                {name}
              </Text>
              <Text numberOfLines={2}>{message ?? 'No conversation yet'}</Text>
            </View>
          </HStack>
        </View>
        <VStack alignItems="flex-end">
          <Text>{receivedTime}</Text>
        </VStack>
      </HStack>
      <ProfileDrawer user={peerUser} isOpen={isOpen} onClose={onClose} roomId={roomId} />
    </View>
  )
}

export default ChatList
