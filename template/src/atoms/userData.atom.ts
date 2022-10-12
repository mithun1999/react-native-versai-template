import { atomWithStorage } from 'jotai/utils'
import { jotaiStorage } from '../utils/jotai.utils'

export interface IUserDataAtom {
  firstName: string
  lastName: string
  email: string
  id: string
  role: string
  ref: string
  image?: { url: string }
  mediaId?: string
  referralCode?: string
  playlists?: object[]
  timeDifference?: number
  domainRef?: string
  songs?: { id: string; medias: object[]; createdAt: string; updatedAt: string }
}

export default atomWithStorage<IUserDataAtom | null>('userData', null, jotaiStorage)
