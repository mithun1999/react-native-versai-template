import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useSetAtom } from 'jotai'
import { Box, Text, View } from 'native-base'
import React from 'react'
import { ImageBackground, Linking, SafeAreaView, TouchableOpacity } from 'react-native'
import initialAtom from '../atoms/initial.atom'
import { AuthStackParam } from '../navigation/stack.interface'
import Button from '../ui/atoms/button'
import Logo from '../ui/atoms/logo'
import { hp } from '../utils/responsive.util'
import { onboardingStyles as styles } from './styles/onboarding.style'

function Onboarding() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParam>>()
  const setAlreadyLaunched = useSetAtom(initialAtom)

  function handleBoarding() {
    setAlreadyLaunched((prev) => ({ ...prev, alreadyLaunched: true }))
    navigation.navigate('Login')
  }

  function handleMore() {
    Linking.openURL('https://versaihq.com')
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/png/onboarding.png')}
        resizeMode="cover"
        style={styles.bgImage}
      >
        <SafeAreaView style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            <View>
              <Logo />
              <Text style={styles.mainText} color="white" mt={4}>
                Your handy sidekick to run your business.
              </Text>
              <Text color="white" fontSize={hp(16)} mt={3} opacity={80}>
                Use this app while you’re away from your computer to run the most vital aspects of your business,
                without skipping a beat.
              </Text>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <Button onPress={handleBoarding}>Let's get started</Button>
            <TouchableOpacity onPress={handleMore}>
              <Text textAlign={`center`} mt={2} textDecorationLine="underline">
                Learn More
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  )
}

export default Onboarding
