import React from 'react'
import { Button, HStack, Text } from 'native-base'
import { hp, wp } from '@/utils/responsive.util'
import { TouchableOpacity } from 'react-native'

export default function Header() {
  return (
    <HStack justifyContent={'space-between'} alignItems="center">
      <Text fontSize={hp(24)} fontWeight={600}>
        Profile
      </Text>
      <TouchableOpacity activeOpacity={0.8}>
        <Text color="#BAAFFF" fontSize={hp(16)} fontWeight={600} textAlign="right" lineHeight={hp(24)}>
          Edit
        </Text>
      </TouchableOpacity>
    </HStack>
  )
}
