import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAtomValue } from 'jotai'
import React from 'react'
import initialAtom from '../atoms/initial.atom'
import Login from '../screens/Login'
import Onboarding from '../screens/Onboarding'
import { AuthStackParam } from './stack.interface'

const Stack = createNativeStackNavigator<AuthStackParam>()

function AuthStack() {
  const isAlreadyLaunched = useAtomValue(initialAtom).alreadyLaunched

  const initialRoute = isAlreadyLaunched ? 'Login' : 'Onboarding'

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  )
}

export default AuthStack
