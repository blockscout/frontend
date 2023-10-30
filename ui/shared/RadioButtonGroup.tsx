import { ButtonGroup, Button, Box, useRadio, useRadioGroup, useColorModeValue } from '@chakra-ui/react';
import type { UseRadioProps } from '@chakra-ui/react';
import React from 'react';

type RadioButtonProps = UseRadioProps & {
  children: React.ReactNode;
}

const RadioButton = (props: RadioButtonProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const buttonColor = useColorModeValue('blue.50', 'gray.800');

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Button
      as="label"
      variant="outline"
      fontWeight={ 500 }
      cursor={ props.isChecked ? 'initial' : 'pointer' }
      borderColor={ buttonColor }
      _hover={{
        borderColor: buttonColor,
        ...(props.isChecked ? {} : { color: 'link_hovered' }),

      }}
      _active={{
        backgroundColor: 'none',
      }}
      backgroundColor={ props.isChecked ? buttonColor : 'none' }
      { ...(props.isChecked ? { color: 'text' } : {}) }
    >
      <input { ...input }/>
      <Box
        { ...checkbox }
      >
        { props.children }
      </Box>
    </Button>
  );
};

type RadioButtonGroupProps<T extends string> = {
  onChange: (value: T) => void;
  name: string;
  defaultValue: string;
  options: Array<{title: string; value: T}>;
}

const RadioButtonGroup = <T extends string>({ onChange, name, defaultValue, options }: RadioButtonGroupProps<T>) => {
  const { getRootProps, getRadioProps } = useRadioGroup({ name, defaultValue, onChange });

  const group = getRootProps();

  return (
    <ButtonGroup { ...group } isAttached size="sm">
      { options.map((option) => {
        const props = getRadioProps({ value: option.value });
        return <RadioButton { ...props } key={ option.value }>{ option.title }</RadioButton>;
      }) }
    </ButtonGroup>
  );
};

export default RadioButtonGroup;
