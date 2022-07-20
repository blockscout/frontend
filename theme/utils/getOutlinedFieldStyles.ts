import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode, getColor } from '@chakra-ui/theme-tools';
import getDefaultFormColors from './getDefaultFormColors';
import getDefaultTransitionProps from './getDefaultTransitionProps';

export default function getOutlinedFieldStyles(props: StyleFunctionProps) {
  const { theme } = props
  const { focusColor: fc, errorColor: ec } = getDefaultFormColors(props);
  const transitionProps = getDefaultTransitionProps();

  return {
    border: '2px solid',
    bg: 'inherit',
    borderColor: mode('gray.100', 'whiteAlpha.200')(props),
    ...transitionProps,
    _hover: {
      borderColor: mode('gray.300', 'whiteAlpha.400')(props),
    },
    _readOnly: {
      boxShadow: 'none !important',
      userSelect: 'all',
    },
    _disabled: {
      opacity: 1,
      background: mode('gray.200', 'whiteAlpha.400')(props),
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
      boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    ':-webkit-autofill': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:hover': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:focus': { transition: 'background-color 5000s ease-in-out 0s' },
  }
}
