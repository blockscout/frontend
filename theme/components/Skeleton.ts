import { Skeleton as SkeletonComponent } from '@chakra-ui/react';
import { keyframes } from '@chakra-ui/system';
import type { SystemStyleFunction } from '@chakra-ui/theme-tools';
import { getColor, mode } from '@chakra-ui/theme-tools';

const shine = () =>
  keyframes({
    to: { backgroundPositionX: '-200%' },
  });

const baseStyle: SystemStyleFunction = (props) => {
  const defaultStartColor = mode('blackAlpha.50', 'whiteAlpha.50')(props);
  const defaultEndColor = mode('blackAlpha.100', 'whiteAlpha.100')(props);

  const {
    startColor = defaultStartColor,
    endColor = defaultEndColor,
    speed,
    theme,
  } = props;

  const start = getColor(theme, startColor);
  const end = getColor(theme, endColor);

  return {
    opacity: 1,
    borderRadius: 'base',
    borderColor: start,
    background: `linear-gradient(90deg, ${ start } 8%, ${ end } 18%, ${ start } 33%)`,
    backgroundSize: '200% 100%',
    animation: `${ speed }s linear infinite ${ shine() }`,
  };
};

const Skeleton = {
  baseStyle,
};

export default Skeleton;

SkeletonComponent.defaultProps = {
  ...SkeletonComponent.defaultProps,
  speed: 1,
};
