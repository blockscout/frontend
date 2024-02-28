import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import { TX_ACTIONS_BLOCK_ID } from 'ui/tx/details/txDetailsActions/TxDetailsActionsWrapper';
import TxInterpretation from 'ui/tx/interpretation/TxInterpretation';

import type { TxQuery } from './useTxQuery';

type Props = {
  hash?: string;
  hasTag: boolean;
  txQuery: TxQuery;
}

const TxSubHeading = ({ hash, hasTag, txQuery }: Props) => {
  const hasInterpretationFeature = config.features.txInterpretation.isEnabled;

  const txInterpretationQuery = useApiQuery('tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && hasInterpretationFeature,
      placeholderData: TX_INTERPRETATION,
    },
  });

  const content = (() => {
    const hasInterpretation = hasInterpretationFeature &&
    (txInterpretationQuery.isPlaceholderData || Boolean(txInterpretationQuery.data?.data.summaries.length));

    const hasViewAllInterpretationsLink =
      !txInterpretationQuery.isPlaceholderData && txInterpretationQuery.data?.data.summaries && txInterpretationQuery.data?.data.summaries.length > 1;

    if (hasInterpretation) {
      return (
        <Flex mr={{ base: 0, lg: 6 }} flexWrap="wrap" alignItems="center">
          <TxInterpretation
            summary={ txInterpretationQuery.data?.data.summaries[0] }
            isLoading={ txInterpretationQuery.isPlaceholderData }
            fontSize="lg"
            mr={ hasViewAllInterpretationsLink ? 3 : 0 }
          />
          { hasViewAllInterpretationsLink &&
          <Link href={ `#${ TX_ACTIONS_BLOCK_ID }` }>View all</Link> }
        </Flex>
      );
    } else if (hasInterpretationFeature && txQuery.data?.method && txQuery.data?.from && txQuery.data?.to) {
      return (
        <TxInterpretation
          summary={{
            summary_template: `{sender_hash} called {method} on {receiver_hash}`,
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
          isLoading={ txQuery.isPlaceholderData }
          fontSize="lg"
        />
      );
    } else {
      return <TxEntity hash={ hash } noLink noCopy={ false } fontWeight={ 500 } mr={{ base: 0, lg: 2 }} fontFamily="heading"/>;
    }
  })();

  return (
    <Box display={{ base: 'block', lg: 'flex' }} alignItems="center" w="100%">
      { content }
      <Flex alignItems="center" justifyContent={{ base: 'start', lg: 'space-between' }} flexGrow={ 1 }>
        { !hasTag && <AccountActionsMenu mr={ 3 } mt={{ base: 3, lg: 0 }}/> }
        <NetworkExplorers type="tx" pathParam={ hash } ml={{ base: 0, lg: 'auto' }} mt={{ base: 3, lg: 0 }}/>
      </Flex>
    </Box>
  );
};

export default TxSubHeading;
