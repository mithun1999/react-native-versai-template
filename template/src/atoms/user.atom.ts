import { atomWithStorage } from 'jotai/utils'
import { jotaiStorage } from '../utils/jotai.utils'

export interface IUserAtom {
  firstName: string
  lastName: string
  email: string
  id: string
  role: string
}

export default atomWithStorage<IUserAtom | null>('user', null, jotaiStorage)
