// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TxStatus from 'src/slices/tx/components/TxStatus';
import getRevertReasonText from 'src/slices/tx/utils/get-revert-reason-text';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import { Badge } from 'src/toolkit/chakra/badge';
import { CollapsibleDetails } from 'src/toolkit/chakra/collapsible';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

import TxRevertReason from './TxRevertReason';

const rollupFeature = config.features.rollup;
const REVERT_REASON_TRIGGER_TEXT: [string, string] = [ 'Show revert reason', 'Hide revert reason' ];

interface Props {
  data: schemas['TransactionResponse'];
  isLoading: boolean;
  onShowDetailsClick?: () => void;
}

const TxDetailsStatus = ({ data, isLoading, onShowDetailsClick }: Props) => {

  const errorText = (() => {
    if (data.status !== 'error') {
      return;
    }

    const revertReasonText = getRevertReasonText(data.revert_reason);
    return revertReasonText || data.result;
  })();

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Current transaction state: Success, Failed (Error), or Pending (In Process)"
        isLoading={ isLoading }
      >
        {
          rollupFeature.isEnabled &&
          (rollupFeature.type === 'zkSync' || rollupFeature.type === 'arbitrum' || rollupFeature.type === 'scroll') ?
            `${ layerLabels.current } status and method` :
            'Status and method'
        }
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexWrap="wrap" columnGap={ 3 } rowGap={ 1 }>
        <TxStatus status={ data.status } errorText={ errorText } isLoading={ isLoading } my={{ base: '3px', lg: 1 }}/>
        { data.method && (
          <Badge colorPalette={ data.method === 'Multicall' ? 'teal' : 'gray' } loading={ isLoading } truncated>
            { data.method }
          </Badge>
        ) }
        { data.arbitrum?.contains_message && (
          <Skeleton loading={ isLoading } onClick={ onShowDetailsClick }>
            <Link truncate>
              View details
            </Link>
          </Skeleton>
        ) }
        { data.revert_reason && (
          <CollapsibleDetails text={ REVERT_REASON_TRIGGER_TEXT } variant="secondary" noScroll id="CollapsibleDetails__revert-reason">
            <TxRevertReason { ...data.revert_reason }/>
          </CollapsibleDetails>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsStatus);
