// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { TX_INTERPRETATION } from 'src/features/tx-interpretation/blockscout/stubs';
import TxInterpretation from 'src/features/tx-interpretation/common/components/TxInterpretation';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoActionsWrapper from 'src/shared/detailed-info/DetailedInfoActionsWrapper';

interface Props {
  hash?: string;
  isUserOpDataLoading: boolean;
}

const UserOpDetailsActions = ({ hash, isUserOpDataLoading }: Props) => {
  const interpretationQuery = useApiQuery('general:user_op_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && !isUserOpDataLoading,
      placeholderData: TX_INTERPRETATION,
      refetchOnMount: false,
    },
  });

  const actions = interpretationQuery.data?.data.summaries;

  if (!actions || actions.length < 2) {
    return null;
  }

  return (
    <>
      <DetailedInfoActionsWrapper isLoading={ isUserOpDataLoading || interpretationQuery.isPlaceholderData } type="user_op">
        { actions.map((action, index: number) => (
          <TxInterpretation
            key={ index }
            summary={ action }
            isLoading={ isUserOpDataLoading || interpretationQuery.isPlaceholderData }
            fontWeight="normal"
          />
        ),
        ) }
      </DetailedInfoActionsWrapper>
      <DetailedInfo.ItemDivider/>
    </>
  );
};

export default UserOpDetailsActions;
