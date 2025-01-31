import type { StyleFunctionProps } from '@chakra-ui/theme-tools';
import { mode } from '@chakra-ui/theme-tools';

import getDefaultTransitionProps from './getDefaultTransitionProps';
import getFormStyles from './getFormStyles';

export default function getOutlinedFieldStyles(props: StyleFunctionProps) {
  const formStyles = getFormStyles(props);
  const transitionProps = getDefaultTransitionProps();

  return {
    border: '2px solid',
    // filled input
    ...formStyles.input.filled,
    ...transitionProps,
    _hover: {
      ...formStyles.input.hover,
    },
    _readOnly: {
      boxShadow: 'none !important',
      userSelect: 'all',
      pointerEvents: 'none',
      ...formStyles.input.readOnly,
      _hover: {
        ...formStyles.input.readOnly,
      },
      _focus: {
        ...formStyles.input.readOnly,
      },
    },
    _disabled: {
      ...formStyles.input.disabled,
      cursor: 'not-allowed',
      ':-webkit-autofill': {
        // background color for disabled input which value was selected from browser autocomplete popup
        '-webkit-box-shadow': `0 0 0px 1000px ${ mode('rgba(16, 17, 18, 0.08)', 'rgba(255, 255, 255, 0.08)')(props) } inset`,
      },
    },
    _invalid: {
      ...formStyles.input.error,
      boxShadow: `none`,
      _placeholder: {
        color: formStyles.placeholder.error.color,
      },
    },
    _focusVisible: {
      ...formStyles.input.focus,
      zIndex: 1,
      boxShadow: 'md',
    },
    _placeholder: {
      color: formStyles.placeholder.default.color,
    },
    // not filled input
    ':placeholder-shown:not(:focus-visible):not(:hover):not([aria-invalid=true]):not([aria-readonly=true])': {
      ...formStyles.input.empty,
    },

    // not filled input with type="date"
    ':not(:placeholder-shown)[value=""]:not(:focus-visible):not(:hover):not([aria-invalid=true]):not([aria-readonly=true])': {
      ...formStyles.input.empty,
    },

    ':-webkit-autofill': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:hover': { transition: 'background-color 5000s ease-in-out 0s' },
    ':-webkit-autofill:focus': { transition: 'background-color 5000s ease-in-out 0s' },
  };
}
