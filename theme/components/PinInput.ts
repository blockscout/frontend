import { defineStyle, defineStyleConfig } from '@chakra-ui/styled-system';

import getOutlinedFieldStyles from '../utils/getOutlinedFieldStyles';

const baseStyle = defineStyle({
  textAlign: 'center',
  bgColor: 'dialog_bg',
});

const sizes = {
  md: defineStyle({
    fontSize: 'md',
    w: 10,
    h: 10,
    borderRadius: 'md',
  }),
};

const variants = {
  outline: defineStyle(
    (props) => getOutlinedFieldStyles(props),
  ),
};

const PinInput = defineStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps: {
    size: 'md',
  },
});

export default PinInput;
