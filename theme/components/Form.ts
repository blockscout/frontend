import type { formAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { getColor } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps, PartsStyleFunction } from '@chakra-ui/theme-tools';
import getDefaultFormColors from '../utils/getDefaultFormColors';

const activeLabelStyles = {
  fontSize: '12px',
  lineHeight: '15px',
  top: '10px',
};

const activeInputStyles = {
  paddingTop: '30px',
  paddingBottom: '10px',
};

const variantFloating: PartsStyleFunction<typeof parts> = (props: StyleFunctionProps) => {
  const { theme } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaultFormColors(props);

  return {
    container: {
      _focusWithin: {
        label: {
          ...activeLabelStyles,
        },
        input: {
          ...activeInputStyles,
        },
      },
      'input:not(:placeholder-shown) + label': {
        ...activeLabelStyles,
      },
      'input[aria-invalid=true] + label': {
        color: getColor(theme, ec),
      },
      label: {
        top: '20px',
        left: 0,
        zIndex: 2,
        position: 'absolute',
        color: getColor(theme, fc),
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        padding: '0 20px',
        margin: 0,
        transformOrigin: 'left top',
        fontSize: '16px',
        lineHeight: '20px',
        transitionProperty: 'top, font-size, line-height',
      },
      input: {
        padding: '20px',
      },
      'input:not(:placeholder-shown)': {
        ...activeInputStyles,
      },
    },
  }
}

const Form: ComponentStyleConfig = {
  variants: {
    floating: variantFloating,
  },
}

export default Form;
