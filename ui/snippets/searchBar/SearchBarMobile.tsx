import { InputGroup, Input, InputLeftElement, Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import clamp from 'lodash/clamp';
import throttle from 'lodash/throttle';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import searchIcon from 'icons/search.svg';
import isBrowser from 'lib/isBrowser';

const SCROLL_DIFF_THRESHOLD = 20;

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const SearchBarMobile = ({ onChange, onSubmit }: Props) => {

  const prevScrollPosition = React.useRef(isBrowser() ? window.pageYOffset : 0);
  const [ isVisible, setVisibility ] = React.useState(true);

  const searchIconColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
  const inputBorderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.200');
  const bgColor = useColorModeValue('white', 'black');

  const handleScroll = React.useCallback(() => {
    const currentScrollPosition = clamp(window.pageYOffset, 0, window.document.body.scrollHeight - window.innerHeight);
    const scrollDiff = currentScrollPosition - prevScrollPosition.current;

    if (Math.abs(scrollDiff) > SCROLL_DIFF_THRESHOLD) {
      setVisibility(scrollDiff > 0 ? false : true);
    }

    prevScrollPosition.current = currentScrollPosition;
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
