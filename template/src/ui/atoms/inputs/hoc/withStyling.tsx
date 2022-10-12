import React from 'react'

export const withStyling = (BaseComponent: any) => (props: any) =>
  (
    <BaseComponent
      borderColor="transparent"
      _focus={{
        borderColor: 'transparent',
      }}
      bgColor="rgba(255, 255, 255, 0.05)"
      placeholderTextColor="rgba(255, 255, 255, 0.6)"
      color="white"
      w="full"
      borderRadius={8}
      {...props}
    />
  )
