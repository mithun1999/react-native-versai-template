import { hp, wp } from '@/utils/responsive.util'
import { Box, HStack, PresenceTransition, Pressable, Text, VStack } from 'native-base'
import React, { useState } from 'react'
// import FilterMenu from './FilterMenu'
import MUInput from '@/ui/atoms/inputs/MUInput'
import { SearchIcon } from '../../../icons'

function Header({
  searchText,
  setSearchText,
}: {
  searchText: string
  setSearchText: React.Dispatch<React.SetStateAction<string>>
}) {
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const toggleSearch = () => {
    setShowSearch((prev) => !prev)
  }

  return (
    <VStack mx={wp(15)} space={hp(8)}>
      <HStack justifyContent="space-between" alignItems="center">
        <Text fontSize={hp(24)} fontWeight={600}>
          Messages
        </Text>
        <HStack space={5}>
          <Pressable onPress={toggleSearch}>
            <SearchIcon />
          </Pressable>
          {/* <FilterMenu /> */}
        </HStack>
      </HStack>
      {showSearch && (
        <PresenceTransition
          visible={showSearch}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250,
            },
          }}
        >
          <MUInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Type a person, group or class"
            placeholderTextColor="rgba(255, 255, 255, 0.8)"
            autoFocus={true}
            h={hp(56)}
            InputLeftElement={
              <Box ml={wp(16)} opacity={0.5}>
                <SearchIcon size={hp(16)} />
              </Box>
            }
          />
        </PresenceTransition>
      )}
    </VStack>
  )
}

export default Header
