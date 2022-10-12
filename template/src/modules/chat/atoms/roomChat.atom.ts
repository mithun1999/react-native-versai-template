import { jotaiStorage } from '@/utils/jotai.utils'
import { atomWithStorage } from 'jotai/utils'
import { IChatMessage } from '../interfaces/chatAtom.interface'

export default atomWithStorage<Record<string, IChatMessage[]> | null>('chatRoomMessages', null, jotaiStorage)
