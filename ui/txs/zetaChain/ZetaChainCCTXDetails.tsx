import { Box, Flex, Grid, VStack } from '@chakra-ui/react';
import React from 'react';

import type { ZetaChainCCTXResponse } from 'types/api/zetaChain';

import useApiQuery from 'lib/api/useApiQuery';
// import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import { currencyUnits } from 'lib/units';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { CollapsibleDetails } from 'toolkit/chakra/collapsible';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CurrencyValue from 'ui/shared/CurrencyValue';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import ZetaChainAddressEntity from 'ui/shared/zetaChain/ZetaChainAddressEntity';
import ZetaChainCCTXReducedStatus from 'ui/shared/zetaChain/ZetaChainCCTXReducedStatus';
import ZetaChainCCTXStatusTag from 'ui/shared/zetaChain/ZetaChainCCTXStatusTag';
import ZetaChainCCTXValue from 'ui/shared/zetaChain/ZetaChainCCTXValue';

import ZetaChainCCTXDetailsLifecycleIn from './ZetaChainCCTXDetailsLifecycleIn';
import ZetaChainCCTXDetailsLifecycleOut from './ZetaChainCCTXDetailsLifecycleOut';
import ZetaChainCCTXDetailsRelatedTx from './ZetaChainCCTXDetailsRelatedTx';

type Props = {
  data?: ZetaChainCCTXResponse;
  isLoading: boolean;
};

const ZetaChainCCTXDetails = ({ data, isLoading }: Props) => {
  const statsQuery = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
    },
  });

  if (!data) {
    return null;
  }

  // Separate related transactions into before and after current
  const currentIndex = data.index;
  const relatedTransactions = data?.related_cctxs || [];

  // Find the index of current transaction in the related_cctxs array
  const currentTransactionIndex = relatedTransactions.findIndex(tx => tx.index === currentIndex);

  const transactionsBefore = currentTransactionIndex > 0 ? relatedTransactions.slice(0, currentTransactionIndex) : [];
  const transactionsAfter = currentTransactionIndex >= 0 && currentTransactionIndex < relatedTransactions.length - 1 ?
    relatedTransactions.slice(currentTransactionIndex + 1) :
    [];

  return (
    // <AddressHighlightProvider>
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>
      <DetailedInfo.ItemLabel isLoading={ isLoading }>
        Sender
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ZetaChainAddressEntity
          hash={ data.inbound_params.sender }
          chainId={ data.inbound_params.sender_chain_id.toString() }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel isLoading={ isLoading }>
        Receiver
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ZetaChainAddressEntity
          key={ data.outbound_params[0].receiver }
          hash={ data.outbound_params[0].receiver }
          chainId={ data.outbound_params[0].receiver_chain_id.toString() }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel isLoading={ isLoading }>
        Asset transferred
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ZetaChainCCTXValue
          coinType={ data.inbound_params.coin_type }
          tokenSymbol={ data.token_symbol }
          amount={ data.inbound_params.amount }
          decimals={ data.decimals?.toString() ?? null }
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel isLoading={ isLoading }>
        Cross-chain fee
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <CurrencyValue
          value={ data.zeta_fees }
          currency={ currencyUnits.ether }
          exchangeRate={ statsQuery.data?.coin_price }
          accuracy={ 4 }
          accuracyUsd={ 2 }
          flexWrap="wrap"
          isLoading={ isLoading }
        />
      </DetailedInfo.ItemValue>
      { data.relayed_message && (
        <>
          <DetailedInfo.ItemLabel isLoading={ isLoading }>
            Message
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <RawDataSnippet
              data={ data.relayed_message }
              textareaMaxHeight="100px"
              w="100%"
              isLoading={ isLoading }
              showCopy={ false }
            />
          </DetailedInfo.ItemValue>
        </>
      ) }
      <DetailedInfo.ItemLabel isLoading={ isLoading }>
        CCTX hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isLoading } display="flex" flexWrap="nowrap" alignItems="center" overflow="hidden">
          <Box overflow="hidden">
            <HashStringShortenDynamic hash={ data.index }/>
          </Box>
          <CopyToClipboard text={ data.index } isLoading={ isLoading }/>
        </Skeleton>
      </DetailedInfo.ItemValue>
      <DetailedInfo.ItemLabel isLoading={ isLoading }>Status and state</DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Flex alignItems="center" gap={ 2 }>
          <ZetaChainCCTXReducedStatus status={ data.cctx_status_reduced } isLoading={ isLoading } type="full"/>
          <ZetaChainCCTXStatusTag status={ data.cctx_status.status } isLoading={ isLoading }/>
        </Flex>
        { data.cctx_status.status_message && (
          <CollapsibleDetails variant="secondary" ml={ 2 }>
            <RawDataSnippet data={ data.cctx_status.status_message }/>
          </CollapsibleDetails>
        ) }
      </DetailedInfo.ItemValue>
      { Boolean(Number(data.cctx_status.created_timestamp)) && (
        <>
          <DetailedInfo.ItemLabel isLoading={ isLoading }>
            Created
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ Number(data.cctx_status.created_timestamp) * 1000 } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { Boolean(Number(data.cctx_status.last_update_timestamp)) && (
        <>
          <DetailedInfo.ItemLabel isLoading={ isLoading }>
            Last updated
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ Number(data.cctx_status.last_update_timestamp) * 1000 } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { (data?.related_cctxs && data?.related_cctxs.length > 0) && (
        <>
          <DetailedInfo.ItemLabel isLoading={ isLoading }>Lifecycle</DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue position="relative">
            <Box position="absolute" top="4px" left="9px" width="2px" height="100%" bg="border.divider"/>
            <Grid templateColumns="20px 1fr" rowGap={ 6 } columnGap={ 2 } w="100%">
              { transactionsBefore.length > 0 && (
                <>
                  <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg="global.body.bg" zIndex={ 1 } color="text.secondary"/>
                  <VStack gap={ 2 } alignItems="flex-start">
                    { transactionsBefore.map((tx) => (
                      <ZetaChainCCTXDetailsRelatedTx
                        key={ tx.index }
                        tx={ tx }
                        isLoading={ isLoading }
                      />
                    )) }
                  </VStack>
                </>
              ) }
              { /* Current Transaction */ }
              <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg="global.body.bg" zIndex={ 1 } color="text.secondary"/>
              <ZetaChainCCTXDetailsLifecycleIn
                key={ data.index }
                tx={ data }
                isLoading={ isLoading }
              />
              { data.outbound_params.map((param, index) => (
                <>
                  <Flex
                    h="100%"
                    w="100%"
                    bg={ index === data.outbound_params.length - 1 && !transactionsAfter.length ? 'global.body.bg' : 'transparent' }
                    zIndex={ 1 }
                  >
                    <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg="global.body.bg" zIndex={ 1 } color="text.secondary"/>
                  </Flex>
                  <ZetaChainCCTXDetailsLifecycleOut
                    outboundParam={ param }
                    tx={ data }
                    isLoading={ isLoading }
                    isLast={ index === data.outbound_params.length - 1 }
                  />
                </>
              )) }
              { /* Transactions After Current */ }
              { transactionsAfter.length > 0 && (
                <>
                  <Flex
                    h="100%"
                    w="100%"
                    bg="global.body.bg"
                    zIndex={ 1 }
                  >
                    <IconSvg name="verification-steps/finalized" boxSize={ 5 } bg="global.body.bg" zIndex={ 1 } color="text.secondary"/>
                  </Flex>
                  <VStack gap={ 2 } alignItems="flex-start">
                    { transactionsAfter.map((tx) => (
                      <ZetaChainCCTXDetailsRelatedTx
                        key={ tx.index }
                        tx={ tx }
                        isLoading={ isLoading }
                      />
                    )) }
                  </VStack>
                </>
              ) }
            </Grid>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </DetailedInfo.Container>
    // </AddressHighlightProvider>
  );
};

export default ZetaChainCCTXDetails;
