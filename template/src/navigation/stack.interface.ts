import { NavigatorScreenParams } from '@react-navigation/native'

export type AuthStackParam = {
  Onboarding: undefined
  Login: undefined
}

export type AppTabParam = {
  Stats: undefined
  News: undefined
  Inbox: undefined
  Alerts: undefined
  Profile: undefined
}

export type AppStackParam = {
  AppTab: NavigatorScreenParams<AppTabParam>
  NewConversation: undefined
  Feedback: undefined
  ChatRoom: { roomId: string }
}
