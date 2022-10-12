import React, { Dispatch, SetStateAction, useState } from 'react'
import MUInput from '@/ui/atoms/inputs/MUInput'
import { SearchIcon } from '../../../icons'
import { hp, wp } from '@/utils/responsive.util'
import { Box } from 'native-base'

export default function SearchInput({
  searchText,
  setSearchText,
}: {
  searchText: string
  setSearchText: Dispatch<SetStateAction<string>>
}) {
  return (
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
  )
}
