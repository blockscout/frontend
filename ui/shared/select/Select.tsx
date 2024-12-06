import { PopoverTrigger, chakra, useDisclosure, useRadioGroup } from '@chakra-ui/react';
import React from 'react';

import type { SelectOption } from './types';

import Popover from 'ui/shared/chakra/Popover';

import SelectButton from './SelectButton';
import SelectContent from './SelectContent';

interface InjectedProps<Value extends string> {
  isOpen: boolean;
  onToggle: () => void;
  value: Value;
}

export interface Props<Value extends string> {
  className?: string;
  isLoading?: boolean;
  options: Array<SelectOption<Value>>;
  name: string;
  defaultValue?: Value;
  onChange: (value: Value) => void;
  children?: (props: InjectedProps<Value>) => React.ReactNode;
}

const Select = <Value extends string>({ className, isLoading, options, name, defaultValue, onChange, children }: Props<Value>) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleChange = React.useCallback((value: Value) => {
    onChange(value);
    onClose();
  }, [ onChange, onClose ]);

  const { value, getRootProps, getRadioProps, setValue } = useRadioGroup({
    name,
    defaultValue,
    onChange: handleChange,
  });

  React.useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [ defaultValue, setValue ]);

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        { children?.({ isOpen, onToggle, value: value as Value }) || (
          <SelectButton
            className={ className }
            onClick={ onToggle }
            isOpen={ isOpen }
            isLoading={ isLoading }
            label={ options.find((option) => option.value === value)?.label || String(value) }
          />
        ) }
      </PopoverTrigger>
      <SelectContent options={ options } getRootProps={ getRootProps } getRadioProps={ getRadioProps } value={ value }/>
    </Popover>
  );
};

export default React.memo(chakra(Select));
