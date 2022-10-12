import React from 'react'
import { ScrollView, Text, VStack } from 'native-base'
import { hp } from '@/utils/responsive.util'
import Notification from './Notification'

export default function Notifications() {
  return (
    <ScrollView mt={hp(16)} width="100%">
      <VStack space={hp(16)}>
        <DateComp text="Today" />
        {[1, 2, 3, 4, 5, 6].map((d) => (
          <Notification
            key={d}
            name="Mithun Kumar"
            message="Alex Bernat has registered for a Hip Hop Dan class"
            receivedTime={new Date()}
            online
          />
        ))}
        <DateComp text="Yesterday" />
        {[1, 2, 3, 4, 5, 6].map((d) => (
          <Notification
            key={d}
            name="Mithun Kumar"
            message="Alex Bernat has registered for a Hip Hop Dance class"
            receivedTime={new Date()}
            seen
          />
        ))}
      </VStack>
    </ScrollView>
  )
}

const DateComp = ({ text }: { text: string }) => {
  return (
    <Text
      color="white"
      fontSize={hp(12)}
      fontWeight={600}
      opacity={0.4}
      letterSpacing={'0.08em'}
      textTransform="uppercase"
    >
      {text}
    </Text>
  )
}
