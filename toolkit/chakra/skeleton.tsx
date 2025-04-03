import type {
  SkeletonProps as ChakraSkeletonProps,
  CircleProps,
} from '@chakra-ui/react';
import { Skeleton as ChakraSkeleton, Circle, Stack } from '@chakra-ui/react';
import * as React from 'react';

export interface SkeletonCircleProps extends ChakraSkeletonProps {
  size?: CircleProps['size'];
}

export const SkeletonCircle = React.forwardRef<
  HTMLDivElement,
  SkeletonCircleProps
>(function SkeletonCircle(props, ref) {
  const { size, ...rest } = props;
  return (
    <Circle size={ size } asChild ref={ ref }>
      <ChakraSkeleton { ...rest }/>
    </Circle>
  );
});

export interface SkeletonTextProps extends ChakraSkeletonProps {
  noOfLines?: number;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    const { noOfLines = 3, gap, ...rest } = props;
    return (
      <Stack gap={ gap } width="full" ref={ ref }>
        { Array.from({ length: noOfLines }).map((_, index) => (
          <ChakraSkeleton
            height="4"
            key={ index }
            { ...props }
            _last={{ maxW: '80%' }}
            { ...rest }
          />
        )) }
      </Stack>
    );
  },
);

export interface SkeletonProps extends Omit<ChakraSkeletonProps, 'loading'> {
  loading: boolean | undefined;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(props, ref) {
    const { loading = false, ...rest } = props;
    return (
      <ChakraSkeleton
        loading={ loading }
        css={ !loading ? { animation: 'none' } : {} }
        { ...(loading ? { 'data-loading': true } : {}) }
        { ...rest }
        ref={ ref }
      />
    );
  },
);
