import React, { useState } from 'react'
import { HStack, Popover, Pressable, Text, VStack } from 'native-base'
import { SortIcon } from '../../../icons'
import { hp, wp } from '@/utils/responsive.util'
import FeatherIcon from 'react-native-vector-icons/Feather'

export default function FilterMenu() {
  const [selectedOpt, setSelectedOpt] = useState<
    'All Chat' | 'Direct Messages' | 'Classes' | 'Groups' | 'Requests' | 'Live Chats'
  >('All Chat')

  const options = ['All Chat', 'Direct Messages', 'Classes', 'Groups', 'Requests', 'Live Chats']

  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Pressable {...triggerProps}>
            <SortIcon />
          </Pressable>
        )
      }}
      placement="bottom right"
    >
      <Popover.Content w={wp(175)} borderRadius={8}>
        <Popover.Body>
          <VStack p={2}>
            {options.map((opt: any) => (
              <Option key={opt} setSelectedOpt={setSelectedOpt} selectedOpt={selectedOpt} opt={opt} />
            ))}
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover>
  )
}

const Option = ({
  setSelectedOpt,
  selectedOpt,
  opt,
}: {
  setSelectedOpt: React.Dispatch<
    React.SetStateAction<'All Chat' | 'Direct Messages' | 'Classes' | 'Groups' | 'Requests' | 'Live Chats'>
  >
  selectedOpt: 'All Chat' | 'Direct Messages' | 'Classes' | 'Groups' | 'Requests' | 'Live Chats'
  opt: 'All Chat' | 'Direct Messages' | 'Classes' | 'Groups' | 'Requests' | 'Live Chats'
}) => {
  return (
    <Pressable onPress={() => setSelectedOpt(opt)}>
      <HStack justifyContent={'space-between'} w="full" py={hp(10)} alignItems="center">
        <Text color="white">{opt}</Text>
        {selectedOpt === opt && <FeatherIcon name="check" color="white" />}
      </HStack>
    </Pressable>
  )
}
