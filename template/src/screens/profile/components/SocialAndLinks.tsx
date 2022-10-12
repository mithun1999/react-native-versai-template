import userDataAtom from '@/atoms/userData.atom'
import { hp } from '@/utils/responsive.util'
import { useAtomValue } from 'jotai'
import { VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import LogoutBox from './LogoutBox'
import SocialBox from './SocialBox'
import VersaiLinkBox from './VersaiLinkBox'
import firestore from '@react-native-firebase/firestore'
import { ISocialProps } from '../interfaces/socialBox.interface'

export default function SocialAndLinks() {
  const user = useAtomValue(userDataAtom)
  const [socials, setSocials] = useState<any>({
    instagram: '',
    linkedIn: '',
    facebook: '',
    tikTok: '',
  })
  const [exists, setExists] = useState<boolean>(false)

  const getSocials = async () => {
    if (user?.id) {
      const documentSnapshot = await firestore().collection('profile').doc(user?.id).get()
      setExists(documentSnapshot.exists)
      if (documentSnapshot.exists) {
        setSocials((prev: any) => ({ ...prev, ...documentSnapshot.data() }))
      }
    }
  }

  useEffect(() => {
    getSocials()
  }, [])

  return (
    <VStack space={hp(16)}>
      {socials &&
        Object.keys(socials || {}).map((social: any) => {
          return (
            <SocialBox key={social} social={social || ''} socials={socials} getSocials={getSocials} exists={exists} />
          )
        })}
      {['storeFront', 'link-in-bio'].map((type: string) => {
        return <VersaiLinkBox key={type} type={type} />
      })}
      <LogoutBox />
    </VStack>
  )
}
