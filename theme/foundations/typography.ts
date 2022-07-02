import { theme } from '@chakra-ui/react';

const typography = {
  fonts: {
    heading: `Poppins, ${ theme.fonts.heading }`,
    body: `Inter, ${ theme.fonts.body }`,
  },
  textStyles: {
    h2: {
      fontSize: [ '32px' ],
      fontWeight: 'semibold',
      lineHeight: '40px',
    },
  },
}

export default typography;
