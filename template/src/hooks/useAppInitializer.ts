import { useAtomValue, useSetAtom } from 'jotai'
import { useEffectOnce } from 'react-use'
import rememberUserAtom from '../atoms/rememberUser.atom'
import memberAtom from '../modules/chat/atoms/member.atom'
import roomAtom from '../modules/chat/atoms/room.atom'
import builderInstanceAtom from '../modules/firebase-rn/atoms/builder.atom'
import SecondaryFirebaseApp from '../modules/firebase-rn/initializer'
import roomChatAtom from '../modules/chat/atoms/roomChat.atom'
import { chatStorageAtom } from '../modules/chat/atoms/chat.atom'

function useAppInitializer() {
  // Initialize all the atoms with storage here
  useAtomValue(roomAtom)
  useAtomValue(memberAtom)
  useAtomValue(roomChatAtom)
  useAtomValue(chatStorageAtom)
  useAtomValue(rememberUserAtom)

  const setIsBuilderDbIniatilized = useSetAtom(builderInstanceAtom)

  useEffectOnce(() => {
    SecondaryFirebaseApp.initialize(() => setIsBuilderDbIniatilized(true))
  })
}

export default useAppInitializer
