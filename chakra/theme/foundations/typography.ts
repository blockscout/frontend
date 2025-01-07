import type { ThemingConfig, TokenDefinition } from '@chakra-ui/react/dist/types/styled-system/types';

import config from 'configs/app';

export const BODY_TYPEFACE = config.UI.fonts.body?.name ?? 'Inter';
export const HEADING_TYPEFACE = config.UI.fonts.heading?.name ?? 'Poppins';

export const fonts: TokenDefinition['fonts'] = {
  heading: { value: `${ HEADING_TYPEFACE }, sans-serif` },
  body: { value: `${ BODY_TYPEFACE }, sans-serif` },
};

export const textStyles: ThemingConfig['textStyles'] = {
  h2: {
    fontSize: '32px',
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
};
