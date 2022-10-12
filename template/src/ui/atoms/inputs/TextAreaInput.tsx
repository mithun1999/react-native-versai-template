import React, { useMemo } from 'react'
import { ITextAreaProps, TextArea } from 'native-base'
import { withStyling } from './hoc/withStyling'
import { hp } from '@/utils/responsive.util'

export default function TextAreaInput(props: ITextAreaProps) {
  const STextArea = useMemo(() => {
    return withStyling(TextArea)
  }, [])

  return <STextArea autoCompleteType h={hp(140)} {...props} />
}
