import { hp, wp } from '@/utils/responsive.util'
import { StyleSheet } from 'react-native'

export const bottomTabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#160837',
    height: hp(80),
    paddingHorizontal: wp(15),
    paddingBottom: hp(10),
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    borderTopWidth: 0.25,
  },
  tabButtonContainer: {
    flex: 1,
  },
  tabButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  tabButtonFocused: {
    backgroundColor: 'rgba(180, 168, 255, 0.1)',
  },
})
