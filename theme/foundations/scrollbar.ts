import { mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps } from '@chakra-ui/theme-tools';

const scrollbar = (props: StyleFunctionProps) => ({
  'body *::-webkit-scrollbar': {
    width: '20px',
  },
  'body *::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  'body *::-webkit-scrollbar-thumb': {
    backgroundColor: mode('blackAlpha.300', 'whiteAlpha.300')(props),
    borderRadius: '20px',
    border: `8px solid rgba(0,0,0,0)`,
    backgroundClip: 'content-box',
    minHeight: '32px',
  },
  'body *::-webkit-scrollbar-button': {
    display: 'none',
  },
});

export default scrollbar;
