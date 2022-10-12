import React from 'react'
import { HStack, Icon, IconButton, Text } from 'native-base'
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { hp } from '@/utils/responsive.util'

export default function Header() {
  return (
    <HStack justifyContent={'space-between'} alignItems="center">
      <Text fontSize={hp(24)} fontWeight={600}>
        Notification
      </Text>
      <IconButton icon={<Icon as={MIcons} name="dots-horizontal" color="white" />} />
    </HStack>
  )
}
