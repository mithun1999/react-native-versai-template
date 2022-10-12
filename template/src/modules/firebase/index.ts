import { fbInitializer } from './initializer'

export const { app: firebaseApp, firestore, storage, realtimeDb, builderDb } = fbInitializer()
