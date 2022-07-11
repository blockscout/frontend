import type { inputAnatomy as parts } from '@chakra-ui/anatomy';
import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { PartsStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { getColor, mode } from '@chakra-ui/theme-tools';
import getDefaultFormColors from '../utils/getDefaultFormColors';

const sizes: Record<string, SystemStyleObject> = {
  md: {
    fontSize: 'md',
    lineHeight: '20px',
    px: '20px',
    py: '20px',
    h: '60px',
    borderRadius: 'base',
  },
}

const variantOutline: PartsStyleFunction<typeof parts> = (props) => {
  const { theme } = props
  const { focusColor: fc, errorColor: ec } = getDefaultFormColors(props)

  return {
    field: {
      border: '2px solid',
      bg: 'inherit',
      borderColor: mode('gray.100', 'whiteAlpha.200')(props),
      _hover: {
        borderColor: mode('gray.300', 'whiteAlpha.400')(props),
      },
      _readOnly: {
        boxShadow: 'none !important',
        userSelect: 'all',
      },
      _disabled: {
        opacity: 0.4,
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
    },
    addon: {
      border: '2px solid',
      borderColor: mode('gray.100', 'whiteAlpha.200')(props),
      bg: mode('gray.100', 'whiteAlpha.200')(props),
    },
  }
}

const Input: ComponentStyleConfig = {
  sizes: {
    md: {
      field: sizes.md,
      addon: sizes.md,
    },
  },
  defaultProps: {
    size: 'md',
  },
  variants: {
    outline: variantOutline,
  },
}

export default Input;
