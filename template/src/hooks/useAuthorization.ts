import { AxiosError } from 'axios'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import tokenAtom from '../atoms/token.atom'
import userAtom, { IUserAtom } from '../atoms/user.atom'
import userDataAtom from '../atoms/userData.atom'
import { getUser } from '../modules/profile/api/user.api'
import { axiosInstance } from '../utils/axios.utils'
import { supabase } from '../utils/supabase.utils'
import useAuthentication from './useAuthentication'
import { useNetInfo } from '@react-native-community/netinfo'
import Snackbar from 'react-native-snackbar'

function useAuthorization() {
  const setUser = useSetAtom(userAtom)
  const setAccessToken = useSetAtom(tokenAtom)
  const setUserData = useSetAtom(userDataAtom)
  const token = useAtomValue(tokenAtom)
  const netInfo = useNetInfo()
  const { logOut } = useAuthentication()

  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) =>
        Promise.reject(() => {
          if ((error && error.response && error.response?.status === 401) || error.response?.status === 403) {
            Snackbar.show({
              text: 'Session timed out. Please sign-in again',
              backgroundColor: '#d32f2f',
            })
            logOut()
          }
        }),
    )
  }

  function getUsername(user: any) {
    const firstName = user?.first_name
    const lastName = user?.last_name
    if (firstName && lastName) return { firstName, lastName }
    const fullName = (user?.full_name || user?.name || 'Anonymous User').split(' ')
    return { firstName: fullName[0] ?? '', lastName: fullName[1] ?? '' }
  }

  async function authCheck() {
    if (token && netInfo.isConnected && netInfo.isInternetReachable) {
      const res = await getUser()
      if (
        res &&
        res.error &&
        res.error.response &&
        (res.error.response.status === 401 || res.error.response.status === 403)
      ) {
        Snackbar.show({
          text: 'Session timed out. Please sign-in again',
          backgroundColor: '#d32f2f',
        })
        logOut()
      } else if (res && res.id) {
        await setUserData(res)
      } else {
        Snackbar.show({
          text: 'Session timed out. Please sign-in again',
          backgroundColor: '#d32f2f',
        })
        logOut()
      }
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        if (session && session.access_token) {
          const user = session.user
          let userData: IUserAtom | null = null
          if (user) {
            if (user.app_metadata?.provider === 'email') {
              userData = {
                email: user?.email as string,
                id: user?.id,
                role: user?.user_metadata.role,
                ...getUsername(user?.user_metadata),
              }
            } else if (user.app_metadata?.provider === 'google') {
              userData = {
                email: user?.email as string,
                id: user?.id,
                role: 'teacher',
                ...getUsername(user?.user_metadata),
              }
            }
          }
          await setAccessToken(session.access_token)
          if (userData) await setUser(userData)
        }
      }
    })
    return () => {
      authListener!.unsubscribe()
    }
  }, [])

  useEffect(() => {
    authCheck()
  }, [netInfo.isConnected, netInfo.isInternetReachable, token])
}

export default useAuthorization
