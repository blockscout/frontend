import type { ChangeEvent, FormEvent } from 'react';
import React from 'react';

import link from 'lib/link/link';

import SearchBarDesktop from './SearchBarDesktop';
import SearchBarMobile from './SearchBarMobile';
import SearchBarMobileHome from './SearchBarMobileHome';

type Props = {
  withShadow?: boolean;
  isHomepage?: boolean;
}

const SearchBar = ({ isHomepage, withShadow }: Props) => {
  const [ value, setValue ] = React.useState('');

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = link('search_results', undefined, { q: value });
    window.location.assign(url);
  }, [ value ]);

  return (
    <>
      <SearchBarDesktop onChange={ handleChange } onSubmit={ handleSubmit } isHomepage={ isHomepage }/>
      { !isHomepage && (
        <SearchBarMobile
          onChange={ handleChange }
          onSubmit={ handleSubmit }
          withShadow={ withShadow }
        />
      ) }
      { isHomepage && (
        <SearchBarMobileHome
          onChange={ handleChange }
          onSubmit={ handleSubmit }
        />
      ) }
    </>
  );
};

export default SearchBar;
