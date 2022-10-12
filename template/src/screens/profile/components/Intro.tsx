import userDataAtom from '@/atoms/userData.atom'
import { hp, wp } from '@/utils/responsive.util'
import { useAtomValue } from 'jotai'
import { Avatar, HStack, Text, VStack } from 'native-base'
import React from 'react'
import { getAvatarName } from '../../../utils/string.utils'

export default function Intro() {
  const user = useAtomValue(userDataAtom)
  const name = (user?.firstName || 'Anonymous') + ' ' + (user?.lastName || 'user')
  const avatarName = getAvatarName(name)

  return (
    <HStack space={wp(16)} alignItems="center">
      <Avatar bg="#544d80" size="lg" source={{ uri: user?.image?.url || '' }}>
        {avatarName}
      </Avatar>
      <VStack space={hp(12)}>
        <Text fontWeight={600} fontSize={hp(18)} lineHeight={hp(18)} color="white">
          {name}
        </Text>
        <Text color="white" opacity={0.5} fontSize={hp(14)} lineHeight={hp(14)} fontWeight={400}>
          {user?.email || ''}
        </Text>
      </VStack>
    </HStack>
  )
}
