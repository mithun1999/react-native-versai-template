import { IChatUser } from '@/modules/chat/interfaces/chatAtom.interface'

export interface IChatListProps {
  image?: string
  name: string
  message?: string
  receivedTime?: string | Date
  peerUser?: IChatUser
  roomId: string
}
