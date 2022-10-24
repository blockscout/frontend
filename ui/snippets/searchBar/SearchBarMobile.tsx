import { InputGroup, Input, InputLeftElement, Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import searchIcon from 'icons/search.svg';
import useScrollVisibility from 'lib/hooks/useScrollVisibility';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const SearchBarMobile = ({ onChange, onSubmit }: Props) => {

  const isVisible = useScrollVisibility('up');

  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'black');

  return (
    <chakra.form
      noValidate
      onSubmit={ onSubmit }
      paddingX={ 4 }
      paddingTop={ 1 }
      paddingBottom={ 2 }
      position="fixed"
      top="56px"
      left="0"
      zIndex="docked"
      bgColor={ bgColor }
      transform={ isVisible ? 'translateY(0)' : 'translateY(-100%)' }
      transitionProperty="transform"
      transitionDuration="slow"
      display={{ base: 'block', lg: 'none' }}
      w="100%"
    >
      <InputGroup size="sm">
        <InputLeftElement >
          <Icon as={ searchIcon } boxSize={ 4 } color={ searchIconColor }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="38px"
          placeholder="Search by addresses / ... "
          ml="1px"
          onChange={ onChange }
          borderColor={ inputBorderColor }
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(SearchBarMobile);
