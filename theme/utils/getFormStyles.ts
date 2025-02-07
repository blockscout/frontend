import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode, transparentize } from '@chakra-ui/theme-tools';

export default function getFormStyles(props: StyleFunctionProps) {
  return {
    input: {
      empty: {
        // there is no text in the empty input
        // color: ???,
        bgColor: props.bgColor || mode('white', 'black')(props),
        borderColor: mode('gray.100', 'grey.20')(props),
      },
      hover: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', 'black')(props),
        borderColor: mode('gray.200', 'cyan')(props),
      },
      focus: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', 'black')(props),
        borderColor: mode('blue.400', 'cyan')(props),
      },
      filled: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', 'black')(props),
        borderColor: mode('gray.300', 'grey.10')(props),
      },
      readOnly: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: mode('gray.200', 'gray.800')(props),
        borderColor: mode('gray.200', 'grey.10')(props),
      },
      // we use opacity to show the disabled state
      disabled: {
        opacity: 0.2,
      },
      error: {
        color: mode('gray.800', 'gray.50')(props),
        bgColor: props.bgColor || mode('white', 'black')(props),
        borderColor: mode('red.500', 'red.500')(props),
      },
    },
    placeholder: {
      'default': {
        color: mode('gray.500', 'grey.50')(props),
      },
      disabled: {
        color: transparentize('gray.500', 0.2)(props.theme),
      },
      error: {
        color: mode('red.500', 'red.500')(props),
      },
    },
  };
}
