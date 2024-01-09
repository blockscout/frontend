import { ButtonGroup, Button, Flex, useRadio, useRadioGroup, useColorModeValue } from '@chakra-ui/react';
import type { UseRadioProps } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type RadioItemProps = {
  title: string;
  icon?: IconName;
  onlyIcon: false | undefined;
} | {
  title: string;
  icon: IconName;
  onlyIcon: true;
}

type RadioButtonProps = UseRadioProps & RadioItemProps;

const RadioButton = (props: RadioButtonProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);
  const buttonColor = useColorModeValue('blue.50', 'gray.800');
  const checkedTextColor = useColorModeValue('blue.700', 'gray.50');

  const input = getInputProps();
  const checkbox = getRadioProps();

  const styleProps = {
    flex: 1,
    variant: 'outline',
    fontWeight: 500,
    cursor: props.isChecked ? 'initial' : 'pointer',
    borderColor: buttonColor,
    backgroundColor: props.isChecked ? buttonColor : 'none',
    _hover: {
      borderColor: buttonColor,
      ...(props.isChecked ? {} : { color: 'link_hovered' }),
    },
    _active: {
      backgroundColor: 'none',
    },
    ...(props.isChecked ? { color: checkedTextColor } : {}),
  };

  if (props.onlyIcon) {
    return (
      <Button
        as="label"
        aria-label={ props.title }
        { ...styleProps }
      >
        <input { ...input }/>
        <Flex
          { ...checkbox }
        >
          <IconSvg name={ props.icon } boxSize={ 5 }/>
        </Flex>
      </Button>
    );
  }

  return (
    <Button
      as="label"
      leftIcon={ props.icon ? <IconSvg name={ props.icon } boxSize={ 5 } mr={ -1 }/> : undefined }
      { ...styleProps }
    >
      <input { ...input }/>
      <Flex
        { ...checkbox }
      >
        { props.title }
      </Flex>
    </Button>
  );
};

type RadioButtonGroupProps<T extends string> = {
  onChange: (value: T) => void;
  name: string;
  defaultValue: string;
  options: Array<{ value: T } & RadioItemProps>;
}

const RadioButtonGroup = <T extends string>({ onChange, name, defaultValue, options }: RadioButtonGroupProps<T>) => {
  const { getRootProps, getRadioProps } = useRadioGroup({ name, defaultValue, onChange });

  const group = getRootProps();

  return (
    <ButtonGroup { ...group } isAttached size="sm" display="grid" gridTemplateColumns={ `repeat(${ options.length }, 1fr)` }>
      { options.map((option) => {
        const props = getRadioProps({ value: option.value });
        return <RadioButton { ...props } key={ option.value } { ...option }/>;
      }) }
    </ButtonGroup>
  );
};

export default RadioButtonGroup;
