import type { ChangeEvent, FormEvent } from 'react';
import React from 'react';

import useBasePath from 'lib/hooks/useBasePath';
import useIsMobile from 'lib/hooks/useIsMobile';

import SearchBarDesktop from './SearchBarDesktop';
import SearchBarMobile from './SearchBarMobile';

const SearchBar = () => {
  const [ value, setValue ] = React.useState('');
  const basePath = useBasePath();
  const isMobile = useIsMobile();

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.assign(`https://blockscout.com${ basePath }/search-results?q=${ value }`);
  }, [ value, basePath ]);

  if (isMobile) {
    return (
      <SearchBarMobile onChange={ handleChange } onSubmit={ handleSubmit }/>
    );
  }

  return (
    <SearchBarDesktop onChange={ handleChange } onSubmit={ handleSubmit }/>
  );
};

export default SearchBar;
