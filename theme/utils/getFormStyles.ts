import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode, transparentize } from '@chakra-ui/theme-tools';

import colors from 'theme/foundations/colors';

export default function getFormStyles(props: StyleFunctionProps) {
  return {
    input: {
      empty: {
        // there is no text in the empty input
        // color: ???,
        bgColor: props.bgColor || mode('white', colors.grayTrue[900])(props),
        borderColor: mode('gray.100', colors.grayTrue[700])(props),
      },
      hover: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', colors.grayTrue[800])(props),
        borderColor: mode('gray.200', colors.grayTrue[500])(props),
      },
      focus: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', colors.grayTrue[900])(props),
        borderColor: mode('blue.400', colors.white)(props),
      },
      filled: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', colors.grayTrue[900])(props),
        borderColor: mode('gray.300', colors.grayTrue[600])(props),
      },
      readOnly: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: mode('gray.200', colors.grayTrue[800])(props),
        borderColor: mode('gray.200', colors.grayTrue[800])(props),
      },
      // we use opacity to show the disabled state
      disabled: {
        opacity: 0.2,
      },
      error: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', colors.grayTrue[900])(props),
        borderColor: mode('red.500', colors.error[500])(props), //'red.500'
      },
    },
    placeholder: {
      'default': {
        color: mode('gray.500', colors.grayTrue[200])(props),
      },
      disabled: {
        color: transparentize(colors.grayTrue[500], 0.2)(props.theme),
      },
      error: {
        color: mode('red.500', colors.error[500])(props), //'red.500'
      },
    },
  };
}
