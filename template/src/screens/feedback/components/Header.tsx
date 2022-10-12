import React from 'react'
import { HStack, Icon, IconButton, Text, VStack } from 'native-base'
import { hp, wp } from '@/utils/responsive.util'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'

export default function Header() {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  return (
    <HStack space={wp(16)} mx={wp(15)} alignItems="center">
      <IconButton icon={<Icon as={FeatherIcon} name="arrow-left" color="white" />} onPress={goBack} />
      <Text fontSize={hp(24)} fontWeight={600}>
        Feedback
      </Text>
    </HStack>
  )
}
