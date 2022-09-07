import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode, getColor } from '@chakra-ui/theme-tools';

import getDefaultFormColors from './getDefaultFormColors';
import getDefaultTransitionProps from './getDefaultTransitionProps';

export default function getOutlinedFieldStyles(props: StyleFunctionProps) {
  const { theme, borderColor } = props;
  const { focusColor: fc, errorColor: ec } = getDefaultFormColors(props);
  const transitionProps = getDefaultTransitionProps();

  return {
    border: '2px solid',
    // filled input
    backgroundColor: 'transparent',
    borderColor: mode('gray.300', 'gray.600')(props),
    ...transitionProps,
    _hover: {
      borderColor: mode('gray.200', 'gray.500')(props),
    },
    _readOnly: {
      boxShadow: 'none !important',
      userSelect: 'all',
    },
    _disabled: {
      opacity: 1,
      backgroundColor: mode('gray.200', 'whiteAlpha.200')(props),
      border: 'none',
      cursor: 'not-allowed',
    },
    _invalid: {
      borderColor: getColor(theme, ec),
      boxShadow: `none`,
    },
    _focusVisible: {
      zIndex: 1,
      borderColor: getColor(theme, fc),
      boxShadow: 'md',
    },
    _placeholder: {
      color: mode('blackAlpha.600', 'whiteAlpha.600')(props),
    },
    // not filled input
    ':placeholder-shown:not(:focus-visible):not(:hover):not([aria-invalid=true])': { borderColor: borderColor || mode('gray.100', 'gray.700')(props) },
    ':-webkit-autofill': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:hover': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:focus': { transition: 'background-color 5000s ease-in-out 0s' },
  };
}
