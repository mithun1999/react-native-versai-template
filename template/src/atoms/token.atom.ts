import { atomWithStorage } from 'jotai/utils'
import { jotaiStorage } from '../utils/jotai.utils'

export default atomWithStorage<string>('accessToken', '', jotaiStorage)
