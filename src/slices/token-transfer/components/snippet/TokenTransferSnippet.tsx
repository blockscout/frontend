// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { isConfidentialTokenType, isFungibleTokenType } from 'src/slices/token/utils/token-types';

import AddressFromTo from 'src/slices/address/components/from-to/AddressFromTo';
import { getTokenTransferUiMultiplier } from 'src/slices/token-transfer/utils/get-token-transfer-ui-multiplier';

import { useMultichainContext } from 'src/features/multichain/context';

import ConfidentialTokenValue from 'src/shared/values/entity/ConfidentialTokenValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TokenTransferSnippetFiat from './TokenTransferSnippetFiat';
import TokenTransferSnippetNft from './TokenTransferSnippetNft';

interface Props {
  data: schemas['TokenTransfer'];
  noAddressIcons?: boolean;
  isLoading?: boolean;
}

const renderNftTransfer = (token: schemas['Token'], total: schemas['TokenTransfer']['total']) => {
  switch (token.type) {
    case 'ERC-721': {
      if (total && 'token_id' in total && 'token_instance' in total) {
        return (
          <TokenTransferSnippetNft
            token={ token }
            tokenId={ total.token_id }
            instance={ total.token_instance }
            value="1"
          />
        );
      }
      return null;
    }

    case 'ERC-1155': {
      if (total && 'token_id' in total && 'token_instance' in total && 'value' in total) {
        return (
          <TokenTransferSnippetNft
            token={ token }
            tokenId={ total.token_id }
            instance={ total.token_instance }
            value={ total.value || '1' }
          />
        );
      }
      return null;
    }

    case 'ERC-404': {
      if (total === null) {
        return null;
      }

      if ('token_id' in total && total.token_id !== null) {
        return (
          <TokenTransferSnippetNft
            token={ token }
            tokenId={ total.token_id }
            value="1"
          />
        );
      }

      if ('value' in total && total.value) {
        return <TokenTransferSnippetFiat token={ token } value={ total.value } decimals={ total.decimals }/>;
      }
      return null;
    }

    default: {
      return null;
    }
  }
};

const TokenTransferSnippet = ({ data, isLoading, noAddressIcons = true }: Props) => {
  const chainConfig = useMultichainContext()?.chain.app_config;

  const content = (() => {
    if (isLoading) {
      return <Skeleton loading w="250px" h={ 6 }/>;
    }

    if (!data.token) {
      return null;
    }

    if (isConfidentialTokenType(data.token.type)) {
      return <ConfidentialTokenValue token={ data.token } loading={ false }/>;
    }

    if (isFungibleTokenType(data.token.type, chainConfig)) {
      const total = data.total as schemas['TokenTransferTotalFungible'] | null;
      if (total === null || total.value === null) {
        return null;
      }
      return (
        <TokenTransferSnippetFiat
          token={ data.token }
          value={ total.value }
          decimals={ total.decimals }
          multiplier={ getTokenTransferUiMultiplier(data, chainConfig) }
        />
      );
    }

    return renderNftTransfer(data.token, data.total);
  })();

  const { tokenHash, tokenSymbol } = (() => {
    if (data.token) {
      return {
        tokenHash: data.token.address_hash,
        tokenSymbol: data.token.symbol ?? undefined,
      };
    }
    return {
      tokenHash: undefined,
      tokenSymbol: undefined,
    };
  })();

  return (
    <Flex
      alignItems="center"
      flexWrap="wrap"
      columnGap={ 2 }
      rowGap={ 0 }
      flexDir="row"
      w="100%"
    >
      <AddressFromTo
        from={ data.from }
        to={ data.to }
        tokenHash={ tokenHash }
        tokenSymbol={ tokenSymbol }
        truncation="constant"
        noIcon={ noAddressIcons }
        isLoading={ isLoading }
        lineHeight={{ lg: '24px' }}
      />
      { content }
    </Flex>
  );
};

export default React.memo(TokenTransferSnippet);
