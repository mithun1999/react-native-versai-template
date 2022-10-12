import { IChatMessage } from '@/modules/chat/interfaces/chatAtom.interface'

export interface IChatRoomText extends IChatMessage {
  showTime?: boolean
  date: string
  isTyping: boolean
}
