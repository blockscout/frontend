import { InputGroup, Input, InputLeftElement, Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import searchIcon from 'icons/search.svg';
import { useScrollDirection } from 'lib/contexts/scrollDirection';

const TOP = 55;

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  withShadow?: boolean;
}

const SearchBarMobile = ({ onChange, onSubmit, withShadow }: Props) => {

  const [ isSticky, setIsSticky ] = React.useState(false);
  const scrollDirection = useScrollDirection();

  const handleScroll = React.useCallback(() => {
    if (window.pageYOffset !== 0) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, []);

  React.useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  // replicate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      top={ `${ TOP }px` }
      left="0"
      zIndex="sticky1"
      bgColor={ bgColor }
      transform={ scrollDirection !== 'down' ? 'translateY(0)' : 'translateY(-100%)' }
      transitionProperty="transform,box-shadow"
      transitionDuration="slow"
      display={{ base: 'block', lg: 'none' }}
      w="100%"
      boxShadow={ withShadow && scrollDirection !== 'down' && isSticky ? 'md' : 'none' }
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
