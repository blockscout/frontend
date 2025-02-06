import { RadioGroup as ChakraRadioGroup } from '@chakra-ui/react';
import * as React from 'react';

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  rootRef?: React.Ref<HTMLDivElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, ...rest } = props;
    return (
      <ChakraRadioGroup.Item ref={ rootRef } { ...rest }>
        <ChakraRadioGroup.ItemHiddenInput ref={ ref } { ...inputProps }/>
        <ChakraRadioGroup.ItemIndicator/>
        { children && (
          <ChakraRadioGroup.ItemText>{ children }</ChakraRadioGroup.ItemText>
        ) }
      </ChakraRadioGroup.Item>
    );
  },
);

export interface RadioGroupProps extends ChakraRadioGroup.RootProps {}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const { orientation = 'horizontal', ...rest } = props;
    return (
      <ChakraRadioGroup.Root
        ref={ ref }
        orientation={ orientation }
        display="flex"
        flexDirection={ orientation === 'horizontal' ? 'row' : 'column' }
        gap={ orientation === 'horizontal' ? 4 : 2 }
        { ...rest }
      />
    );
  },
);
