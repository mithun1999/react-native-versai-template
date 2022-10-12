import { StyleSheet } from 'react-native'
import { hp, wp } from '../../utils/responsive.util'

export const sendInputStyles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: hp(60),
    width: wp(60),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ogImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: hp(150),
    width: wp(150),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageDeleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
})
