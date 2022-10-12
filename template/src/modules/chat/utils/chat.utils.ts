import dayjs from 'dayjs'
import { IChatRoomAtom, IChatUser, IFbChatRoom } from '../interfaces/chatAtom.interface'

export const getRoomInformation = (
  room: IFbChatRoom,
  currentUserId: string,
  membersMap: Record<string, IChatUser> | null,
): IChatRoomAtom => {
  const tobeExtended: any = {}
  if (room.type === 1) {
    const memberId = room.members.find((m) => m !== currentUserId)
    let user: IChatUser | undefined
    if (memberId) user = membersMap?.[memberId]
    if (user) {
      tobeExtended.name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`
      tobeExtended.user = user
    }
  }
  return { ...room, ...tobeExtended }
}

export const getMessageSendTime = (time: string) => {
  const today = dayjs().format('YYYY-MM-DD')
  const passedDate = dayjs(time).format('YYYY-MM-DD')

  const isYesterday = dayjs(today).diff(passedDate, 'day')
  const isToday = dayjs(passedDate).isSame(dayjs(today))

  if (isToday) return dayjs(time).format('hh:mm a')
  if (isYesterday === 1) return 'Yesterday'
  return dayjs(time).format('MMM DD')
}
