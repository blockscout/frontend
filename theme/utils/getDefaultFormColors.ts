import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

export default function getDefaultFormColors(props: StyleFunctionProps) {
  const { focusBorderColor: fc, errorBorderColor: ec, filledBorderColor: flc } = props;
  return {
    focusBorderColor: fc || mode('rgba(61, 246, 43, 1)', 'rgba(61, 246, 43, 1)')(props),
    focusPlaceholderColor: fc || 'gray.500',
    errorColor: ec || mode('red.400', 'red.300')(props),
    filledColor: flc || mode('gray.300', 'gray.600')(props),
  };
}
