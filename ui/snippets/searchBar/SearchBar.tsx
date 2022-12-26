import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import type { FormEvent, FocusEvent } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';

import SearchBarInput from './SearchBarInput';
import SearchBarSuggest from './SearchBarSuggest';
import useSearchQuery from './useSearchQuery';

type Props = {
  withShadow?: boolean;
  isHomepage?: boolean;
}

const data = [
  {
    address: '0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
    address_url: '/address/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
    name: 'Toms NFT',
    symbol: 'TNT',
    token_url: '/token/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
    type: 'token' as const,
  },
  {
    address: '0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    address_url: '/address/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    name: 'TomToken',
    symbol: 'pdE1B',
    token_url: '/token/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    type: 'token' as const,
  },
  {
    address: '0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    address_url: '/address/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    name: 'TomToken',
    symbol: 'pdE1B',
    token_url: '/token/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
    type: 'token' as const,
  },
  {
    block_hash: '0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
    block_number: 8198536,
    type: 'block' as const,
    url: '/block/0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
  },
  {
    address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
    name: null,
    type: 'address' as const,
    url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
  },
  {
    tx_hash: '0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
    type: 'transaction' as const,
    url: '/tx/0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
  },
];

const SearchBar = ({ isHomepage, withShadow }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuWidth = React.useRef<number>(0);
  const isMobile = useIsMobile();

  const { searchTerm, handleSearchTermChange } = useSearchQuery();

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = link('search_results', undefined, { q: searchTerm });
    window.location.assign(url);
  }, [ searchTerm ]);

  const handleFocus = React.useCallback(() => {
    onOpen();
  }, [ onOpen ]);

  const handleBlur = React.useCallback((event: FocusEvent<HTMLFormElement>) => {
    const isFocusInMenu = menuRef.current?.contains(event.relatedTarget);
    if (!isFocusInMenu) {
      onClose();
    }
  }, [ onClose ]);

  const menuPaddingX = isMobile && !isHomepage ? 32 : 0;
  const calculateMenuWidth = React.useCallback(() => {
    menuWidth.current = (inputRef.current?.getBoundingClientRect().width || 0) - menuPaddingX;
  }, [ menuPaddingX ]);

  React.useEffect(() => {
    calculateMenuWidth();
    window.addEventListener('resize', calculateMenuWidth);
    return function cleanup() {
      window.removeEventListener('resize', calculateMenuWidth);
    };
  }, [ calculateMenuWidth ]);

  return (
    <Popover
      isOpen={ isOpen }
      autoFocus={ false }
      onClose={ onClose }
      placement="bottom-start"
      offset={ isMobile && !isHomepage ? [ 16, -12 ] : undefined }
    >
      <PopoverTrigger>
        <SearchBarInput
          ref={ inputRef }
          onChange={ handleSearchTermChange }
          onSubmit={ handleSubmit }
          onFocus={ handleFocus }
          onBlur={ handleBlur }
          isHomepage={ isHomepage }
          withShadow={ withShadow }
        />
      </PopoverTrigger>
      <PopoverContent w={ `${ menuWidth.current }px` } maxH={{ base: '300px', lg: '500px' }} overflowY="scroll" ref={ menuRef }>
        <PopoverBody display="flex" flexDirection="column" rowGap="6">
          <SearchBarSuggest data={{ items: data, next_page_params: null }}/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
