import firebase, { ReactNativeFirebase } from '@react-native-firebase/app'
import { Platform } from 'react-native'
import Config from 'react-native-config'

// Your secondary Firebase project credentials for Android...
const androidCredentials = {
  clientId: '974031114081-7o3tsn2dkoe28u5lf3rpf5d344egdoq3.apps.googleusercontent.com',
  appId: '1:974031114081:android:8fe2aa6c4a898ec6ccff20',
  apiKey: 'AIzaSyDM7PvdLEimIWGwjgnKrAb-r97P_8IDmxY',
  storageBucket: 'landing-page-d462e.appspot.com',
  messagingSenderId: Config.FIREBASE_BUILDER_MESSAGING_SENDER_ID || '974031114081',
  projectId: 'landing-page-d462e',
  databaseURL: '',
}

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  clientId: '974031114081-v43nuvahjuq11ji49eg53bfslac8ifhu.apps.googleusercontent.com',
  appId: '1:974031114081:ios:13a48b2cc15a7599ccff20',
  apiKey: 'AIzaSyBZWUzmSqJbJEbt5gi6OwxhEgj7lHjMmy8',
  storageBucket: 'landing-page-d462e.appspot.com',
  messagingSenderId: Config.FIREBASE_BUILDER_MESSAGING_SENDER_ID || '974031114081',
  projectId: 'landing-page-d462e',
  databaseURL: '',
}

// Select the relevant credentials
const credentials = Platform.select({
  android: androidCredentials,
  ios: iosCredentials,
}) as any

const config = {
  name: 'SECONDARY_APP_BUILDER',
}

class SecondaryFirebaseApp {
  private static instance: ReactNativeFirebase.FirebaseApp | null

  static getInstance() {
    if (!SecondaryFirebaseApp.instance) return null
    return SecondaryFirebaseApp.instance
  }

  static async initialize(cb: () => void) {
    const apps = firebase.apps
    let fbApp: ReactNativeFirebase.FirebaseApp | null = null
    apps.forEach((app) => {
      if (app.name === config.name) fbApp = app
    })
    if (fbApp) {
      SecondaryFirebaseApp.instance = fbApp
    } else if (!SecondaryFirebaseApp.instance) {
      try {
        SecondaryFirebaseApp.instance = await firebase.initializeApp(credentials, config)
        cb()
      } catch (error) {
        console.log(error)
      }
    }
  }

  static destroyInstance() {
    SecondaryFirebaseApp.instance = null
  }
}

export default SecondaryFirebaseApp
