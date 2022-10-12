// In App.js in a new project
import { Provider as JotaiProvider } from 'jotai'
import { NativeBaseProvider } from 'native-base'
import React, { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { nbTheme } from '../config/theme.config'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FeatherIcons from 'react-native-vector-icons/Feather'
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import Wrapper from './Wrapper'
import SplashScreen from '../ui/templates/splashScreen'
import VersionPop from '../modules/versioning/VersionPop'
import RNBootSplash from 'react-native-bootsplash'

EvilIcons.loadFont()
Octicons.loadFont()
FontAwesome.loadFont()
AntDesign.loadFont()
FeatherIcons.loadFont()
MCIcons.loadFont()
MaterialIcon.loadFont()
Ionicons.loadFont()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#1A1A40',
  },
}

const linking = {
  prefixes: ['versai://'],
  config: {
    screens: {
      Login: {
        path: 'login/:token',
        parse: {
          token: (token: string) => `${token}`,
        },
      },
    },
  },
}

function App() {
  return (
    <JotaiProvider>
      <NativeBaseProvider theme={nbTheme}>
        <Suspense fallback={<SplashScreen />}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer theme={navTheme} linking={linking} onReady={() => RNBootSplash.hide({ fade: true })}>
              <Wrapper />
              <VersionPop />
            </NavigationContainer>
          </QueryClientProvider>
        </Suspense>
      </NativeBaseProvider>
    </JotaiProvider>
  )
}

export default App
