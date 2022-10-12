import React from 'react'
import { Image } from 'native-base'

export default function Logo({ ...props }) {
  const logo = require('../../assets/images/logo.png')

  return <Image source={logo} alt="logo" h={12} w={122} {...props} />
}
