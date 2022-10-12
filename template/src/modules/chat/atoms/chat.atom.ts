import { jotaiStorage } from '@/utils/jotai.utils'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { IChatAtom, IChatStorageAtom } from '../interfaces/chatAtom.interface'

const chatAtom = atom<IChatAtom>({ initialized: false, isRoomFetchLoading: false })
export const chatStorageAtom = atomWithStorage<IChatStorageAtom>(
  'chat-storage-room',
  { firstMessageKey: null },
  jotaiStorage,
)

export default chatAtom
