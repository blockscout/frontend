import { formAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
} from '@chakra-ui/styled-system';
import { getColor, mode } from '@chakra-ui/theme-tools';
import type { Dict } from '@chakra-ui/utils';

import getDefaultFormColors from '../utils/getDefaultFormColors';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const getActiveLabelStyles = (theme: Dict, fc: string, bc: string, size: 'md' | 'lg') => {
  const baseStyles = {
    backgroundColor: bc,
    color: getColor(theme, fc),
    fontSize: 'xs',
    lineHeight: '16px',
    borderTopRightRadius: 'none',
  };

  switch (size) {
    case 'md': {
      return {
        ...baseStyles,
        padding: '10px 16px 2px 16px',
      };
    }

    case 'lg': {
      return {
        ...baseStyles,
        padding: '16px 24px 2px 24px',
      };
    }
  }
};

const getDefaultLabelStyles = (size: 'md' | 'lg') => {
  switch (size) {
    case 'md': {
      return {
        fontSize: 'md',
        lineHeight: '20px',
        padding: '18px 16px',
        right: '18px',
      };
    }

    case 'lg': {
      return {
        fontSize: 'md',
        lineHeight: '24px',
        padding: '28px 24px',
        right: '26px',
      };
    }
  }
};

const getPaddingX = (size: 'md' | 'lg') => {
  switch (size) {
    case 'md': {
      return '16px';
    }

    case 'lg': {
      return '24px';
    }
  }
};

const getActiveInputStyles = (size: 'md' | 'lg') => {
  switch (size) {
    case 'md': {
      return {
        paddingTop: '26px',
        paddingBottom: '10px',
      };
    }

    case 'lg': {
      return {
        paddingTop: '38px',
        paddingBottom: '18px',
      };
    }
  }
};

const variantFloating = definePartsStyle((props) => {
  const { theme, backgroundColor, size = 'md' } = props;
  const { focusColor: fc, errorColor: ec } = getDefaultFormColors(props);
  const bc = backgroundColor || mode('white', 'black')(props);

  const px = getPaddingX(size);
  const activeInputStyles = getActiveInputStyles(size);
  const activeLabelStyles = getActiveLabelStyles(theme, fc, bc, size);

  return {
    container: {
      _focusWithin: {
        label: {
          ...activeLabelStyles,
        },
        'input, textarea': {
          ...activeInputStyles,
        },
        'label .chakra-form__required-indicator': {
          color: getColor(theme, fc),
        },
      },
      // label's styles
      label: {
        ...getDefaultLabelStyles(size),
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
      },
      'input:not(:placeholder-shown) + label, textarea:not(:placeholder-shown) + label': {
        ...activeLabelStyles,
      },
      'input[aria-invalid=true] + label, textarea[aria-invalid=true] + label': {
        color: getColor(theme, ec),
      },
      // input's styles
      'input, textarea': {
        padding: px,
      },
      'input[disabled] + label, textarea[disabled] + label': {
        backgroundColor: 'transparent',
      },
      'input:not(:placeholder-shown), textarea:not(:placeholder-shown)': {
        ...activeInputStyles,
      },
      // indicator's styles
      'input:not(:placeholder-shown) + label .chakra-form__required-indicator, textarea:not(:placeholder-shown) + label .chakra-form__required-indicator': {
        color: getColor(theme, fc),
      },
      'input[aria-invalid=true] + label .chakra-form__required-indicator, textarea[aria-invalid=true] + label .chakra-form__required-indicator': {
        color: getColor(theme, ec),
      },
    },
    requiredIndicator: {
      marginStart: 0,
      color: mode('gray.500', 'whiteAlpha.400')(props),
    },
  };
});

const variants = {
  floating: variantFloating,
};

const Form = defineMultiStyleConfig({
  variants,
});

export default Form;
