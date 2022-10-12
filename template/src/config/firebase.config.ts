import Config from 'react-native-config'

export const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY || 'AIzaSyBRal0ncZUrvtnXxJYVPYsfQWcaHhAvFtI',
  appId: Config.FIREBASE_APP_ID || '1:696906619357:web:925d9e736ede0793f63e34',
  authDomain: Config.FIREBASE_AUTH_DOMAIN || 'user-dashboard-1d2aa.firebaseapp.com',
  measurementId: Config.FIREBASE_MEASUREMENT_ID || 'G-FCSDG082ZV',
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID || '696906619357',
  projectId: Config.FIREBASE_PROJECT_ID || 'user-dashboard-1d2aa',
  storageBucket: Config.FIREBASE_STORAGE_BUCKET || 'user-dashboard-1d2aa.appspot.com',
  databaseURL: Config.FIREBASE_DATABASE_URL || 'https://user-dashboard-1d2aa-default-rtdb.firebaseio.com',
}

export const builderConfig = {
  apiKey: Config.FIREBASE_BUILDER_API_KEY || 'AIzaSyBUIYMF0UIXIXe9kG31u0P1hImCTVZ0O0o',
  authDomain: Config.FIREBASE_BUILDER_AUTH_DOMAIN || 'landing-page-d462e.firebaseapp.com',
  projectId: Config.FIREBASE_BUILDER_PROJECT_ID || 'landing-page-d462e',
  storageBucket: Config.FIREBASE_BUILDER_STORAGE_BUCKET || 'landing-page-d462e.appspot.com',
  messagingSenderId: Config.FIREBASE_BUILDER_MESSAGING_SENDER_ID || '974031114081',
  appId: Config.FIREBASE_BUILDER_APP_ID || '1:974031114081:web:10d7dd8a60e64295ccff20',
  measurementId: Config.FIREBASE_BUILDER_MEASUREMENT_ID || 'G-B8KW380XRE',
}
