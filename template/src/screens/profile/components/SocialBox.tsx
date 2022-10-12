import React, { useState } from 'react'
import { ISocialBoxProps } from '../interfaces/socialBox.interface'
import { Actionsheet, Button, HStack, Icon, IconButton, Image, Pressable, Text, useDisclose, VStack } from 'native-base'
import { hp, wp } from '@/utils/responsive.util'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MUInput from '@/ui/atoms/inputs/MUInput'
import { useAtomValue } from 'jotai'
import userDataAtom from '@/atoms/userData.atom'
import { logos } from '../staticData'
import firestore from '@react-native-firebase/firestore'
import Snackbar from 'react-native-snackbar'

export default function SocialBox({ social, socials, getSocials, exists }: ISocialBoxProps) {
  const { isOpen, onOpen, onClose } = useDisclose()
  const [value, setValue] = useState('')
  const user = useAtomValue(userDataAtom)
  const [loading, setLoading] = useState<boolean>(false)
  const userName = socials[social]
  const onAdd = async () => {
    if (user?.id) {
      setLoading(true)
      try {
        if (exists) {
          await firestore()
            .collection('profile')
            .doc(user?.id)
            .update({
              [social]: value,
            })
          setValue('')
          getSocials()
          onClose()
        } else {
          await firestore()
            .collection('profile')
            .doc(user?.id)
            .set({
              [social]: value,
            })
          setValue('')
          getSocials()
          onClose()
        }
      } catch (error) {
        // show error
        console.log(error)
        Snackbar.show({
          text: 'Failed to update',
          backgroundColor: '#d32f2f',
        })
      }
      setLoading(false)
    }
  }

  return (
    <>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        bgColor="rgba(255, 255, 255, 0.07)"
        borderRadius={12}
        px={wp(16)}
        py={hp(16)}
      >
        <Pressable onPress={onOpen}>
          <HStack alignItems="center" space={wp(12)}>
            <Image source={logos[social]} alt={social} />
            <Text fontWeight={500} fontSize={hp(16)} lineHeight={hp(20)} color="white" textTransform="capitalize">
              {social}
            </Text>
          </HStack>
        </Pressable>
        {userName ? (
          <Text fontWeight={400} fontSize={hp(14)} lineHeight={hp(14)} color="white" opacity={0.4}>
            {userName}
          </Text>
        ) : (
          <Text color="#96BAFF" fontWeight={500} fontSize={hp(14)} lineHeight={hp(20)} onPress={onOpen}>
            Add
          </Text>
        )}
      </HStack>
      <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
        <Actionsheet.Content py={hp(24)} px={wp(16)} bgColor="rgba(96, 72, 240, 0.8)">
          <VStack space={hp(24)} w="full">
            <HStack justifyContent="space-between" alignItems="center" w="full">
              <Text color="white" fontWeight={600} fontSize={hp(18)} lineHeight={hp(24)}>
                Add {social}
              </Text>
              <IconButton
                icon={<Icon as={Ionicons} name="close" color="white" />}
                p={wp(2)}
                borderRadius="full"
                onPress={onClose}
              />
            </HStack>
            <MUInput
              onChangeText={setValue}
              value={value}
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
              placeholder={`${social} username`}
              autoFocus
            />
            <Button
              h={hp(56)}
              borderRadius={8}
              bgColor="#5162FF"
              _pressed={{ opacity: '80' }}
              onPress={onAdd}
              isLoading={loading}
              disabled={loading}
            >
              <Text fontWeight={500} color="white" fontSize={hp(16)}>
                Add {social}
              </Text>
            </Button>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  )
}
