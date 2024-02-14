import { alertAnatomy as parts } from '@chakra-ui/anatomy';
import type { StyleFunctionProps } from '@chakra-ui/styled-system';
import { createMultiStyleConfigHelpers, cssVar } from '@chakra-ui/styled-system';
import { transparentize } from '@chakra-ui/theme-tools';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const $fg = cssVar('alert-fg');
const $bg = cssVar('alert-bg');

function getBg(props: StyleFunctionProps) {
  const { theme, colorScheme: c } = props;
  const darkBg = transparentize(`${ c }.200`, 0.16)(theme);
  return {
    light: `colors.${ c }.${ c === 'red' ? '50' : '100' }`,
    dark: darkBg,
  };
}

const baseStyle = definePartsStyle({
  container: {
    bg: $bg.reference,
    borderRadius: 'md',
    px: 6,
    py: 3,
  },
  title: {
    fontWeight: 'bold',
    lineHeight: '6',
    marginEnd: '2',
  },
  description: {
    lineHeight: '6',
  },
  icon: {
    color: $fg.reference,
    flexShrink: 0,
    marginEnd: '3',
    w: '5',
    h: '6',
  },
  spinner: {
    color: $fg.reference,
    flexShrink: 0,
    marginEnd: '3',
    w: '5',
    h: '5',
  },
});

const variantSubtle = definePartsStyle((props) => {
  const { colorScheme } = props;
  const bg = getBg(props);

  return {
    container: {
      [$fg.variable]: colorScheme === 'gray' ? 'colors.blackAlpha.800' : `colors.${ colorScheme }.500`,
      [$bg.variable]: colorScheme === 'gray' ? 'colors.blackAlpha.100' : bg.light,
      _dark: {
        [$fg.variable]: colorScheme === 'gray' ? 'colors.whiteAlpha.800' : `colors.${ colorScheme }.200`,
        [$bg.variable]: colorScheme === 'gray' ? 'colors.whiteAlpha.200' : bg.dark,
      },
    },
  };
});

const variantSolid = definePartsStyle((props) => {
  const { colorScheme: c } = props;
  return {
    container: {
      [$fg.variable]: `colors.white`,
      [$bg.variable]: `colors.${ c }.500`,
      _dark: {
        [$fg.variable]: `colors.gray.900`,
        [$bg.variable]: `colors.${ c }.200`,
      },
      color: $fg.reference,
    },
  };
});

const variants = {
  subtle: variantSubtle,
  solid: variantSolid,
};

const Alert = defineMultiStyleConfig({
  baseStyle,
  variants,
  defaultProps: {
    variant: 'subtle',
    colorScheme: 'blue',
  },
});

export default Alert;
