import useAuth from '@/hooks/useAuthentication'
import { Logout } from '@/icons/Logout'
import { hp, wp } from '@/utils/responsive.util'
import { HStack, Pressable, Text } from 'native-base'
import React from 'react'

export default function LogoutBox() {
  const { logOut } = useAuth()

  return (
    <Pressable onPress={logOut}>
      <HStack
        alignItems="center"
        bgColor="rgba(255, 255, 255, 0.07)"
        borderRadius={12}
        px={wp(16)}
        py={hp(16)}
        space={wp(12)}
      >
        <Logout />
        <Text fontWeight={500} lineHeight={hp(20)} fontSize={hp(16)} color="#FA9292">
          Logout
        </Text>
      </HStack>
    </Pressable>
  )
}
