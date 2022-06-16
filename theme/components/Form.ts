import type { formAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { getColor, mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps, PartsStyleFunction } from '@chakra-ui/theme-tools';
import type { Dict } from '@chakra-ui/utils';
import getDefaultFormColors from '../utils/getDefaultFormColors';

const getActiveLabelStyles = (theme: Dict, fc: string) => ({
  color: getColor(theme, fc),
  transform: 'scale(0.75) translateY(-10px)',
})

const getActiveInputStyles = (theme: Dict, fc: string) => ({
  paddingTop: '30px',
  paddingBottom: '10px',
  borderColor: getColor(theme, fc),
  boxShadow: 'none',
})

const variantFloating: PartsStyleFunction<typeof parts> = (props: StyleFunctionProps) => {
  const { theme } = props;
  const { focusColor: fc, errorColor: ec } = getDefaultFormColors(props);

  const activeLabelStyles = getActiveLabelStyles(theme, fc);
  const activeInputStyles = getActiveInputStyles(theme, fc);

  return {
    container: {
      _focusWithin: {
        label: {
          ...activeLabelStyles,
        },
        input: {
          ...activeInputStyles,
        },
        'label .chakra-form__required-indicator': {
          color: getColor(theme, fc),
        },
      },
      // label's styles
      label: {
        top: '20px',
        left: '20px',
        zIndex: 2,
        position: 'absolute',
        color: mode('gray.500', 'whiteAlpha.400')(props),
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        margin: 0,
        transformOrigin: 'left top',
        fontSize: '16px',
        lineHeight: '20px',
      },
      'input:not(:placeholder-shown) + label': {
        ...activeLabelStyles,
      },
      'input[aria-invalid=true] + label': {
        color: getColor(theme, ec),
      },
      // input's styles
      input: {
        padding: '20px',
      },
      'input:not(:placeholder-shown)': {
        ...activeInputStyles,
      },
      'input[aria-invalid=true]': {
        borderColor: getColor(theme, ec),
      },
      // indicator's styles
      'input:not(:placeholder-shown) + label .chakra-form__required-indicator': {
        color: getColor(theme, fc),
      },
      'input[aria-invalid=true] + label .chakra-form__required-indicator': {
        color: getColor(theme, ec),
      },
    },
    requiredIndicator: {
      marginStart: 0,
      color: mode('gray.500', 'whiteAlpha.400')(props),
    },
  }
}

const Form: ComponentStyleConfig = {
  variants: {
    floating: variantFloating,
  },
}

export default Form;
