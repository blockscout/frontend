// SPDX-License-Identifier: LicenseRef-Blockscout

import type {
  SkeletonProps as ChakraSkeletonProps,
  CircleProps,
} from '@chakra-ui/react';
import { Skeleton as ChakraSkeleton, Circle, Stack, chakra, mergeRefs } from '@chakra-ui/react';
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

    // When the skeleton is inactive, skip ChakraSkeleton entirely — its recipe resolution
    // is a top render-time offender on pages with many idle instances (~1000 per table page).
    // The inactive skeleton contributes no visuals (its "none" variant only sets `animation: none`),
    // so with asChild we merge our props directly into the only child, and otherwise render
    // a plain chakra.div (ChakraSkeleton also renders a div).
    if (!loading) {
      const { asChild, children, ...styleProps } = rest;

      if (asChild && React.isValidElement(children)) {
        // all asChild call sites have a chakra-styled child, so it accepts style props;
        // on conflicts the child's own props win, except the mergeable className/css/ref
        const child = children as React.ReactElement<Record<string, unknown>>;
        const mergedProps: Record<string, unknown> = { ...styleProps, ...child.props };

        if (styleProps.className && child.props.className) {
          mergedProps.className = `${ styleProps.className } ${ child.props.className }`;
        }
        if (styleProps.css && child.props.css) {
          mergedProps.css = [ styleProps.css, child.props.css ];
        }

        const childRef = child.props.ref as React.Ref<HTMLDivElement> | undefined;
        if (ref) {
          mergedProps.ref = childRef ? mergeRefs(ref, childRef) : ref;
        }

        return React.cloneElement(child, mergedProps);
      }

      return <chakra.div ref={ ref } { ...styleProps }>{ children }</chakra.div>;
    }

    return (
      <ChakraSkeleton
        ref={ ref }
        data-loading
        state="loading"
        { ...rest }
      />
    );
  },
);
