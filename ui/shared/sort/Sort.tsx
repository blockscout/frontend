import {
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  useRadioGroup,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import Popover from 'ui/shared/chakra/Popover';

import SortButtonDesktop from './ButtonDesktop';
import SortButtonMobile from './ButtonMobile';
import Option from './Option';
import type { TOption } from './Option';

interface Props<Sort extends string> {
  name: string;
  options: Array<TOption<Sort>>;
  defaultValue?: Sort;
  isLoading?: boolean;
  onChange: (value: Sort | undefined) => void;
}

const Sort = <Sort extends string>({ name, options, isLoading, onChange, defaultValue }: Props<Sort>) => {
  const isMobile = useIsMobile(false);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const handleChange = (value: Sort) => {
    onChange(value);
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
        { isMobile ? (
          <SortButtonMobile isActive={ isOpen || Boolean(value) } onClick={ onToggle } isLoading={ isLoading }/>
        ) : (
          <SortButtonDesktop isActive={ isOpen } isLoading={ isLoading } onClick={ onToggle }>
            { options.find((option: TOption<Sort>) => option.id === value || (!option.id && !value))?.title }
          </SortButtonDesktop>
        ) }
      </PopoverTrigger>
      <PopoverContent w="fit-content" minW="165px">
        <PopoverBody { ...root } py={ 2 } px={ 0 } display="flex" flexDir="column">
          { options.map((option, index) => {
            const radio = getRadioProps({ value: option.id });
            return (
              <Option key={ index } { ...radio } isChecked={ radio.isChecked || (!option.id && !value) }>
                { option.title }
              </Option>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(chakra(Sort)) as typeof Sort;
