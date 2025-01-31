import type { SystemConfig } from '@chakra-ui/react';

import addressEntity from './globals/address-entity';
import recaptcha from './globals/recaptcha';
import scrollbar from './globals/scrollbar';

const globalCss: SystemConfig['globalCss'] = {
  body: {
    bg: 'global.body.bg',
    color: 'global.body.fg',
    WebkitTapHighlightColor: 'transparent',
    fontVariantLigatures: 'no-contextual',
  },
  mark: {
    bg: 'global.mark.bg',
    color: 'inherit',
  },
  'svg *::selection': {
    color: 'none',
    background: 'none',
  },
  form: {
    w: '100%',
  },
  ...recaptcha,
  ...scrollbar,
  ...addressEntity,
};

export default globalCss;
