// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { useMultichainContext } from 'src/features/multichain/context';
import { TX_INTERPRETATION } from 'src/features/tx-interpretation/blockscout/stubs';
import TxInterpretation from 'src/features/tx-interpretation/common/components/TxInterpretation';
import UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';

import config from 'src/config';
import { TX_ACTIONS_BLOCK_ID } from 'src/shared/detailed-info/DetailedInfoActionsWrapper';

import { Link } from 'src/toolkit/chakra/link';

type Props = {
  hash: string;
};

const UserOpSubHeading = ({ hash }: Props) => {
  const multichainContext = useMultichainContext();

  const hasInterpretationFeature = config.features.txInterpretation.isEnabled;

  const txInterpretationQuery = useApiQuery('general:user_op_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && hasInterpretationFeature,
      placeholderData: TX_INTERPRETATION,
    },
  });

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
          chainData={ multichainContext?.chain }
        />
        { hasViewAllInterpretationsLink &&
          <Link href={ `#${ TX_ACTIONS_BLOCK_ID }` }>View all</Link> }
      </Flex>
    );
    // fallback will be added later

    // } else if (hasInterpretationFeature && userOpQuery.data?.decoded_call_data.method_call && userOpQuery.data?.sender && userOpQuery.data?.to) {
    //   return (
    //     <TxInterpretation
    //       summary={{
    //         summary_template: `{sender_hash} called {method} on {receiver_hash}`,
    //         summary_template_variables: {
    //           sender_hash: {
    //             type: 'address',
    //             value: txQuery.data.from,
    //           },
    //           method: {
    //             type: 'method',
    //             value: txQuery.data.method,
    //           },
    //           receiver_hash: {
    //             type: 'address',
    //             value: txQuery.data.to,
    //           },
    //         },
    //       }}
    //       isLoading={ txQuery.isPlaceholderData }
    //       fontSize="lg"
    //     />
    //   );
  } else {
    return <UserOpEntity hash={ hash } noLink variant="subheading" chain={ multichainContext?.chain }/>;
  }
};

export default UserOpSubHeading;
