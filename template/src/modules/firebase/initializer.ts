import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { FirestoreSettings, getFirestore, initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { builderConfig, firebaseConfig } from '../../config/firebase.config'

export function fbInitializer() {
  const app = initializeApp(firebaseConfig)
  const builderApp = initializeApp(builderConfig, 'secondary')

  const firestoreSettings: FirestoreSettings & { useFetchStreams: boolean; merge: boolean } = {
    experimentalForceLongPolling: true,
    // experimentalAutoDetectLongPolling: true,
    useFetchStreams: false,
    merge: true,
  }

  const firestore = initializeFirestore(app, firestoreSettings)
  const storage = getStorage(app)
  const realtimeDb = getDatabase(app)

  const builderDb = getFirestore(builderApp)

  return {
    app,
    firestore,
    storage,
    realtimeDb,
    builderDb,
  }
}
