import { theme } from '@chakra-ui/react';

const typography = {
  fonts: {
    heading: `Poppins, ${ theme.fonts.heading }`,
    body: `Inter, ${ theme.fonts.body }`,
  },
  textStyles: {
    h2: {
      fontSize: [ '32px' ],
      fontWeight: '500',
      lineHeight: '40px',
      fontFamily: 'heading',
    },
    h3: {
      fontSize: '24px',
      fontWeight: '500',
      lineHeight: '32px',
      fontFamily: 'heading',
    },
  },
}

export default typography;
