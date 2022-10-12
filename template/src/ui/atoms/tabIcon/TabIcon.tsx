import { View } from 'native-base'
import React from 'react'

function TabIcon({ Icon, focused = false }: { Icon: React.ElementType; focused?: boolean }) {
  return <Icon />
}

export default TabIcon
