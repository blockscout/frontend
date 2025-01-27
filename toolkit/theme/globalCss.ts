import type { SystemStyleObject } from '@chakra-ui/theme-tools';

// TODO @tom2drum check address highlight feature
import addressEntity from './globals/address-entity';
import recaptcha from './globals/recaptcha';
import scrollbar from './globals/scrollbar';

const globalCss: Record<string, SystemStyleObject> = {
  body: {
    bg: 'global.body.bg',
    color: 'global.body.fg',
    '-webkit-tap-highlight-color': 'transparent',
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
  // ...addressEntity(props),
};

export default globalCss;
