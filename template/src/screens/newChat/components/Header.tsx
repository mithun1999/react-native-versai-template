import React, { Dispatch } from 'react'
import { HStack, Icon, IconButton, Text, VStack } from 'native-base'
import { hp, wp } from '@/utils/responsive.util'
import FeatherIcon from 'react-native-vector-icons/Feather'
import SearchInput from './SearchInput'
import { useNavigation } from '@react-navigation/native'
import { SetStateAction } from 'jotai'

export default function Header({
  loading = false,
  searchText,
  setSearchText,
}: {
  loading?: boolean
  searchText: string
  setSearchText: Dispatch<SetStateAction<string>>
}) {
  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  return (
    <VStack mx={wp(15)} space={hp(16)}>
      <HStack space={wp(4)} alignItems="center">
        <IconButton icon={<Icon as={FeatherIcon} name="arrow-left" color="white" />} onPress={goBack} />
        <Text fontSize={hp(24)} fontWeight={600}>
          New Conversation
        </Text>
      </HStack>
      {!loading && <SearchInput setSearchText={setSearchText} searchText={searchText} />}
    </VStack>
  )
}
