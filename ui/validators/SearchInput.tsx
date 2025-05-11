/* eslint-disable */

import { chakra, Input, InputGroup, InputLeftElement, InputRightElement, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { ChangeEvent } from 'react';
import React, { useCallback, useState } from 'react';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  onChange?: (searchTerm: string) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  placeholder: string;
  initialValue?: string;
  isLoading?: boolean;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
};

const FilterInput = (props: Props) => {

  const {
    onChange,
    className,
    size = 'md',
    placeholder,
    initialValue = '',
    isLoading = false,
    type = 'text',
    name,
  } = props;
  const [ search, setSearch ] = useState<string>(initialValue);
  const [ isFocused, setIsFocused ] = useState<boolean>(false);
  const color = useColorModeValue('rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.3)');
  const borderColor = 'rgba(0, 46, 51, 0.10)';
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (onChange) {
      onChange(value);
    }
  }
  , [ onChange ]);
  const clearSearch = useCallback(() => {
    setSearch('');
    if (onChange) {
      onChange('');
    }
  }
  , [ onChange ]);
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }
  , []);

  return (
      <InputGroup
        _placeholder={{ color: 'rgba(0, 0, 0, 0.3)' }}
        fontWeight="400" fontSize="12px"
        _focus={{ borderColor: '#FF57B7 !important' }}
        
        borderColor="rgba(0, 46, 51, 0.1)"
        display="flex"
        alignItems="center"
        width={ '100%' }
    >
      <InputLeftElement
        w="16px" h="16px" position="absolute"
        left="16px"
        top="50%"
        transform="translateY(-50%)"
      >
        <IconSvg color="#FF57B7" w="16px" h="16px" name="search"/>
      </InputLeftElement>
      <Input
          value={ search }
          onChange={ handleChange }
          pl="40px"
          borderRadius="29px" height="42px"
          borderWidth="1px"
          borderColor={ isFocused ? '#FF57B7' : borderColor }
          fontSize="12px"
          fontWeight="400"
          color="#000"
          textAlign="left"
          fontStyle="normal"
          lineHeight="140%"
          fontFamily="HarmonyOS Sans"
          _focusVisible={{ borderColor: '#C15E97 !important' }}
          placeholder={ `Search for Validators` }
          _placeholder={{
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '140%',
            color: 'rgba(0, 0, 0, 0.3)',
            fontFamily: 'HarmonyOS Sans',
            fontStyle: 'normal',
          }}
      >
      </Input>
      {
        search && (
          <InputRightElement w="16px" h="16px" position="absolute"
            right="16px"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            onClick={ clearSearch }
          >
            <IconSvg border="1px solid #FF57B7" borderRadius="50%" color="#C15E97" w="16px" h="16px" name="cross"/>
          </InputRightElement>
        )
      }
    </InputGroup>
  );
};

export default chakra(FilterInput);
