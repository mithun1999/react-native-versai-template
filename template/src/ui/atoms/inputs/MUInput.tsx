import React, { useMemo } from 'react'
import { hp } from '@/utils/responsive.util'
import { IInputProps, Input } from 'native-base'
import { withStyling } from './hoc/withStyling'

export default function MUInput(props: IInputProps) {
  const SInput = useMemo(() => {
    return withStyling(Input)
  }, [])
  return <SInput h={hp(40)} {...props} />
}
