import { Skeleton as SkeletonComponent } from '@chakra-ui/react';
import {
  defineStyle,
  defineStyleConfig,
} from '@chakra-ui/styled-system';
import { keyframes } from '@chakra-ui/system';
import { getColor, mode } from '@chakra-ui/theme-tools';

const shine = () =>
  keyframes({
    to: { backgroundPositionX: '-200%' },
  });

const baseStyle = defineStyle((props) => {
  const defaultStartColor = mode('blackAlpha.50', 'whiteAlpha.50')(props);
  const defaultEndColor = mode('blackAlpha.100', 'whiteAlpha.100')(props);

  const {
    startColor = defaultStartColor,
    endColor = defaultEndColor,
    theme,
  } = props;

  const start = getColor(theme, startColor);
  const end = getColor(theme, endColor);

  return {
    opacity: 1,
    borderRadius: 'md',
    borderColor: start,
    background: `linear-gradient(90deg, ${ start } 8%, ${ end } 18%, ${ start } 33%)`,
    backgroundSize: '200% 100%',
  };
});

const Skeleton = defineStyleConfig({
  baseStyle,
});

export default Skeleton;

SkeletonComponent.defaultProps = {
  ...SkeletonComponent.defaultProps,
  speed: 1,
  animation: `1s linear infinite ${ shine() }`,
};
