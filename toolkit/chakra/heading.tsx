import type { HeadingProps as ChakraHeadingProps } from '@chakra-ui/react';
import { Heading as ChakraHeading } from '@chakra-ui/react';
import React from 'react';

export interface HeadingProps extends ChakraHeadingProps {
  level?: '1' | '2' | '3';
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading(props, ref) {
    const { level, ...rest } = props;

    const textStyle = (() => {
      if (level === '1') {
        return { base: 'heading.md', lg: 'heading.xl' };
      }

      if (level === '2') {
        return { base: 'heading.sm', lg: 'heading.lg' };
      }

      return { base: 'heading.xs', lg: 'heading.md' };
    })();

    const as = (() => {
      if (level === '1') {
        return 'h1';
      }

      if (level === '2') {
        return 'h2';
      }

      return 'h3';
    })();

    return <ChakraHeading ref={ ref } color="heading" textStyle={ textStyle } as={ as } { ...rest }/>;
  });
