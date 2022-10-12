// import { IChatRoomAtom, IChatUser, IFbChatRoom, IUserData } from './chat.interface'
import firestore from '@react-native-firebase/firestore'
import { remove, uniq } from 'lodash'
import { serverTimestamp } from 'firebase/database'
import { nanoid } from 'nanoid'
import database from '@react-native-firebase/database'
import dayjs from 'dayjs'
import { increment } from 'firebase/firestore'
import { IUserDataAtom } from '@/atoms/userData.atom'
import { IChatUser, IFbChatRoom } from '../interfaces/chatAtom.interface'

export class ChatNativeService {
  user: IUserDataAtom
  presence: 'OFFLINE' | 'ONLINE' = 'OFFLINE'

  constructor(
    user: IUserDataAtom,
    private userCollectionRef = firestore().collection('users'),
    private roomCollectionRef = firestore().collection('rooms'),
  ) {
    this.user = user

    this.initUser({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      image: user.image?.url,
    })
  }

  async initUser(user: any) {
    const { id, ...rest } = user
    const userDoc = this.userCollectionRef.doc(id)
    const userSnapshot = await userDoc.get()
    if (!userSnapshot.exists) {
      userDoc.set(rest)
    }
    return userSnapshot.exists
  }

  updateUser(payload: Partial<IChatUser>) {
    const userDoc = this.userCollectionRef.doc(this.user.id)
    return userDoc.update(payload)
  }

  updatePresence(presence: 'ONLINE' | 'OFFLINE') {
    this.updateUser({ presence })
    this.presence = presence
  }

  // updateTypingStatus
  async updateTypingStatus(roomId: string, typing: boolean) {
    const roomDoc = this.roomCollectionRef.doc(roomId)
    const roomSnapshot = await roomDoc.get()
    if (roomSnapshot.exists) {
      const roomData = roomSnapshot.data() as IFbChatRoom
      const updatedTyping = uniq([...roomData.typing, this.user.id])
      const removedTyping = remove([...roomData.typing], this.user.id)
      if (typing) {
        roomDoc.update({ typing: updatedTyping })
      } else {
        roomDoc.update({ typing: removedTyping })
      }
    }
  }

  // Fetch rooms [subscription]
  async fetchRooms(setRooms: (rooms: IFbChatRoom[]) => void) {
    return this.roomCollectionRef.where('members', 'array-contains', this.user.id).onSnapshot((snap) => {
      const rooms = snap.docs.map((d) => {
        const room = d.data() as any
        return { id: d.id, ...room }
      })
      setRooms(rooms)
    })
  }

  getMembersInformation(rooms: IFbChatRoom[], setMembers: (members: Record<string, IChatUser>) => void) {
    const memberIds = rooms.reduce((acc, nxt) => {
      acc.push(...nxt.members)
      return acc
    }, [] as string[])
    const memberSet = new Set(memberIds)
    const membersArrayFromSet = Array.from(memberSet.values())
    return this.userCollectionRef.where('__name__', 'in', membersArrayFromSet).onSnapshot((snap) => {
      const members = snap.docs.reduce((acc, d) => {
        acc[d.id] = { id: d.id, ...d.data() }
        return acc
      }, {} as any)
      setMembers(members)
    })
  }

  // Send chat to a room
  async sendChatToRoom(roomId: string, membersActivity: any[] = [], payload: any, id?: string) {
    try {
      const newMessagePayload = {
        sendBy: this.user.id,
        timestamp: serverTimestamp(),
        ...payload,
      }
      let chatId = id ? id : `${dayjs().valueOf()}-${nanoid()}`
      await database().ref(`chats/${roomId}/${chatId}`).set(newMessagePayload)
      const newMessage = await database().ref(`chats/${roomId}/${chatId}`).once('value')

      // Update conversations for unread messages
      membersActivity.forEach((member) => {
        if (member.activeRoom === roomId) return
        const userDoc = this.userCollectionRef.doc(member.id).collection('conversations').doc(member.id)
        // userDoc.update({})
        firestore()
          .batch()
          .set(userDoc, { unreadMessages: increment(1) }, { merge: true })
      })
      firestore().batch().commit()

      // Setting latest message as recent message to the room
      const roomDoc = this.roomCollectionRef.doc(roomId)
      roomDoc.update({ recentMessage: newMessage.val() })
      return { data: newMessage }
    } catch (error) {
      return { error }
    }
  }

  // Get messages of a room [USING QUERY]
  async fetchRoomMessages(
    roomId: string,
    query: { endAt?: string; limit: number },
    setMessages: (messages: any) => void,
  ) {
    const roomSnapshot = query.endAt
      ? await database()
          .ref(`chats/${roomId}`)
          .orderByKey()
          .endAt(query.endAt)
          .limitToLast(query.limit)
          .once('value')
      : await database().ref(`chats/${roomId}`).orderByKey().limitToLast(query.limit).once('value')
    if (!roomSnapshot.exists()) {
      setMessages([])
      return
    }
    // If messages exits
    const messagesMap = roomSnapshot.val()
    const messages = Object.keys(messagesMap).map((key: string) => {
      const msg = messagesMap[key]
      return { ...msg, isSender: msg.sendBy === this.user.id, id: key }
    })
    setMessages(messages)
  }

  async createRoom(members: string[], type = 1, name = '') {
    try {
      const payload = {
        createdAt: serverTimestamp(),
        createdBy: this.user.id,
        members: [this.user.id, ...members],
        recentMessage: null,
        type,
        name,
      }
      const id = nanoid()
      await this.roomCollectionRef.doc(id).set(payload)
      return id
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async getRoomInfo(roomId: string) {
    const roomSnapshot = await this.roomCollectionRef.doc(roomId).get()
    if (roomSnapshot.exists) {
      return roomSnapshot.data()
    }
    return null
  }

  listenForRoomStatus(roomId: string, setRoomData: (roomData: any) => void) {
    return this.roomCollectionRef.doc(roomId).onSnapshot((snap) => {
      const data = snap.data()
      if (data) setRoomData(data)
    })
  }

  listenForNewMessageInARoom(roomId: string, query: { startAt?: string | null }, onNewMessage: (message: any) => void) {
    const roomRef = database().ref(`chats/${roomId}`)
    if (query.startAt) {
      return roomRef
        .orderByChild('timestamp')
        .startAt(query.startAt)
        .on('child_added', (snapshot) => {
          const msg = snapshot.val()
          onNewMessage({ id: snapshot.key, ...msg, isSender: msg.sendBy === this.user.id })
        })
    }
    return roomRef.orderByChild('timestamp').on('child_added', (snapshot) => {
      const msg = snapshot.val()
      onNewMessage({ id: snapshot.key, ...msg, isSender: msg.sendBy === this.user.id })
    })
  }
}
