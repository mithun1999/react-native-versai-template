import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, PresenceTransition } from 'native-base'
import { SearchIcon } from '../../../icons'
import { FormInput } from '../../../ui/molecules/FormInput'

export default function useSearchInput() {
  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      search: '',
    },
  })
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const toggleSearch = () => {
    setShowSearch((prev) => !prev)
  }

  return {
    searchButton: (
      <Pressable onPress={toggleSearch}>
        <SearchIcon />
      </Pressable>
    ),
    searchInput: showSearch ? (
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
        <FormInput control={control} autoFocus={true} name="search" placeholder="Search messages" />
      </PresenceTransition>
    ) : (
      <></>
    ),
  }
}
