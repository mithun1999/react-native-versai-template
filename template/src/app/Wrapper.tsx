import { useAtomValue } from 'jotai'
import React from 'react'
import tokenAtom from '../atoms/token.atom'
import useAppInitializer from '../hooks/useAppInitializer'
import useAuthorization from '../hooks/useAuthorization'
import AppStack from '../navigation/AppStack'
import AuthStack from '../navigation/AuthStack'

export default function Wrapper() {
  const token = useAtomValue(tokenAtom)
  useAuthorization()
  useAppInitializer()

  if (token) return <AppStack />
  return <AuthStack />
}
