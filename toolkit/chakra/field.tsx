import { Field as ChakraField } from '@chakra-ui/react';
import * as React from 'react';

import { space } from 'lib/html-entities';

import type { InputProps } from './input';

export interface FieldProps extends Omit<ChakraField.RootProps, 'label' | 'children'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  children: React.ReactElement<InputProps>;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const { label, children, helperText, errorText, optionalText, ...rest } = props;

    // A floating field cannot be without a label.
    if (props.floating && label) {
      const child = React.Children.only<React.ReactElement<InputProps>>(children);
      const clonedChild = React.cloneElement(child, {
        className: 'peer',
        placeholder: ' ',
        size: props.size,
        floating: props.floating,
        bgColor: rest.bgColor,
      });

      return (
        <ChakraField.Root pos="relative" w="full" ref={ ref } { ...rest }>
          { clonedChild }
          <ChakraField.Label bgColor={ rest.bgColor }>
            { label }
            <ChakraField.RequiredIndicator fallback={ optionalText }/>
            { errorText && (
              <ChakraField.ErrorText ml="2px">-{ space }{ errorText }</ChakraField.ErrorText>
            ) }
          </ChakraField.Label>
          { helperText && (
            <ChakraField.HelperText>{ helperText }</ChakraField.HelperText>
          ) }
        </ChakraField.Root>
      );
    }

    return (
      <ChakraField.Root ref={ ref } { ...rest }>
        { label && (
          <ChakraField.Label>
            { label }
            <ChakraField.RequiredIndicator fallback={ optionalText }/>
          </ChakraField.Label>
        ) }
        { children }
        { helperText && (
          <ChakraField.HelperText>{ helperText }</ChakraField.HelperText>
        ) }
        { errorText && (
          <ChakraField.ErrorText>{ errorText }</ChakraField.ErrorText>
        ) }
      </ChakraField.Root>
    );
  },
);
