import AsyncStorage from '@react-native-async-storage/async-storage'
import { createJSONStorage } from 'jotai/utils'

export const jotaiStorage = createJSONStorage(() => AsyncStorage) as any
