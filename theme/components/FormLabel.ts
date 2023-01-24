import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';
import { getColor, mode } from '@chakra-ui/theme-tools';

import getDefaultFormColors from '../utils/getDefaultFormColors';

const baseStyle = defineStyle({
  display: 'flex',
  fontSize: 'md',
  marginEnd: '3',
  mb: '2',
  fontWeight: 'medium',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  opacity: 1,
  _disabled: {
    opacity: 0.4,
  },
});

const variantFloating = defineStyle((props) => {
  const { theme, backgroundColor } = props;
  const { focusPlaceholderColor } = getDefaultFormColors(props);
  const bc = backgroundColor || mode('white', 'black')(props);

  return {
    left: '2px',
    top: '2px',
    zIndex: 2,
    position: 'absolute',
    borderRadius: 'base',
    boxSizing: 'border-box',
    color: 'gray.500',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    margin: 0,
    transformOrigin: 'top left',
    transitionProperty: 'font-size, line-height, padding, top, background-color',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    _focusWithin: {
      backgroundColor: bc,
      color: getColor(theme, focusPlaceholderColor),
      fontSize: 'xs',
      lineHeight: '16px',
      borderTopRightRadius: 'none',
    },
  };
});

const variants = {
  floating: variantFloating,
};

const sizes = {
  lg: defineStyle((props) => {
    if (props.variant === 'floating') {
      return {
        fontSize: 'md',
        lineHeight: '24px',
        padding: '28px 24px',
        right: '26px',
        _focusWithin: {
          padding: '16px 24px 2px 24px',
        },
        '&[data-fancy=true]': {
          right: '36px',
        },
      };
    }

    return {};
  }),
  md: defineStyle((props) => {
    if (props.variant === 'floating') {
      return {
        fontSize: 'md',
        lineHeight: '20px',
        padding: '18px 16px',
        right: '18px',
        _focusWithin: {
          padding: '10px 16px 2px 16px',
        },
        '&[data-fancy=true]': {
          right: '36px',
        },
      };
    }

    return {};
  }),
};

const FormLabel = defineStyleConfig({
  variants,
  baseStyle,
  sizes,
});

export default FormLabel;
