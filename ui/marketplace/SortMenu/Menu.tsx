import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  useRadioGroup,
} from '@chakra-ui/react';
import React from 'react';

import SortButton from './Button';
import Option from './Option';
import type { TOption } from './Option';

interface Props {
  name: string;
  options: Array<TOption>;
  defaultValue?: string;
  isLoading?: boolean;
  onChange: (nextValue: 'default' | 'security_score') => void;
}

const SortMenu = ({ name, options, isLoading, onChange, defaultValue }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleChange = (nextValue: 'default' | 'security_score') => {
    onChange(nextValue);
    onClose();
  };

  const { value, getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange: handleChange,
  });

  const root = getRootProps();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <SortButton isMenuOpen={ isOpen } isLoading={ isLoading } onClick={ onToggle }>
          { options.find(option => option.value === value)?.label }
        </SortButton>
      </PopoverTrigger>
      <PopoverContent w="fit-content" minW="165px">
        <PopoverBody { ...root } py={ 2 } px={ 0 } display="flex" flexDir="column">
          { options.map((option) => {
            const radio = getRadioProps({ value: option.value });
            return (
              <Option key={ option.value } { ...radio }>
                { option.label }
              </Option>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(SortMenu);
