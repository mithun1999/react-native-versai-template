import userDataAtom from '@/atoms/userData.atom'
import { builderDb } from '@/modules/firebase'
import { hp, wp } from '@/utils/responsive.util'
import { collection, doc, getDoc } from 'firebase/firestore'
import { useAtom, useAtomValue } from 'jotai'
import { HStack, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Linking, Share, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import SecondaryFirebaseApp from '@/modules/firebase-rn/initializer'
import builderInstanceAtom from '@/modules/firebase-rn/atoms/builder.atom'

export default function VersaiLinkBox({ type }: { type: string }) {
  const [user, setUser] = useAtom(userDataAtom)
  const [fetchBuilderDataLoading, setFetchBuilderDataLoading] = useState(true)
  const instance = SecondaryFirebaseApp.getInstance()
  const IsBuilderDbIniatilized = useAtomValue(builderInstanceAtom)

  const getBuilderData = async () => {
    setFetchBuilderDataLoading(true)
    try {
      if (user?.id && instance) {
        const builderDoc = await firestore(instance).collection('builder').doc(user?.id).get()
        const builderData = builderDoc.data()
        if (
          builderDoc.exists &&
          builderData &&
          typeof builderData === 'object' &&
          Object.keys(builderData).length > 0
        ) {
          const data = builderDoc.data()
          const ref = data?.ref
          if (user) await setUser((prev: any) => ({ ...prev, domainRef: ref ?? '' }))
        } else {
          await setUser((prev: any) => ({ ...prev, domainRef: '' }))
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      setFetchBuilderDataLoading(false)
    }
  }

  const shareData = async () => {
    if (!user?.domainRef) {
      Linking.openURL('https://www.versaihq.com/builder')
      return
    }

    const link =
      type === 'storeFront' ? `https://store.versaihq.com/${user?.domainRef}` : `https://vers.ai/${user?.domainRef}`

    try {
      await Share.share({
        message: link,
      })
    } catch (error: any) {
      alert(error.message)
    }
  }

  useEffect(() => {
    getBuilderData()
  }, [instance, IsBuilderDbIniatilized])

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      bgColor="rgba(255, 255, 255, 0.07)"
      borderRadius={12}
      px={wp(16)}
      py={hp(16)}
    >
      <Text fontWeight={500} fontSize={hp(16)} lineHeight={hp(20)} color="white">
        {type === 'storeFront' ? 'Versai Storefront' : 'Versai Link-In-Bio'}
      </Text>
      <TouchableOpacity activeOpacity={0.6} onPress={shareData} disabled={fetchBuilderDataLoading}>
        <Text fontWeight={500} lineHeight={hp(16.8)} fontSize={hp(14)} color="#96BAFF">
          {user?.domainRef ? 'Share Link' : `Set up ${type}`}
        </Text>
      </TouchableOpacity>
    </HStack>
  )
}
