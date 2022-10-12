import { extendTheme } from 'native-base'

export const nbTheme = extendTheme({
  colors: {
    primary: {
      '50': '#F0F1FF',
      '100': '#DBDFFF',
      '200': '#B8BFFF',
      '300': '#99A3FF',
      '400': '#7583FF',
      '500': '#5162FF',
      '600': '#0F27FF',
      '700': '#0014CC',
      '800': '#000D85',
      '900': '#000742',
    },
  },
  config: {
    initialColorMode: 'dark',
  },
})
