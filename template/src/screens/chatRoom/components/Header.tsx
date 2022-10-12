import { useNavigation } from '@react-navigation/native'
import { IChatRoomAtom } from '@/modules/chat/interfaces/chatAtom.interface'
import { getAvatarName } from '@/utils/string.utils'
import React from 'react'
import { HStack, Icon, IconButton, View, Text, Avatar, VStack } from 'native-base'
import { hp, wp } from '../../../utils/responsive.util'
import FeatherIcon from 'react-native-vector-icons/Feather'

function Header({ room }: { room: IChatRoomAtom | null }) {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()
  const avatarName = room ? getAvatarName(room?.user?.firstName) : 'Anonymous'

  return (
    <View height="13%">
      <HStack space={wp(4)} alignItems="center">
        <IconButton icon={<Icon as={FeatherIcon} name="arrow-left" color="white" />} onPress={goBack} />
        <HStack alignItems="center" space={wp(10)}>
          <Avatar bg="#544d80" size="md" source={{ uri: room ? room?.user?.image : undefined }}>
            {avatarName}
            {room && room?.user?.presence === 'ONLINE' && <Avatar.Badge bg="green.500" />}
          </Avatar>
          <VStack>
            <Text fontSize={hp(18)} fontWeight={600}>
              {room ? room?.user?.firstName : 'Anonymous'}
            </Text>
            {room && room?.user?.presence === 'ONLINE' && (
              <Text opacity={0.5} fontSize={hp(12)}>
                Active Now
              </Text>
            )}
          </VStack>
        </HStack>
      </HStack>
    </View>
  )
}

export default Header
