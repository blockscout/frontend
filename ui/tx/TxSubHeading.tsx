import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { NOVES_TRANSLATE } from 'stubs/noves/NovesTranslate';
import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import { TX_ACTIONS_BLOCK_ID } from 'ui/tx/details/txDetailsActions/TxDetailsActionsWrapper';
import TxInterpretation from 'ui/tx/interpretation/TxInterpretation';

import NovesSubHeadingInterpretation from './assetFlows/components/NovesSubHeadingInterpretation';

type Props = {
  hash?: string;
  hasTag: boolean;
}

const feature = config.features.txInterpretation;

const TxSubHeading = ({ hash, hasTag }: Props) => {
  const hasInterpretationFeature = feature.isEnabled;
  const isNovesInterpretation = hasInterpretationFeature && feature.provider === 'noves';

  const txInterpretationQuery = useApiQuery('tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && (hasInterpretationFeature && !isNovesInterpretation),
      placeholderData: TX_INTERPRETATION,
    },
  });

  const novesInterpretationQuery = useApiQuery('noves_transaction', {
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

  const hasInterpretation = hasNovesInterpretation || hasInternalInterpretation;

  return (
    <Box display={{ base: 'block', lg: 'flex' }} alignItems="center" w="100%">
      { hasInterpretation && hasNovesInterpretation ?
        (
          <NovesSubHeadingInterpretation
            data={ novesInterpretationQuery.data }
            isLoading={ novesInterpretationQuery.isPlaceholderData }
          />
        ) :
        (
          <Flex mr={{ base: 0, lg: 6 }} flexWrap="wrap" alignItems="center">
            <TxInterpretation
              summary={ txInterpretationQuery.data?.data.summaries[0] }
              isLoading={ txInterpretationQuery.isPlaceholderData }
              fontSize="lg"
            />
            { !txInterpretationQuery.isPlaceholderData && txInterpretationQuery.data?.data.summaries && txInterpretationQuery.data?.data.summaries.length > 1 &&
            <Link ml={ 3 } href={ `#${ TX_ACTIONS_BLOCK_ID }` }>all actions</Link> }
          </Flex>
        )
      }
      { !hasInterpretation && <TxEntity hash={ hash } noLink noCopy={ false } fontWeight={ 500 } mr={{ base: 0, lg: 2 }} fontFamily="heading"/> }
      <Flex alignItems="center" justifyContent={{ base: 'start', lg: 'space-between' }} flexGrow={ 1 }>
        { !hasTag && <AccountActionsMenu mr={ 3 } mt={{ base: 3, lg: 0 }}/> }
        <NetworkExplorers type="tx" pathParam={ hash } ml={{ base: 0, lg: 'auto' }} mt={{ base: 3, lg: 0 }}/>
      </Flex>
    </Box>
  );
};

export default TxSubHeading;
