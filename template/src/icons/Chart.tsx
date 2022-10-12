import React from 'react'
import { Svg, G, Path } from 'react-native-svg'

function ChartIcon({ size = 24, color = '#A89AFF' }: { size?: number; color?: string }) {
  return (
    <>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <G opacity="0.6">
          <Path
            d="M21 22.75H3C2.59 22.75 2.25 22.41 2.25 22C2.25 21.59 2.59 21.25 3 21.25H21C21.41 21.25 21.75 21.59 21.75 22C21.75 22.41 21.41 22.75 21 22.75Z"
            fill={color}
          />
          <Path
            d="M5.59998 19.7499H4C3.04 19.7499 2.25 18.9599 2.25 17.9999V9.37988C2.25 8.41988 3.04 7.62988 4 7.62988H5.59998C6.55998 7.62988 7.34998 8.41988 7.34998 9.37988V17.9999C7.34998 18.9599 6.55998 19.7499 5.59998 19.7499ZM4 9.11987C3.86 9.11987 3.75 9.22987 3.75 9.36987V17.9999C3.75 18.1399 3.86 18.2499 4 18.2499H5.59998C5.73998 18.2499 5.84998 18.1399 5.84998 17.9999V9.37988C5.84998 9.23988 5.73998 9.12988 5.59998 9.12988H4V9.11987Z"
            fill={color}
          />
          <Path
            d="M12.8002 19.7499H11.2002C10.2402 19.7499 9.4502 18.9599 9.4502 17.9999V6.18994C9.4502 5.22994 10.2402 4.43994 11.2002 4.43994H12.8002C13.7602 4.43994 14.5502 5.22994 14.5502 6.18994V17.9999C14.5502 18.9599 13.7602 19.7499 12.8002 19.7499ZM11.2002 5.93994C11.0602 5.93994 10.9502 6.04994 10.9502 6.18994V17.9999C10.9502 18.1399 11.0602 18.2499 11.2002 18.2499H12.8002C12.9402 18.2499 13.0502 18.1399 13.0502 17.9999V6.18994C13.0502 6.04994 12.9402 5.93994 12.8002 5.93994H11.2002Z"
            fill={color}
          />
          <Path
            d="M19.9999 19.75H18.3999C17.4399 19.75 16.6499 18.96 16.6499 18V3C16.6499 2.04 17.4399 1.25 18.3999 1.25H19.9999C20.9599 1.25 21.7499 2.04 21.7499 3V18C21.7499 18.96 20.9599 19.75 19.9999 19.75ZM18.3999 2.75C18.2599 2.75 18.1499 2.86 18.1499 3V18C18.1499 18.14 18.2599 18.25 18.3999 18.25H19.9999C20.1399 18.25 20.2499 18.14 20.2499 18V3C20.2499 2.86 20.1399 2.75 19.9999 2.75H18.3999Z"
            fill={color}
          />
        </G>
      </Svg>
    </>
  )
}

export default ChartIcon