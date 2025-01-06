import type { SkeletonProps } from '@chakra-ui/react';
// eslint-disable-next-line no-restricted-imports
import { Skeleton as ChakraSkeleton } from '@chakra-ui/react';
import { forwardRef } from 'react';

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
  if (props.isLoaded) {
    return <ChakraSkeleton ref={ ref } { ...props } sx={{ animation: 'none' }}/>;
  }

  return <ChakraSkeleton ref={ ref } { ...props }/>;
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;
