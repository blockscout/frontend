import { chakra, Tag as ChakraTag } from '@chakra-ui/react';
import * as React from 'react';

import { nbsp } from 'lib/html-entities';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

import { CloseButton } from './close-button';
import { Skeleton } from './skeleton';

export interface TagProps extends ChakraTag.RootProps {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  endElementProps?: ChakraTag.EndElementProps;
  label?: string;
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
      label,
      onClose,
      closable = Boolean(onClose),
      children,
      truncated = false,
      loading,
      selected,
      ...rest
    } = props;

    const labelElement = label ? (
      <chakra.span color="text.secondary">{ label }:{ nbsp }</chakra.span>
    ) : null;

    const contentElement = truncated ? (
      <TruncatedTextTooltip label={ children }>
        <ChakraTag.Label>{ labelElement }{ children }</ChakraTag.Label>
      </TruncatedTextTooltip>
    ) : <ChakraTag.Label>{ labelElement }{ children }</ChakraTag.Label>;

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
          { contentElement }
          { endElement && (
            <ChakraTag.EndElement { ...endElementProps }>{ endElement }</ChakraTag.EndElement>
          ) }
          { closable && (
            <ChakraTag.EndElement>
              <ChakraTag.CloseTrigger onClick={ onClose } asChild>
                <CloseButton/>
              </ChakraTag.CloseTrigger>
            </ChakraTag.EndElement>
          ) }
        </ChakraTag.Root>
      </Skeleton>
    );
  },
);
