import { chakra, ButtonGroup, Button, Flex, useRadio, useRadioGroup, Skeleton } from '@chakra-ui/react';
import type { ChakraProps, UseRadioProps } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type RadioItemProps = {
  title: string;
  icon?: IconName;
  onlyIcon?: false;
  contentAfter?: React.ReactNode;
} | {
  title: string;
  icon: IconName;
  onlyIcon: true;
};

type RadioButtonProps = UseRadioProps & RadioItemProps;

const RadioButton = (props: RadioButtonProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  if (props.onlyIcon) {
    return (
      <Button
        as="label"
        aria-label={ props.title }
        variant="radio_group"
        data-selected={ props.isChecked }
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
      variant="radio_group"
      data-selected={ props.isChecked }
    >
      <input { ...input }/>
      <Flex
        alignItems="center"
        { ...checkbox }
      >
        { props.title }
        { props.contentAfter }
      </Flex>
    </Button>
  );
};

type RadioButtonGroupProps<T extends string> = {
  onChange: (value: T) => void;
  name: string;
  defaultValue: string;
  options: Array<{ value: T } & RadioItemProps>;
  autoWidth?: boolean;
  className?: string;
  isLoading?: boolean;
};

const RadioButtonGroup = <T extends string>({ onChange, name, defaultValue, options, autoWidth = false, className, isLoading }: RadioButtonGroupProps<T>) => {
  const { getRootProps, getRadioProps } = useRadioGroup({ name, defaultValue, onChange });

  const group = getRootProps();

  return (
    <Skeleton isLoaded={ !isLoading }>
      <ButtonGroup
        { ...group }
        className={ className }
        isAttached
        size="sm"
        display="grid"
        gridTemplateColumns={ `repeat(${ options.length }, ${ autoWidth ? 'auto' : '1fr' })` }
      >
        { options.map((option) => {
          const props = getRadioProps({ value: option.value });
          return <RadioButton { ...props } key={ option.value } { ...option }/>;
        }) }
      </ButtonGroup>
    </Skeleton>
  );
};

const WrappedRadioButtonGroup = chakra(RadioButtonGroup);
type WrappedComponent = <T extends string>(props: RadioButtonGroupProps<T> & ChakraProps) => React.JSX.Element;

export default React.memo(WrappedRadioButtonGroup) as WrappedComponent;
