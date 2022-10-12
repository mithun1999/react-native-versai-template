import { ScrollView, VStack } from 'native-base'
import React from 'react'
import AppLayout from '../../ui/templates/appLayout'
import { hp, wp } from '../../utils/responsive.util'
import Header from './components/Header'
import Intro from './components/Intro'
import SocialAndLinks from './components/SocialAndLinks'

export default function Profile() {
  return (
    <AppLayout>
      <ScrollView>
        <VStack space={hp(24)} mx={wp(4)}>
          <VStack space={hp(16)}>
            <Header />
            <Intro />
          </VStack>
          <SocialAndLinks />
        </VStack>
      </ScrollView>
    </AppLayout>
  )
}
