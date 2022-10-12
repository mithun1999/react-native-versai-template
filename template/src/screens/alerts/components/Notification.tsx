import { hp, wp } from '@/utils/responsive.util'
import { getAvatarName } from '@/utils/string.utils'
import { Avatar, Box, HStack, Text, View, VStack } from 'native-base'
import React from 'react'
import dayjs from 'dayjs'
import { INotificationProps } from '../interfaces/notification.interface'
import { TouchableOpacity } from 'react-native'

function Notification({ source, name, receivedTime, message, online, seen = false }: INotificationProps) {
  const avatarName = getAvatarName(name)
  const time = dayjs(receivedTime).format('hh:mm A')
  return (
    <TouchableOpacity activeOpacity={0.85}>
      <HStack justifyContent="space-between" alignItems="center" mx={wp(4)} w="full">
        <HStack alignItems="center" space={3}>
          <Avatar bg="#544d80" size="md" source={source}>
            {avatarName}
            {online && <Avatar.Badge bg="green.500" />}
          </Avatar>
          <VStack maxWidth={wp(280)}>
            <Text>{message}</Text>
            <Text opacity={0.5} fontWeight={300} fontSize={hp(12)} lineHeight={hp(16)}>
              {time}
            </Text>
          </VStack>
        </HStack>
        {!seen && <Box borderRadius="full" boxSize={hp(8)} bgColor="#7F7CFF" />}
      </HStack>
    </TouchableOpacity>
  )
}

export default Notification
