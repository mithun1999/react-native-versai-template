import { StyleSheet } from 'react-native'
import { hp } from '../../utils/responsive.util'

export const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6202FE',
  },
  mainContainer: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    height: '100%',
  },
  contentContainer: {
    display: 'flex',
  },
  mainText: {
    fontSize: hp(28),
    lineHeight: hp(35),
    fontWeight: '600',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
  },
})
