import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import {
  AbsoluteCenter,
  Button as ChakraButton,
  Span,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';

interface ButtonLoadingProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {
  active?: boolean;
  selected?: boolean;
  highlighted?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { loading, disabled, loadingText, children, active, selected, highlighted, ...rest } = props;

    const content = (() => {
      if (loading && !loadingText) {
        return (
          <>
            <AbsoluteCenter display="inline-flex">
              <Spinner size="inherit" color="inherit"/>
            </AbsoluteCenter>
            <Span opacity={ 0 }>{ children }</Span>
          </>
        );
      }

      if (loading && loadingText) {
        return (
          <>
            <Spinner size="inherit" color="inherit"/>
            { loadingText }
          </>
        );
      }

      return children;
    })();

    return (
      <ChakraButton
        { ...(active ? { 'data-active': true } : {}) }
        { ...(selected ? { 'data-selected': true } : {}) }
        { ...(highlighted ? { 'data-highlighted': true } : {}) }
        { ...(loading ? { 'data-loading': true } : {}) }
        disabled={ loading || disabled }
        ref={ ref }
        { ...rest }
      >
        { content }
      </ChakraButton>
    );
  },
);
