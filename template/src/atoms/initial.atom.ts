import { atomWithStorage } from 'jotai/utils'
import { jotaiStorage } from '../utils/jotai.utils'

export interface IInitialData {
  alreadyLaunched: boolean
}

const initial = {
  alreadyLaunched: false,
}

export default atomWithStorage<IInitialData>('initial-data', initial, jotaiStorage)
