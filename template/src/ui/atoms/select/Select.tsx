import React from 'react'
import { Select, CheckIcon, ISelectItemProps } from 'native-base'
import { hp } from '@/utils/responsive.util'
import { ISelectProps } from 'native-base/lib/typescript/components/primitives/Select'

export function MUSelect({
  selectedValue,
  onValueChange,
  accessibilityLabel,
  placeholder,
  children,
  ...rest
}: ISelectProps) {
  return (
    <Select
      selectedValue={selectedValue}
      accessibilityLabel={accessibilityLabel}
      placeholder={placeholder}
      bgColor="rgba(255, 255, 255, 0.05)"
      borderColor="transparent"
      placeholderTextColor="rgba(255, 255, 255, 0.6)"
      color="white"
      w="full"
      borderRadius={8}
      h={hp(56)}
      _selectedItem={{
        bg: 'teal.600',
        endIcon: <CheckIcon size="5" />,
      }}
      onValueChange={onValueChange}
      {...rest}
    >
      {children}
    </Select>
  )
}

const Option = ({ label, value, ...rest }: ISelectItemProps) => {
  return <Select.Item label={label} value={value} {...rest} />
}

export default Object.assign(MUSelect, { Option })
