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

    const startElementRef = React.useRef<HTMLDivElement>(null);
    const endElementRef = React.useRef<HTMLDivElement>(null);

    const [ inlinePaddings, setInlinePaddings ] = React.useState({
      start: 0,
      end: 0,
    });

    React.useEffect(() => {
      const { width: endWidth } = endElementRef?.current?.getBoundingClientRect() ?? {};
      const { width: startWidth } = startElementRef?.current?.getBoundingClientRect() ?? {};

      setInlinePaddings({
        start: startWidth ?? 0,
        end: endWidth ?? 0,
      });
    }, []);

    return (
      <Group ref={ ref } w="100%" { ...rest }>
        { startElement && (
          <InputElement pointerEvents="none" ref={ startElementRef } { ...startElementProps }>
            { startElement }
          </InputElement>
        ) }
        { React.Children.map(children, (child: React.ReactElement<InputProps>) => {
          if (getComponentDisplayName(child.type) !== 'FieldInput') {
            return child;
          }
          return React.cloneElement(child, {
            ...(startElement && { ps: startOffset ?? `${ inlinePaddings.start }px` }),
            ...(endElement && { pe: endOffset ?? `${ inlinePaddings.end }px` }),
          });
        }) }
        { endElement && (
          <InputElement placement="end" ref={ endElementRef } { ...endElementProps }>
            { endElement }
          </InputElement>
        ) }
      </Group>
    );
  },
);

InputGroup.displayName = 'InputGroup';
