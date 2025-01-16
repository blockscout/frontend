import type { BoxProps, InputElementProps } from '@chakra-ui/react';
import { Group, InputElement } from '@chakra-ui/react';
import * as React from 'react';

import getComponentDisplayName from '../utils/getComponentDisplayName';
import type { InputProps } from './input';

export interface InputGroupProps extends BoxProps {
  startElementProps?: InputElementProps;
  endElementProps?: InputElementProps;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  children: React.ReactElement<InputElementProps>;
  startOffset?: InputElementProps['paddingStart'];
  endOffset?: InputElementProps['paddingEnd'];
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      startElement,
      startElementProps,
      endElement,
      endElementProps,
      children,
      startOffset,
      endOffset,
      ...rest
    } = props;
    return (
      <Group ref={ ref } w="100%" { ...rest }>
        { startElement && (
          <InputElement pointerEvents="none" { ...startElementProps }>
            { startElement }
          </InputElement>
        ) }
        { React.Children.map(children, (child: React.ReactElement<InputProps>) => {
          if (getComponentDisplayName(child.type) !== 'FieldInput') {
            return child;
          }
          return React.cloneElement(child, {
            ...(startElement && { ps: startOffset ?? `calc(var(--input-height) - 6px)` }),
            ...(endElement && { pe: endOffset ?? `calc(var(--input-height) - 6px)` }),
          });
        }) }
        { endElement && (
          <InputElement placement="end" { ...endElementProps }>
            { endElement }
          </InputElement>
        ) }
      </Group>
    );
  },
);

InputGroup.displayName = 'InputGroup';
