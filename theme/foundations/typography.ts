import { theme } from '@chakra-ui/react';

import config from 'configs/app';

export const BODY_TYPEFACE = config.UI.fonts.body?.name ?? 'Inter';

const typography = {
  fonts: {
    heading: `"Bossa", sans-serif`,
    body: `${ BODY_TYPEFACE }, ${ theme.fonts.body }`,
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
    h4: {
      fontSize: 'md',
      fontWeight: '500',
      lineHeight: '24px',
      fontFamily: 'heading',
    },
  },
};

export default typography;
