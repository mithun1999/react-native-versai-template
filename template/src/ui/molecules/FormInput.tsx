import React from 'react'
import { Controller } from 'react-hook-form'
import MUInput from '../atoms/inputs/MUInput'
import TextAreaInput from '../atoms/inputs/TextAreaInput'
import { IFormInputProps, IFormTextAreaInput } from './interfaces/formInput.interfaces'

const formInputWrapper =
  (BaseComponent: any) =>
  ({ control, name, required = 'Required', rules = {}, ...rest }: any) => {
    return (
      <Controller
        control={control}
        name={name}
        rules={{ required, ...rules }}
        render={({ field: { onChange, value, ref } }) => (
          <BaseComponent onChangeText={onChange} value={value} ref={ref} {...rest} />
        )}
      />
    )
  }

export const FormInput = (props: IFormInputProps) => {
  const EMUInput = formInputWrapper(MUInput)
  return <EMUInput {...props} />
}

export const FormTextAreaInput = (props: IFormTextAreaInput) => {
  const ETextAreaInput = formInputWrapper(TextAreaInput)
  const { onChangeText: onChange, ...rest } = props

  return <ETextAreaInput onChange={onChange} {...rest} />
}
