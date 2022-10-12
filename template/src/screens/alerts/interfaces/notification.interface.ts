import { ImageSourcePropType } from 'react-native'

export interface INotificationProps {
  source?: ImageSourcePropType
  name: string
  message: string
  receivedTime: string | Date
  online?: boolean
  seen?: boolean
}
