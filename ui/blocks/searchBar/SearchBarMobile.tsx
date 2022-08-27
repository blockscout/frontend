import { SearchIcon } from '@chakra-ui/icons';
import { InputGroup, Input, InputLeftElement, useColorModeValue } from '@chakra-ui/react';
import throttle from 'lodash/throttle';
import React from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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

  const handleScroll = React.useCallback(() => {
    const currentScrollPosition = window.pageYOffset;
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

  if (!isVisible) {
    return null;
  }

  return (
    <form noValidate onSubmit={ onSubmit }>
      <InputGroup size="sm">
        <InputLeftElement >
          <SearchIcon w={ 4 } h={ 4 } color={ searchIconColor }/>
        </InputLeftElement>
        <Input
          paddingInlineStart="38px"
          placeholder="Search by addresses / ... "
          ml="1px"
          onChange={ onChange }
          borderColor={ inputBorderColor }
        />
      </InputGroup>
    </form>
  );
};

export default React.memo(SearchBarMobile);
