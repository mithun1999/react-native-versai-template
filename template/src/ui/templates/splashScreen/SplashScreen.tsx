import { HStack, Image } from 'native-base'
import React from 'react'

function SplashScreen() {
  return (
    <HStack bg="#4C00E1" justifyContent="center" alignItems="center" height="100%" width="100%">
      <Image source={require('../../../../assets/app_icon.png')} alt="Logo" width={150} resizeMode="contain" />
    </HStack>
  )
}

export default SplashScreen
