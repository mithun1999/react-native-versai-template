import { VersaiNativeChatSdk } from '@/modules/chat/services'
import userDataAtom from '@/atoms/userData.atom'
import dayjs, { Dayjs } from 'dayjs'
import { Unsubscribe } from 'firebase/database'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { orderBy, uniqBy } from 'lodash'
import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import chatAtom, { chatStorageAtom } from '../atoms/chat.atom'
import memberAtom from '../atoms/member.atom'
import roomAtom from '../atoms/room.atom'
import roomChatAtom from '../atoms/roomChat.atom'

function useInitializer() {
  const todaysDate = useRef<Dayjs>()
  const loaderRender = useRef<boolean>(false)
  const userData = useAtomValue(userDataAtom)
  const setChat = useSetAtom(chatAtom)
  const [rawRooms, setRawRooms] = useAtom(roomAtom)
  const setMembers = useSetAtom(memberAtom)
  const firstMessageKey = useAtomValue(chatStorageAtom).firstMessageKey
  const setFirstMessageKey = useSetAtom(chatStorageAtom)
  const [chatRoom, setChatRoom] = useAtom(roomChatAtom)
  const isChatInitialized = useAtomValue(chatAtom).initialized
  const chatInstance = VersaiNativeChatSdk.getInstance()
  const appState = useRef(AppState.currentState)

  const initialize = () => {
    if (userData) {
      VersaiNativeChatSdk.initialize(userData, () => setChat((prev) => ({ ...prev, initialized: true })))
    }
  }

  const updateOnlinePresence = () => {
    if (chatInstance && isChatInitialized) {
      if (chatInstance.presence === 'OFFLINE') chatInstance?.updatePresence('ONLINE')
    }
  }

  const updateOfflinePresence = () => {
    if (chatInstance && isChatInitialized) {
      if (chatInstance.presence === 'ONLINE') chatInstance?.updatePresence('OFFLINE')
    }
  }

  const fetchMessages = () => {
    if (chatInstance && rawRooms && rawRooms.length > 0) {
      rawRooms.forEach((room) => {
        const roomId = room.id
        const fMessageKey = (firstMessageKey && firstMessageKey[roomId]) ?? ''
        chatInstance?.fetchRoomMessages(roomId, { limit: 50, endAt: fMessageKey }, async (msg) => {
          const sortedMsg = orderBy(msg, ['timestamp'], ['asc'])
          if (!msg.length) return
          if (chatRoom && chatRoom[roomId] && msg.length > 0) {
            await setChatRoom((prev) => {
              if (prev && prev[roomId]) {
                const prevChatRoomMessages = prev[roomId]
                const loadedMsg = uniqBy([...sortedMsg, ...prevChatRoomMessages], 'id')
                return { ...prev, [roomId]: [...loadedMsg] }
              }
              return { ...prev }
            })
          } else if (msg.length > 0) {
            await setChatRoom((prev) => ({ ...prev, [roomId]: [...sortedMsg] }))
          }
          const firstVisibleKey = sortedMsg[0]?.id
          if (firstVisibleKey && fMessageKey !== firstVisibleKey)
            await setFirstMessageKey((prev) => ({
              ...prev,
              firstMessageKey: { ...prev.firstMessageKey, [roomId]: firstVisibleKey },
            }))
        })
      })
    }
  }

  useEffect(() => {
    if (rawRooms && rawRooms.length <= 0 && !loaderRender.current) {
      setChat((prev) => ({ ...prev, isRoomFetchLoading: true }))
    }
  }, [rawRooms])

  useEffect(() => {
    if (chatInstance && isChatInitialized) {
      chatInstance?.fetchRooms(async (rooms) => {
        await setRawRooms(rooms)
        setChat((prev) => ({ ...prev, isRoomFetchLoading: false }))
        loaderRender.current = true
      })
    }
  }, [chatInstance, isChatInitialized])

  useEffect(() => {
    let memberSubscription: Unsubscribe | undefined
    if (rawRooms && rawRooms?.length && chatInstance && isChatInitialized)
      memberSubscription = chatInstance?.getMembersInformation(rawRooms, async (members) => await setMembers(members))
    return () => {
      memberSubscription?.()
    }
  }, [rawRooms?.length, chatInstance, isChatInitialized])

  useEffect(() => {
    todaysDate.current = dayjs()
    if (chatInstance && isChatInitialized) {
      fetchMessages()
    }

    // DEBUGGER
    // setChatRoom(RESET)
    // setFirstMessageKey(RESET)
    // setRawRooms(RESET)
    // setMembers(RESET)
  }, [chatInstance, isChatInitialized, rawRooms])

  useEffect(() => {
    initialize()
  }, [userData])

  useEffect(() => {
    updateOnlinePresence()
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/)) {
        updateOfflinePresence()
      }
      if (nextAppState === 'active') {
        updateOnlinePresence()
      }
      appState.current = nextAppState
    })
    return () => {
      subscription.remove()
    }
  }, [isChatInitialized, chatInstance])
}

export default useInitializer
