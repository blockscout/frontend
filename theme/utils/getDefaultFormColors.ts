import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

export default function getDefaultFormColors(props: StyleFunctionProps) {
  const { focusBorderColor: fc, errorBorderColor: ec, filledBorderColor: flc } = props
  return {
    focusColor: fc || mode('brand.700', 'brand.300')(props),
    errorColor: ec || mode('red.400', 'red.300')(props),
    filledColor: flc || mode('gray.300', 'gray.600')(props),
  }
}
