import type { formAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { getColor, mode } from '@chakra-ui/theme-tools';
import type { StyleFunctionProps, PartsStyleFunction } from '@chakra-ui/theme-tools';
import type { Dict } from '@chakra-ui/utils';
import getDefaultFormColors from '../utils/getDefaultFormColors';

const getActiveLabelStyles = (theme: Dict, fc: string) => ({
  fontSize: '12px',
  lineHeight: '15px',
  top: '10px',
  color: getColor(theme, fc),
})

const getActiveInputStyles = (theme: Dict, fc: string) => ({
  paddingTop: '30px',
  paddingBottom: '10px',
  borderColor: getColor(theme, fc),
})

const variantFloating: PartsStyleFunction<typeof parts> = (props: StyleFunctionProps) => {
  const { theme } = props;
  const { focusBorderColor: fc, errorBorderColor: ec } = getDefaultFormColors(props);

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
      },
      // label's styles
      label: {
        top: '20px',
        left: 0,
        zIndex: 2,
        position: 'absolute',
        color: mode('gray.500', 'whiteAlpha.400')(props),
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        padding: '0 20px',
        margin: 0,
        transformOrigin: 'left top',
        fontSize: '16px',
        lineHeight: '20px',
        transitionProperty: 'top, font-size, line-height',
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
    },
  }
}

const Form: ComponentStyleConfig = {
  variants: {
    floating: variantFloating,
  },
}

export default Form;
