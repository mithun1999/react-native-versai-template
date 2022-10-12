import { wp, hp } from '@/utils/responsive.util'
import { StyleSheet } from 'react-native'

export const appLayoutStyles = StyleSheet.create({
  container: {
    height: '100%',
  },
  viewContainer: {
    marginHorizontal: wp(10),
    marginTop: hp(20),
    marginBottom: hp(40),
  },
})
