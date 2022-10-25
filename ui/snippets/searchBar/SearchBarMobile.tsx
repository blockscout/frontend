import { InputGroup, Input, InputLeftElement, Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import searchIcon from 'icons/search.svg';
import useScrollDirection from 'lib/hooks/useScrollDirection';

const TOP = 55;

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const SearchBarMobile = ({ onChange, onSubmit }: Props) => {

  const scrollDirection = useScrollDirection();
  const isVisible = !scrollDirection || scrollDirection === 'up';

  const [ isSticky, setIsSticky ] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    if (window.pageYOffset === 0 || !isVisible) {
      setIsSticky(false);
    } else {
      setIsSticky(true);
    }
  }, [ isVisible ]);

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
      transform={ isVisible ? 'translateY(0)' : 'translateY(-112px)' }
      transitionProperty="transform,box-shadow"
      transitionDuration="slow"
      display={{ base: 'block', lg: 'none' }}
      w="100%"
      boxShadow={ isVisible && isSticky ? 'md' : 'none' }
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
