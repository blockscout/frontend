import { Box, Skeleton, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { FC } from 'react';
import React from 'react';

import type { NovesResponseData } from 'types/novesApi';

import lightning from 'icons/lightning.svg';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import Icon from 'ui/shared/chakra/Icon';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import NovesTokenTransferSnippet from 'ui/tx/Noves/components/NovesTokenTransferSnippet';
import type { NovesTranslateError } from 'ui/tx/Noves/NovesUseFetchTranslate';
import { NovesGetSplittedDescription } from 'ui/tx/Noves/utils/NovesGetSplittedDescription';

interface Props {
  fetchTranslate: UseQueryResult<NovesResponseData, NovesTranslateError>;
  hash: string;
  txTag: string | null | undefined;
}

const NovesTxTitleSecondRow: FC<Props> = ({ fetchTranslate, hash, txTag }) => {

  const { data, isError, isPlaceholderData } = fetchTranslate;

  if (isPlaceholderData || isError || !data?.classificationData.description) {
    return (
      <Skeleton isLoaded={ !isPlaceholderData } >
        <TxEntity hash={ hash } noLink noCopy={ false } fontWeight={ 500 } mr={ 2 } fontFamily="heading"/>
        { txTag && <AccountActionsMenu mr={{ base: 0, lg: 3 }}/> }
        <NetworkExplorers type="tx" pathParam={ hash } ml={{ base: 3, lg: 'auto' }}/>
      </Skeleton>
    );
  }

  const description = NovesGetSplittedDescription(data);

  return (
    <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
      <Box display="flex" gap={ 2 } alignItems="center" flexWrap="wrap">
        { description.map((item, i) => (
          <>
            <Text fontWeight="500" fontSize="lg" display="inline-flex" alignItems="center" gap={ 2 } wordBreak="break-word">
              { i === 0 && (
                <Icon
                  as={ lightning }
                  display="flex"
                  fontSize="xl"
                  color="gray.500"
                  _dark={{ color: 'gray.400' }}
                />
              ) }
              { item.text }
            </Text>
            { item.hasId && item.token ? (
              <NovesTokenTransferSnippet
                token={ item.token }
                tokenId={ item.token?.id || '' }
              />
            ) :
              item.token && (
                <TokenEntity
                  token={ item.token }
                  noCopy
                  noSymbol
                  fontWeight="500"
                  fontSize="lg"
                  w="fit-content"
                />
              ) }
          </>
        )) }
      </Box>
    </Skeleton>
  );
};

export default NovesTxTitleSecondRow;
