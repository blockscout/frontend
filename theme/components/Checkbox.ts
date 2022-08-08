import type { ComponentStyleConfig } from '@chakra-ui/theme';
import type { SystemStyleObject } from '@chakra-ui/theme-tools';

const baseStyleLabel: SystemStyleObject = {
  _disabled: { opacity: 0.2 },
};

const Checkbox: ComponentStyleConfig = {
  baseStyle: {
    label: baseStyleLabel,
  },
};

export default Checkbox;
