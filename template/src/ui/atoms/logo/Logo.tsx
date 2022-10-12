import React from 'react'
import { Image } from 'native-base'

export default function Logo({ ...props }) {
  return <Image source={require('../../../assets/images/png/logo.png')} alt="logo" {...props} />
}
