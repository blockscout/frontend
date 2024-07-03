import { switchAnatomy as parts } from '@chakra-ui/anatomy';
import { defineStyle, createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { mode } from '@chakra-ui/theme-tools';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyleTrack = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    _checked: {
      bg: mode(`${ c }.500`, `${ c }.300`)(props),
      _hover: {
        bg: mode(`${ c }.600`, `${ c }.400`)(props),
      },
    },
    _focusVisible: {
      boxShadow: 'none',
    },
  };
});

const baseStyle = definePartsStyle((props) => ({
  track: baseStyleTrack(props),
}));

const Switch = defineMultiStyleConfig({
  baseStyle,
});

export default Switch;
