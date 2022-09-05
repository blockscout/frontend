import { alertAnatomy as parts } from '@chakra-ui/anatomy';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { getColor, mode, transparentize } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

function getBg(props: StyleFunctionProps): string {
  const { theme, colorScheme: c } = props;
  const lightBg = getColor(theme, `${ c }.100`, c);
  const darkBg = transparentize(`${ c }.200`, 0.16)(theme);

  return mode(lightBg, darkBg)(props);
}

const baseStyle = definePartsStyle({
  container: {
    borderRadius: 'md',
    px: 6,
    py: 4,
  },
});

const variantSubtle = definePartsStyle((props) => {
  return {
    container: {
      bgColor: getBg(props),
    },
  };
});

const variants = {
  subtle: variantSubtle,
};

const Alert = defineMultiStyleConfig({
  baseStyle,
  variants,
});

export default Alert;
