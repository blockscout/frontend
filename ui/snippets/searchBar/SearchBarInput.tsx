import { InputGroup, Input, InputLeftElement, Icon, chakra, useColorModeValue, forwardRef } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import searchIcon from 'icons/search.svg';
import { useScrollDirection } from 'lib/contexts/scrollDirection';
import useIsMobile from 'lib/hooks/useIsMobile';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBlur: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus: () => void;
  isHomepage?: boolean;
  withShadow?: boolean;
}

const SearchBarInput = ({ onChange, onSubmit, isHomepage, onFocus, onBlur, withShadow }: Props, ref: React.ForwardedRef<HTMLFormElement>) => {
  const [ isSticky, setIsSticky ] = React.useState(false);
  const scrollDirection = useScrollDirection();
  const isMobile = useIsMobile();

  const handleScroll = React.useCallback(() => {
    if (window.pageYOffset !== 0) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isMobile || isHomepage) {
      return;
    }
    const throttledHandleScroll = throttle(handleScroll, 300);

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  // replicate componentDidMount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isMobile ]);

  const bgColor = useColorModeValue('white', 'black');
  const transformMobile = scrollDirection !== 'down' ? 'translateY(0)' : 'translateY(-100%)';

  return (
    <chakra.form
      ref={ ref }
      noValidate
      onSubmit={ onSubmit }
      onBlur={ onBlur }
      onFocus={ onFocus }
      w="100%"
      backgroundColor={ isHomepage ? 'white' : bgColor }
      borderRadius={{ base: isHomepage ? 'base' : 'none', lg: 'base' }}
      position={{ base: isHomepage ? 'static' : 'fixed', lg: 'static' }}
      top={{ base: isHomepage ? 0 : 55, lg: 0 }}
      left="0"
      zIndex={{ base: isHomepage ? 'auto' : 'sticky1', lg: 'auto' }}
      paddingX={{ base: isHomepage ? 0 : 4, lg: 0 }}
      paddingTop={{ base: isHomepage ? 0 : 1, lg: 0 }}
      paddingBottom={{ base: isHomepage ? 0 : 4, lg: 0 }}
      boxShadow={ withShadow && scrollDirection !== 'down' && isSticky ? 'md' : 'none' }
      transform={{ base: isHomepage ? 'none' : transformMobile, lg: 'none' }}
      transitionProperty="transform,box-shadow"
      transitionDuration="slow"
    >
      <InputGroup size={{ base: isHomepage ? 'md' : 'sm', lg: 'md' }}>
        <InputLeftElement w={{ base: isHomepage ? 6 : 4, lg: 6 }} ml={{ base: isHomepage ? 4 : 3, lg: 4 }} h="100%">
          <Icon as={ searchIcon } boxSize={{ base: isHomepage ? 6 : 4, lg: 6 }} color={ useColorModeValue('blackAlpha.600', 'whiteAlpha.600') }/>
        </InputLeftElement>
        <Input
          pl={{ base: isHomepage ? '50px' : '38px', lg: '50px' }}
          sx={{
            '@media screen and (max-width: 999px)': {
              paddingLeft: isHomepage ? '50px' : '38px',
            },
          }}
          placeholder={ isMobile ? 'Search by addresses / ... ' : 'Search by addresses / transactions / block / token... ' }
          onChange={ onChange }
          border={ isHomepage ? 'none' : '2px solid' }
          borderColor={ useColorModeValue('blackAlpha.100', 'whiteAlpha.200') }
          _focusWithin={{ _placeholder: { color: 'gray.300' } }}
          color={ useColorModeValue('black', 'white') }
        />
      </InputGroup>
    </chakra.form>
  );
};

export default React.memo(forwardRef(SearchBarInput));
