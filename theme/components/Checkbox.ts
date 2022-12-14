import { checkboxAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';
import { runIfFn } from '@chakra-ui/utils';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleControl = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    _checked: {
      bg: mode(`${ c }.500`, `${ c }.300`)(props),
      borderColor: mode(`${ c }.500`, `${ c }.300`)(props),
      _hover: {
        bg: mode(`${ c }.600`, `${ c }.400`)(props),
        borderColor: mode(`${ c }.600`, `${ c }.400`)(props),
      },
    },
    _indeterminate: {
      bg: mode(`${ c }.500`, `${ c }.300`)(props),
      borderColor: mode(`${ c }.500`, `${ c }.300`)(props),
    },
  };
});

const baseStyleLabel = defineStyle({
  _disabled: { opacity: 0.2 },
});

const baseStyle = definePartsStyle((props) => ({
  label: baseStyleLabel,
  control: runIfFn(baseStyleControl, props),
}));

const Checkbox = defineMultiStyleConfig({
  baseStyle,
});

export default Checkbox;
