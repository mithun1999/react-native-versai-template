import { atomWithStorage } from 'jotai/utils'
import { jotaiStorage } from '../utils/jotai.utils'

export interface IRememberUserAtom {
  email: string
  password: string
}

export default atomWithStorage<IRememberUserAtom | null>('remember-user', null, jotaiStorage)
