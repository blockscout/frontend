import { theme } from '@chakra-ui/react';

import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

const drukWide = localFont({
  src: [
    {
      path: './fonts/Druk-Wide-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: './fonts/Druk-Wide-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-druk' 
})

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


const fonts = {
  heading: `${drukWide.style.fontFamily}, ${ theme.fonts.heading }`,
  body: `${inter.style.fontFamily}, ${ theme.fonts.body }`,
}

export {
  fonts as default, 
  drukWide,
  inter
}
