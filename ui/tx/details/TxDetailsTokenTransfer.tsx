import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer, Erc20TotalPayload, Erc721TotalPayload, Erc1155TotalPayload } from 'types/api/tokenTransfer';

import getCurrencyValue from 'lib/getCurrencyValue';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import NftTokenTransferSnippet from 'ui/tx/NftTokenTransferSnippet';

interface Props {
  data: TTokenTransfer;
}

const TxDetailsTokenTransfer = ({ data }: Props) => {

  const content = (() => {
    switch (data.token.type) {
      case 'ERC-20': {
        const total = data.total as Erc20TotalPayload;
        const { valueStr, usd } = getCurrencyValue({
          value: total.value,
          exchangeRate: data.token.exchange_rate,
          accuracyUsd: 2,
          decimals: total.decimals,
        });

        return (
          <>
            <chakra.span color="text_secondary">for</chakra.span>
            <span>{ valueStr }</span>
            <TokenEntity
              token={{ ...data.token, name: data.token.symbol || data.token.name }}
              noCopy
              noSymbol
              w="auto"
            />
            { usd && <chakra.span color="text_secondary">(${ usd })</chakra.span> }
          </>
        );
      }

      case 'ERC-721': {
        const total = data.total as Erc721TotalPayload;
        return (
          <NftTokenTransferSnippet
            token={ data.token }
            tokenId={ total.token_id }
            value="1"
          />
        );
      }

      case 'ERC-1155': {
        const total = data.total as Erc1155TotalPayload;
        return (
          <NftTokenTransferSnippet
            key={ total.token_id }
            token={ data.token }
            tokenId={ total.token_id }
            value={ total.value }
          />
        );
      }
    }
  })();

  return (
    <Flex
      alignItems="flex-start"
      flexWrap="wrap"
      columnGap={ 2 }
      rowGap={ 3 }
      flexDir="row"
      w="100%"
      fontWeight={ 500 }
    >
      <AddressFromTo
        from={ data.from }
        to={ data.to }
        truncation="constant"
        noIcon
        fontWeight="500"
      />
      { content }
    </Flex>
  );
};

export default React.memo(TxDetailsTokenTransfer);
