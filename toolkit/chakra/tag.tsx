import { Tag as ChakraTag } from '@chakra-ui/react';
import * as React from 'react';

import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import { Skeleton } from './skeleton';

export interface TagProps extends ChakraTag.RootProps {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  endElementProps?: ChakraTag.EndElementProps;
  onClose?: VoidFunction;
  closable?: boolean;
  truncated?: boolean;
  loading?: boolean;
  selected?: boolean;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  function Tag(props, ref) {
    const {
      startElement,
      endElement,
      endElementProps,
      onClose,
      closable = Boolean(onClose),
      children,
      truncated = false,
      loading,
      selected,
      ...rest
    } = props;

    const labelElement = truncated ? (
      <TruncatedTextTooltip label={ children }>
        <ChakraTag.Label>{ children }</ChakraTag.Label>
      </TruncatedTextTooltip>
    ) : <ChakraTag.Label>{ children }</ChakraTag.Label>;

    return (
      <Skeleton loading={ loading } asChild>
        <ChakraTag.Root
          ref={ ref }
          { ...(selected && { 'data-selected': true }) }
          { ...rest }
        >
          { startElement && (
            <ChakraTag.StartElement _empty={{ display: 'none' }}>{ startElement }</ChakraTag.StartElement>
          ) }
          { labelElement }
          { endElement && (
            <ChakraTag.EndElement { ...endElementProps }>{ endElement }</ChakraTag.EndElement>
          ) }
          { closable && (
            <ChakraTag.EndElement>
              <ChakraTag.CloseTrigger onClick={ onClose }/>
            </ChakraTag.EndElement>
          ) }
        </ChakraTag.Root>
      </Skeleton>
    );
  },
);
