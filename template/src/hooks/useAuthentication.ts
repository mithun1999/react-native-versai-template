import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { Linking } from 'react-native'
import tokenAtom from '../atoms/token.atom'
import userAtom from '../atoms/user.atom'
import supabaseConfig from '../config/supabase.config'
import { chatStorageAtom } from '../modules/chat/atoms/chat.atom'
import memberAtom from '../modules/chat/atoms/member.atom'
import roomAtom from '../modules/chat/atoms/room.atom'
import roomChatAtom from '../modules/chat/atoms/roomChat.atom'
import { supabase } from '../utils/supabase.utils'

const useAuth = () => {
  const setAccessToken = useSetAtom(tokenAtom)
  const setUser = useSetAtom(userAtom)
  const setChatRoom = useSetAtom(roomChatAtom)
  const setChatMember = useSetAtom(memberAtom)
  const setRooms = useSetAtom(roomAtom)
  const setChat = useSetAtom(chatStorageAtom)

  const logOut = () => {
    supabase.auth.signOut().then(async () => {
      await setAccessToken(RESET)
      await setUser(RESET)
      await setChatRoom(RESET)
      await setChatMember(RESET)
      await setRooms(RESET)
      await setChat(RESET)
    })
  }
  const signIn = async (loginData: { email: string; password: string }) => await supabase.auth.signIn(loginData)

  const googleSignIn = () => {
    let googleAuthUrl = `${supabaseConfig.url}/auth/v1/authorize?provider=google&redirect_to=versai://login/`
    Linking.openURL(googleAuthUrl)
  }

  const facebookSignIn = () => {
    let fbAuthUrl = `${supabaseConfig.url}/auth/v1/authorize?provider=facebook&redirect_to=versai://login/`
    Linking.openURL(fbAuthUrl)
  }

  return { signIn, googleSignIn, facebookSignIn, logOut }
}
export default useAuth
