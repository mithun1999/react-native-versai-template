interface IRecentMessage {
  messageText: string
  sendBy: string
  timestamp: string
}

export interface IChatUser {
  email: string
  firstName: string
  lastName: string
  id: string
  presence?: 'ONLINE' | 'OFFLINE'
  image?: string
}

export interface IFbChatRoom {
  createdAt: { seconds: number; nanoseconds: number } | Date
  createdBy: string
  id: string
  members: string[]
  name: string
  recentMessage?: IRecentMessage
  type: number
  typing: string[]
}

export interface IChatRoomAtom extends IFbChatRoom {
  user: IChatUser
}

export interface IChatAtom {
  initialized: boolean
  isRoomFetchLoading: boolean
}

export interface IChatStorageAtom {
  firstMessageKey: Record<string, string> | null
}

export interface IChatMessage {
  messageText?: string
  sendBy: string
  isSender: boolean
  id: string
  timestamp: string
  isError?: boolean
  attachments?: {
    id?: string
    ext?: string
    url?: string
    localUrl?: string
    isUploading?: boolean
    isFailed?: boolean
    localId?: string
  }[]
}
