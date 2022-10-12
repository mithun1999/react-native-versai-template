import { useRoute } from '@react-navigation/native'
import { useAtom } from 'jotai'
import { Box, Button, Checkbox, HStack, Icon, IconButton, Input, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ImageBackground, SafeAreaView } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Octicons from 'react-native-vector-icons/Octicons'
import rememberUserAtom from '../atoms/rememberUser.atom'
import useAuthentication from '../hooks/useAuthentication'
import Logo from '../ui/atoms/Logo'
import { hp } from '../utils/responsive.util'
import { parseQuery } from '../utils/string.utils'
import { supabase } from '../utils/supabase.utils'
// import LinearGradient from 'react-native-linear-gradient'

export default function Login() {
  const { params } = useRoute()

  const [remember, setRemember] = useAtom(rememberUserAtom)
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      email: remember?.email ?? '',
      password: remember?.password ?? '',
      remember_me: true,
    },
  })
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string>()

  const { googleSignIn, signIn, facebookSignIn } = useAuthentication()

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  const onSubmit = async ({
    email,
    password,
    remember_me,
  }: {
    email: string
    password: string
    remember_me: boolean
  }) => {
    setLoading(true)
    if (loginError) setLoginError('')

    try {
      const { user, error } = await signIn({ email, password })
      if (remember_me) setRemember({ email, password })
      else setRemember(null)
      if (error) {
        // console.log({ user, error })
        throw new Error(error.message)
      }
      if (user) reset()
    } catch (error: any) {
      setLoginError(error?.message || 'Something went wrong while login')
      // logger.logError('auth.customLogin', error)
    } finally {
      setLoading(false)
    }
  }

  const supabaseOAuthSigin = async () => {
    const param = params as undefined | { token: string }
    if (param && param.token) {
      const parsedQuery = parseQuery(param.token)
      if (parsedQuery && parsedQuery.refresh_token) {
        const { user, error } = await supabase.auth.signIn({
          refreshToken: parsedQuery.refresh_token,
        })
        if (error) {
          // console.log({ user, error })
          throw new Error(error.message)
        }
      }
    }
  }

  useEffect(() => {
    supabaseOAuthSigin()
  }, [params])

  return (
    <SafeAreaView>
      {/* <LinearGradient colors={['#1A1A40', '#271661', '#2e1474', '#341186']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}> */}
      <ImageBackground source={require('../assets/images/appBg.png')}>
        <Box
          px={6}
          pt={8}
          pb={10}
          // bgColor="#6a5acd"
          h="full"
          w="full"
          alignItems="center"
          justifyContent={'space-between'}
        >
          <Logo />
          <VStack w="full" alignItems="flex-start">
            <VStack>
              <Text fontWeight={600} fontSize={28} lineHeight={42} letterSpacing={'0.02em'} color="white">
                Login
              </Text>
              <Text fontWeight={400} fontSize={16} lineHeight={26} color="white">
                Please login to your Versai account.
              </Text>
            </VStack>
            <VStack mt={50} space={4}>
              <Controller
                control={control}
                name={'email'}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Input
                    w="full"
                    h={'56px'}
                    onChangeText={onChange}
                    value={value}
                    ref={ref}
                    InputLeftElement={<Icon as={EvilIcons} name="envelope" color="white" size={5} ml={4} />}
                    borderColor="transparent"
                    _focus={{
                      borderColor: 'transparent',
                    }}
                    bgColor="rgba(255, 255, 255, 0.05)"
                    color="white"
                    borderRadius={8}
                    placeholder="Your Email"
                  />
                )}
              />
              <Controller
                control={control}
                name={'password'}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Input
                    w="full"
                    h={'56px'}
                    type={passwordVisible ? 'text' : 'password'}
                    onChangeText={onChange}
                    value={value}
                    ref={ref}
                    InputLeftElement={<Icon as={Octicons} name="key" color="white" size={4} ml={4} mr={1} />}
                    InputRightElement={
                      <IconButton
                        mr={2}
                        onPress={togglePasswordVisibility}
                        _pressed={{ bgColor: 'transparent' }}
                        icon={
                          <Icon
                            as={FontAwesome}
                            name={passwordVisible ? 'eye' : 'eye-slash'}
                            color="white"
                            opacity={0.3}
                          />
                        }
                      />
                    }
                    bgColor="rgba(255, 255, 255, 0.05)"
                    color="white"
                    borderColor="transparent"
                    _focus={{
                      borderColor: 'transparent',
                    }}
                    borderRadius={8}
                    placeholder="Your Password"
                  />
                )}
              />
              <HStack alignItems="center" justifyContent={'space-between'}>
                <Controller
                  control={control}
                  name="remember_me"
                  render={({ field: { onChange, value, ref } }) => (
                    <HStack space={2} alignItems="center" ref={ref}>
                      <Checkbox
                        value="Remember me"
                        isChecked={value}
                        bgColor="rgba(255, 255, 255, 0.05)"
                        aria-label="remember me checkbox"
                        onChange={onChange}
                        _icon={{ color: 'white' }}
                        _checked={{ borderColor: 'white' }}
                      />
                      <Text color="white">Remember Me</Text>
                    </HStack>
                  )}
                />
                {/* <TouchableOpacity>
                  <Text color="white" fontWeight={600}>
                    Forgot Password
                  </Text>
                </TouchableOpacity> */}
              </HStack>
            </VStack>
          </VStack>
          <VStack w="full" space={4}>
            <Button
              h={hp(50)}
              borderRadius={8}
              bgColor="#5162FF"
              onPress={handleSubmit(onSubmit)}
              _pressed={{ opacity: '80' }}
              disabled={loading}
              isLoading={loading}
            >
              <Text fontWeight={500} color="white" fontSize={hp(16)}>
                Login
              </Text>
            </Button>
            <Button
              h={hp(50)}
              borderRadius={8}
              bgColor="white"
              _pressed={{ opacity: '80' }}
              onPress={googleSignIn}
              isLoading={loading}
              disabled={loading}
            >
              <HStack space={3} alignItems="center">
                <Icon as={AntDesign} name="google" color="black" size={6} />
                <Text fontWeight={500} color="black" fontSize={hp(16)}>
                  Continue with Google
                </Text>
              </HStack>
            </Button>
            <Button
              h={hp(50)}
              borderRadius={8}
              bgColor="white"
              _pressed={{ opacity: '80' }}
              onPress={facebookSignIn}
              isLoading={loading}
              disabled={loading}
            >
              <HStack space={3} alignItems="center">
                <Icon as={FontAwesome} name="facebook" color="black" size={6} />
                <Text fontWeight={500} color="black" fontSize={hp(16)}>
                  Continue with Facebook
                </Text>
              </HStack>
            </Button>
          </VStack>
          {/* <TouchableOpacity onPress={() => Linking.openURL('http://app.versaihq.com')}>
            <Text color="white">
              Not a user?{' '}
              <Text underline fontWeight={600}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity> */}
        </Box>
      </ImageBackground>
      {/* </LinearGradient> */}
    </SafeAreaView>
  )
}
