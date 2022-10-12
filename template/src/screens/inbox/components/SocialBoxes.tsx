import React, { useEffect, useMemo, useState } from 'react'
import { Box, HStack, Image, Text } from 'native-base'
import { hp, wp } from '@/utils/responsive.util'
import { logos } from '../../profile/staticData'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '@/modules/firebase'
import { Linking, TouchableOpacity } from 'react-native'

type ISocials = Record<'instagram' | 'facebook' | 'linkedIn' | 'tikTok', string>

export default function SocialBoxes({ userId }: { userId: string }) {
  const [socials, setSocials] = useState<ISocials | null>(null)

  const getSocials = async () => {
    const docRef = doc(firestore, 'profile', userId)
    const docSnap = await getDoc(docRef)
    const data = docSnap.data() as ISocials
    setSocials(data)
  }

  useEffect(() => {
    getSocials()
  }, [])

  return (
    <HStack flexWrap="wrap" space={wp(8)}>
      {socials &&
        Object.keys(socials).map((key) => {
          const typedKey = key as 'instagram' | 'facebook' | 'linkedIn' | 'tikTok'
          const typedValue = socials[typedKey]
          return <SocialBox key={typedKey} social={typedKey} username={typedValue} />
        })}
    </HStack>
  )
}

export const SocialBox = ({
  social,
  username,
}: {
  social: 'instagram' | 'facebook' | 'linkedIn' | 'tikTok'
  username: string
}) => {
  const link = useMemo(() => {
    switch (social) {
      case 'instagram':
        return `https://www.instagram.com/${username}`
      case 'linkedIn':
        return username
      case 'facebook':
        return username
      case 'tikTok':
        return `https://www.tiktok.com/${username}`
      default:
        return ''
    }
  }, [])

  const redirect = () => {
    Linking.openURL(link)
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={redirect}>
      <HStack
        bgColor="rgba(255, 255, 255, 0.07)"
        borderRadius={8}
        py={hp(12)}
        px={wp(8)}
        space={wp(4)}
        alignItems="center"
      >
        <Image source={logos[social]} alt={social} boxSize={hp(16)} />
        <Text fontWeight={500} fontSize={hp(14)} lineHeight={hp(20)} textDecoration="capitalize">
          {social}
        </Text>
      </HStack>
    </TouchableOpacity>
  )
}
