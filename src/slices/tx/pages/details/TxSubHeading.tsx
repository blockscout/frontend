// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'src/slices/address/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ActionsMenu from 'src/shell/page/actions-menu/ActionsMenu';

import TxEntity from 'src/slices/tx/components/entity/TxEntity';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import AppActionButton from 'src/features/address-metadata/components/AppActionButton';
import useAppActionData from 'src/features/address-metadata/hooks/useAppActionData';
import AlternativeExplorers from 'src/features/alternative-explorers/components/AlternativeExplorers';
import { useMultichainContext } from 'src/features/multichain/context';
import { TX_INTERPRETATION } from 'src/features/tx-interpretation/blockscout/stubs';
import TxInterpretation from 'src/features/tx-interpretation/common/components/TxInterpretation';
import { NOVES_TRANSLATE } from 'src/features/tx-interpretation/noves/stubs';
import { createNovesSummaryObject } from 'src/features/tx-interpretation/noves/utils/createNovesSummaryObject';

import config from 'src/config';
import { TX_ACTIONS_BLOCK_ID } from 'src/shared/detailed-info/DetailedInfoActionsWrapper';

import { Link } from 'src/toolkit/chakra/link';

type Props = {
  hash: string;
  hasTag: boolean;
  txQuery: TxQuery;
};

const TxSubHeading = ({ hash, hasTag, txQuery }: Props) => {
  const multichainContext = useMultichainContext();
  const feature = multichainContext?.chain?.app_config.features.txInterpretation || config.features.txInterpretation;

  const hasInterpretationFeature = feature.isEnabled;
  const isNovesInterpretation = hasInterpretationFeature && feature.provider === 'noves';

  const appActionData = useAppActionData(txQuery.data?.to?.hash, !txQuery.isPlaceholderData);

  const txInterpretationQuery = useApiQuery('general:tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && (hasInterpretationFeature && !isNovesInterpretation),
      placeholderData: TX_INTERPRETATION,
    },
  });

  const novesInterpretationQuery = useApiQuery('general:noves_transaction', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && isNovesInterpretation,
      placeholderData: NOVES_TRANSLATE,
    },
  });

  const hasNovesInterpretation = isNovesInterpretation &&
    (novesInterpretationQuery.isPlaceholderData || Boolean(novesInterpretationQuery.data?.classificationData.description));

  const hasInternalInterpretation = (hasInterpretationFeature && !isNovesInterpretation) &&
  (txInterpretationQuery.isPlaceholderData || Boolean(txInterpretationQuery.data?.data.summaries.length));

  const hasViewAllInterpretationsLink =
    !txInterpretationQuery.isPlaceholderData && txInterpretationQuery.data?.data.summaries && txInterpretationQuery.data?.data.summaries.length > 1;

  const addressDataMap: Record<string, AddressParam> = {};
  [ txQuery.data?.from, txQuery.data?.to ]
    .filter((data): data is AddressParam => Boolean(data && data.hash))
    .forEach(data => {
      addressDataMap[data.hash] = data;
    });

  const content = (() => {
    if (hasNovesInterpretation && novesInterpretationQuery.data) {
      const novesSummary = createNovesSummaryObject(novesInterpretationQuery.data);
      return (
        <TxInterpretation
          summary={ novesSummary }
          isLoading={ novesInterpretationQuery.isPlaceholderData || txQuery.isPlaceholderData }
          addressDataMap={ addressDataMap }
          fontSize="lg"
          mr={{ base: 0, lg: 2 }}
          isNoves
          chainData={ multichainContext?.chain }
        />
      );
    } else if (hasInternalInterpretation) {
      return (
        <Flex mr={{ base: 0, lg: 2 }} flexWrap="wrap" alignItems="center">
          <TxInterpretation
            summary={ txInterpretationQuery.data?.data.summaries[0] }
            isLoading={ txInterpretationQuery.isPlaceholderData || txQuery.isPlaceholderData }
            addressDataMap={ addressDataMap }
            fontSize="lg"
            mr={ hasViewAllInterpretationsLink ? 3 : 0 }
            chainData={ multichainContext?.chain }
          />
          { hasViewAllInterpretationsLink &&
          <Link href={ `#${ TX_ACTIONS_BLOCK_ID }` }>View all</Link> }
        </Flex>
      );
    } else if (hasInterpretationFeature && txQuery.data?.method && txQuery.data?.from && txQuery.data?.to && !txQuery.isPlaceholderData) {
      return (
        <TxInterpretation
          summary={{
            summary_template: `{sender_hash} ${ txQuery.data.status === 'error' ? 'failed to call' : 'called' } {method} on {receiver_hash}`,
            summary_template_variables: {
              sender_hash: {
                type: 'address',
                value: txQuery.data.from,
              },
              method: {
                type: 'method',
                value: txQuery.data.method,
              },
              receiver_hash: {
                type: 'address',
                value: txQuery.data.to,
              },
            },
          }}
          fontSize="lg"
          mr={{ base: 0, lg: 2 }}
          chainData={ multichainContext?.chain }
        />
      );
    } else {
      return <TxEntity hash={ hash } noLink variant="subheading" mr={{ base: 0, lg: 2 }} chain={ multichainContext?.chain }/>;
    }
  })();

  const isLoading =
    txQuery.isPlaceholderData ||
    (hasNovesInterpretation && novesInterpretationQuery.isPlaceholderData) ||
    (hasInternalInterpretation && txInterpretationQuery.isPlaceholderData);

  return (
    <Box display={{ base: 'block', lg: 'flex' }} alignItems="center" w="100%">
      { content }
      <Flex
        alignItems="center"
        justifyContent={{ base: 'start', lg: 'space-between' }}
        flexGrow={ 1 }
        gap={ 3 }
        mt={{ base: 3, lg: 0 }}
      >
        { !hasTag && <ActionsMenu isLoading={ isLoading }/> }
        { appActionData && (
          <AppActionButton data={ appActionData } txHash={ hash } source="Txn"/>
        ) }
        <AlternativeExplorers type="tx" pathParam={ hash } ml="auto"/>
      </Flex>
    </Box>
  );
};

export default TxSubHeading;
