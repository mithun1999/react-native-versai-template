import { jotaiStorage } from '@/utils/jotai.utils'
import { atomWithStorage } from 'jotai/utils'
import { IChatUser } from '../interfaces/chatAtom.interface'

const memberAtom = atomWithStorage<Record<string, IChatUser> | null>('chatRoomMembers', null, jotaiStorage)

export default memberAtom
