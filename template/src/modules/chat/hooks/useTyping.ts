import { throttle, debounce } from 'lodash'
import { useCallback, useRef, useState } from 'react'

export const useTyping = () => {
  const ref = useRef<boolean>(false)
  const [typing, setTyping] = useState(false)

  const stopTyping = useCallback(
    debounce((cb?) => {
      cb?.()
      setTyping(false)
      ref.current = false
    }, 700),
    [],
  )

  const startTyping = useCallback(
    throttle(
      (cb?) => {
        if (!ref.current) {
          ref.current = true
          return
        }
        cb?.()
        setTyping(true)
      },
      200,
      { trailing: false },
    ),
    [],
  )
  return { stopTyping, typing, startTyping }
}
