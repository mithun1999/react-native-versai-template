import useChat from '@/modules/chat/hooks/useChat'
import { IChatUser } from '@/modules/chat/interfaces/chatAtom.interface'
import { hp, wp } from '@/utils/responsive.util'
import { getAvatarName } from '@/utils/string.utils'
import { Actionsheet, Avatar, Button, HStack, Icon, IconButton, Text, useDisclose, VStack } from 'native-base'
import React from 'react'
import MIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SocialBoxes from './SocialBoxes'

export default function ProfileDrawer({
  user,
  isOpen,
  onClose,
  roomId,
}: {
  user: IChatUser | undefined
  isOpen: boolean
  onClose: () => void
  roomId: string
}) {
  const name = user ? user?.firstName + ' ' + user?.lastName : 'Anonymous User'
  const avatarName = getAvatarName(name)
  const { sendChat } = useChat(roomId)

  function sendHello() {
    sendChat({ messageText: '👋' })
    onClose()
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
      <Actionsheet.Content py={hp(24)} px={wp(16)} bgColor="rgba(96, 72, 240, 0.8)">
        <VStack space={hp(32)} w="full">
          <VStack space={hp(20)}>
            <HStack justifyContent="space-between">
              <HStack space={wp(16)} alignItems="center">
                <Avatar size="lg" source={{ uri: user?.image }}>
                  {avatarName}
                </Avatar>
                <VStack space={hp(6)}>
                  <Text fontSize={hp(18)} fontWeight={600} lineHeight={hp(18)}>
                    {name}
                  </Text>
                  <Text fontWeight={400} fontSize={hp(14)} lineHeight={hp(14)}>
                    {user?.email || 'samantha278@gmail.com'}
                  </Text>
                  <Text fontWeight={400} fontSize={hp(14)} lineHeight={hp(14)} opacity={0.5}>
                    Student since Oct 2018
                  </Text>
                </VStack>
              </HStack>
              <IconButton icon={<Icon as={MIcons} name="dots-horizontal" color="white" />} />
            </HStack>
            <SocialBoxes userId={user?.id || ''} />
          </VStack>
          <VStack space={hp(16)}>
            <Button
              fontSize={hp(18)}
              lineHeight={hp(22)}
              fontWeight={500}
              letterSpacing={'0.03em'}
              borderRadius={8}
              borderColor="rgba(255,255,255, 0.3)"
              borderWidth={hp(1)}
              bgColor="transparent"
              h={hp(56)}
              onPress={sendHello}
            >
              👋 High Five!
            </Button>
            <Button h={hp(56)} borderRadius={8} bgColor="#5162FF" _pressed={{ opacity: '80' }}>
              <Text fontWeight={500} color="white" fontSize={hp(16)}>
                Invite to chat on Versai
              </Text>
            </Button>
          </VStack>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  )
}
