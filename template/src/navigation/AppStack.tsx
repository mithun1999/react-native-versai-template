import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import useInitializer from '../modules/chat/hooks/useInitializer'
import { Feedback, NewChat, ChatRoom } from '../screens'
import AppTab from './AppTab'
import { AppStackParam } from './stack.interface'

const Stack = createNativeStackNavigator<AppStackParam>()

function AppStack() {
  useInitializer()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="AppTab"
    >
      <Stack.Screen name="AppTab" component={AppTab} />
      <Stack.Screen name="NewConversation" component={NewChat} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  )
}

export default AppStack
