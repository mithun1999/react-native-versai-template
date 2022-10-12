import React, { ReactNode } from 'react'
import { ImageBackground, SafeAreaView } from 'react-native'
import { appLayoutStyles as styles } from './appLayout.style'

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ImageBackground source={require('../../../assets/images/appBg.png')} resizeMode="cover" style={styles.container}>
      <SafeAreaView style={styles.viewContainer}>{children}</SafeAreaView>
    </ImageBackground>
  )
}

export default AppLayout
