import {
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useDisclosure,
  useRadio,
  Box,
  useRadioGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import Popover from 'ui/shared/chakra/Popover';
import FilterButton from 'ui/shared/filters/FilterButton';
import IconSvg from 'ui/shared/IconSvg';

// OPTION
export interface TOption {
  value: string;
  label: string;
}

type OptionProps = ReturnType<ReturnType<typeof useRadioGroup>['getRadioProps']>;

const Option = (props: OptionProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();
  const bgColorHover = useColorModeValue('blue.50', 'whiteAlpha.100');

  return (
    <Box
      as="label"
      px={ 4 }
      py={ 2 }
      cursor="pointer"
      display="flex"
      columnGap={ 3 }
      alignItems="center"
      _hover={{
        bgColor: bgColorHover,
      }}
    >
      <input { ...input }/>
      <Box { ...checkbox }>
        { props.children }
      </Box>
      { props.isChecked && <IconSvg name="check" boxSize={ 4 }/> }
    </Box>
  );
};

// FILTER

interface Props {
  name: string;
  options: Array<TOption>;
  hasActiveFilter: boolean;
  defaultValue?: string;
  isLoading?: boolean;
  onChange: (nextValue: string) => void;
}

const PopoverFilterRadio = ({ name, hasActiveFilter, options, isLoading, onChange, defaultValue }: Props) => {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    onChange,
  });

  const root = getRootProps();

  return (
    <Popover isOpen={ isOpen } onClose={ onClose } placement="bottom-start" isLazy>
      <PopoverTrigger>
        <FilterButton
          isActive={ isOpen }
          onClick={ onToggle }
          appliedFiltersNum={ hasActiveFilter ? 1 : 0 }
          isLoading={ isLoading }
        />
      </PopoverTrigger>
      <PopoverContent w="fit-content" minW="150px">
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

export default React.memo(PopoverFilterRadio);
