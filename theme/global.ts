import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

const global = (props: StyleFunctionProps) => ({
  body: {
    bg: mode('white', 'black')(props),
  },
})

export default global;
