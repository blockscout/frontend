import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

import { WalletButton } from './WalletButton';

interface Props<T extends NonNullable<unknown>> {
  searchInput: React.ReactNode;
  isLoading: boolean;
  wallets: Array<T>;
  onSelect: (v: T) => void;
  logo: (w: T) => React.ReactNode;
  title: (w: T) => string;
}

export const WalletsList = <T extends NonNullable<unknown>>(
  {
    searchInput,
    isLoading,
    wallets,
    onSelect,
    logo,
    title,
  }: Props<T>,
) => (
  <>
    { searchInput }

    <Flex
      flexWrap="wrap"
      marginTop="8px"
      maxHeight="260px"
      minHeight="160px"
      overflowY="auto"
      paddingTop="8px"
      alignItems="center"
      flexDirection="row"
      justifyContent="space-evenly"
      width="100%"
    >
      { isLoading ? (
        <Spinner/>
      ) : (
        wallets
          .map((w, idx) => {
            return (
              <WalletButton
                key={ idx }
                onSelectWallet={ onSelect }
                wallet={ w }
                logo={ logo(w) }
                title={ title(w) }
              />
            );
          })
      ) }
    </Flex>
  </>
);
