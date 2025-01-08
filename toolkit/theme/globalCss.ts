import type { StyleFunctionProps, SystemStyleObject } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

// TODO @tom2drum check address highlight feature
import addressEntity from './globals/address-entity';
import recaptcha from './globals/recaptcha';
// TODO @tom2drum check custom scrollbar colors
import scrollbar from './globals/scrollbar';

const globalCss: Record<string, SystemStyleObject> = {
  body: {
    bg: 'global.body.bg',
    color: 'global.body.fg',
    '-webkit-tap-highlight-color': 'transparent',
    'font-variant-ligatures': 'no-contextual',
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
  // ...scrollbar(props),
  // ...addressEntity(props),
  ...recaptcha(),
};

export default globalCss;
