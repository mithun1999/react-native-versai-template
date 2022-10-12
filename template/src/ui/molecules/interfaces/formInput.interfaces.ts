import { IInputProps, ITextAreaProps } from 'native-base'
import { Control } from 'react-hook-form'

export interface IFormInputProps extends Omit<IInputProps, 'required'> {
  control: Control<any, any>
  name: string
  required?: string
  errorType?: string
  rules?: any
  trim?: boolean
}

export interface IFormTextAreaInput extends Omit<ITextAreaProps, 'required'> {
  control: Control<any, any>
  name: string
  required?: string
  errorType?: string
  rules?: any
  trim?: boolean
}
