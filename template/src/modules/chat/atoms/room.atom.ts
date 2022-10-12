import { jotaiStorage } from '@/utils/jotai.utils'
import { atomWithStorage } from 'jotai/utils'
import { IFbChatRoom } from '../interfaces/chatAtom.interface'

const roomAtom = atomWithStorage<IFbChatRoom[]>('chatRoom', [], jotaiStorage)

export default roomAtom
