import type { BoxProps, InputElementProps } from '@chakra-ui/react';
import { Group, InputElement } from '@chakra-ui/react';
import { debounce } from 'es-toolkit';
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

    const [ inlinePaddings, setInlinePaddings ] = React.useState<{ start?: number; end?: number }>();

    const calculateInlinePaddings = React.useCallback(() => {
      const { width: endWidth } = endElementRef?.current?.getBoundingClientRect() ?? {};
      const { width: startWidth } = startElementRef?.current?.getBoundingClientRect() ?? {};

      setInlinePaddings({
        start: startWidth ?? 0,
        end: endWidth ?? 0,
      });
    }, []);

    React.useEffect(() => {
      calculateInlinePaddings();

      const resizeHandler = debounce(calculateInlinePaddings, 300);
      const resizeObserver = new ResizeObserver(resizeHandler);
      resizeObserver.observe(window.document.body);

      return function cleanup() {
        resizeObserver.unobserve(window.document.body);
      };
    }, [ calculateInlinePaddings ]);

    return (
      <Group ref={ ref } w="100%" { ...rest }>
        { startElement && (
          <InputElement pointerEvents="none" ref={ startElementRef } px={ 0 } color="gray.500" { ...startElementProps }>
            { startElement }
          </InputElement>
        ) }
        { React.Children.map(children, (child: React.ReactElement<InputProps>) => {
          if (getComponentDisplayName(child.type) !== 'FieldInput') {
            return child;
          }
          return React.cloneElement(child, {
            ...(startElement && { ps: startOffset ?? (inlinePaddings?.start ? `${ inlinePaddings.start }px` : undefined) }),
            ...(endElement && { pe: endOffset ?? (inlinePaddings?.end ? `${ inlinePaddings.end }px` : undefined) }),
            // hide input value and placeholder for the first render
            value: inlinePaddings ? child.props.value : undefined,
            placeholder: inlinePaddings ? child.props.placeholder : undefined,
          });
        }) }
        { endElement && (
          <InputElement placement="end" ref={ endElementRef } px={ 0 } color="gray.500" { ...endElementProps }>
            { endElement }
          </InputElement>
        ) }
      </Group>
    );
  },
);

InputGroup.displayName = 'InputGroup';
