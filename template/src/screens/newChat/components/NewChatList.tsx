import { hp, wp } from '@/utils/responsive.util'
import { getAvatarName } from '@/utils/string.utils'
import { Avatar, HStack, Text, View } from 'native-base'
import React from 'react'
import { INewChatListProps } from '../interfaces/newChatList.interfaces'

function NewChatList({ source, name, online }: INewChatListProps) {
  const avatarName = getAvatarName(name)

  return (
    <View mx={wp(10)}>
      <HStack justifyContent="space-between" alignItems="center">
        <View>
          <HStack justifyContent="space-between" alignItems="center" space={3}>
            <Avatar bg="#544d80" size="md" source={{ uri: source }}>
              {avatarName}
              {online && <Avatar.Badge bg="green.500" />}
            </Avatar>
            <View maxWidth={wp(180)}>
              <Text fontSize={hp(16)} fontWeight={600}>
                {name}
              </Text>
            </View>
          </HStack>
        </View>
      </HStack>
    </View>
  )
}

export default NewChatList
