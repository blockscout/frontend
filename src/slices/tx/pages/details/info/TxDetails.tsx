// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import LogDecodedInputData from 'src/slices/log/components/LogDecodedInputData';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';

import TxDetailsEden from 'src/features/chain-variants/eden/pages/tx/TxDetailsEden';
import { getBatchRecipients } from 'src/features/chain-variants/eden/utils/batch-recipients';
import TxDetailsSuave from 'src/features/chain-variants/suave/pages/tx/TxDetailsSuave';
import TxDetailsTacOperation from 'src/features/chain-variants/tac/pages/tx/TxDetailsTacOperation';
import TxDetailsCrossChainMessages from 'src/features/cross-chain-txs/pages/tx/TxDetailsCrossChainMessages';
import TxDetailsCrossChainTransfers from 'src/features/cross-chain-txs/pages/tx/TxDetailsCrossChainTransfers';
import TxDetailsInterop from 'src/features/op-interop/pages/tx/TxDetailsInterop';
import TxDetailsInteropTarget from 'src/features/op-interop/pages/tx/TxDetailsInteropTarget';
import TxDetailsArbitrumBatch from 'src/features/rollup/arbitrum/pages/tx/TxDetailsArbitrumBatch';
import TxDetailsArbitrumFees from 'src/features/rollup/arbitrum/pages/tx/TxDetailsArbitrumFees';
import TxDetailsArbitrumGasUsed from 'src/features/rollup/arbitrum/pages/tx/TxDetailsArbitrumGasUsed';
import TxDetailsArbitrumL1Txs from 'src/features/rollup/arbitrum/pages/tx/TxDetailsArbitrumL1Txs';
import TxDetailsArbitrumStatus from 'src/features/rollup/arbitrum/pages/tx/TxDetailsArbitrumStatus';
import TxDetailsWithdrawalStatusArbitrum from 'src/features/rollup/arbitrum/pages/tx/TxDetailsWithdrawalStatusArbitrum';
import TxDetailsOptimismL1Fees from 'src/features/rollup/optimism/pages/tx/TxDetailsOptimismL1Fees';
import TxDetailsOptimismOperatorFee from 'src/features/rollup/optimism/pages/tx/TxDetailsOptimismOperatorFee';
import TxDetailsOptimismWithdrawals from 'src/features/rollup/optimism/pages/tx/TxDetailsOptimismWithdrawals';
import TxDetailsScrollL1GasUsed from 'src/features/rollup/scroll/pages/tx/TxDetailsScrollL1GasUsed';
import TxInfoScrollFees from 'src/features/rollup/scroll/pages/tx/TxInfoScrollFees';
import ZkSyncL2TxnBatchHashesInfo from 'src/features/rollup/zk-sync/pages/batch-details/ZkSyncL2TxnBatchHashesInfo';
import TxDetailsZkSyncBatch from 'src/features/rollup/zk-sync/pages/tx/TxDetailsZkSyncBatch';
import TxDetailsZkSyncStatus from 'src/features/rollup/zk-sync/pages/tx/TxDetailsZkSyncStatus';
import TxDetailsActions from 'src/features/tx-actions/pages/tx/TxDetailsActions';

import config from 'src/config';
import RawInputData from 'src/shared/data/RawInputData';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoSponsoredItem from 'src/shared/detailed-info/DetailedInfoSponsoredItem';

import { CollapsibleDetails } from 'src/toolkit/chakra/collapsible';

import TxDetailsBlobFees from './parts/TxDetailsBlobFees';
import TxDetailsBlock from './parts/TxDetailsBlock';
import TxDetailsBurntFees from './parts/TxDetailsBurntFees';
import TxDetailsFeePerGas from './parts/TxDetailsFeePerGas';
import TxDetailsFrom from './parts/TxDetailsFrom';
import TxDetailsGasFees from './parts/TxDetailsGasFees';
import TxDetailsGasPrice from './parts/TxDetailsGasPrice';
import TxDetailsGasUsage from './parts/TxDetailsGasUsage';
import TxDetailsOther from './parts/TxDetailsOther';
import TxDetailsSetMaxGasLimit from './parts/TxDetailsSetMaxGasLimit';
import TxDetailsStatus from './parts/TxDetailsStatus';
import TxDetailsTimestamp from './parts/TxDetailsTimestamp';
import TxDetailsTo from './parts/TxDetailsTo';
import TxDetailsTokenTransfers from './parts/TxDetailsTokenTransfers';
import TxDetailsTxFee from './parts/TxDetailsTxFee';
import TxDetailsValue from './parts/TxDetailsValue';
import TxHash from './parts/TxHash';

interface Props {
  data: schemas['TransactionResponse'] | undefined;
  isLoading: boolean;
  socketStatus?: 'close' | 'error';
  noTxActions?: boolean;
}

const TxDetails = ({ data, isLoading, socketStatus, noTxActions }: Props) => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const recipients = React.useMemo(() => getBatchRecipients(data?.calls), [ data?.calls ]);

  const handleCutLinkClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  const expandDetailsSection = React.useCallback(() => {
    setIsExpanded(true);
  }, []);

  if (!data) {
    return null;
  }

  return (
    <DetailedInfo.Container templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(215px, auto) minmax(0, 1fr)' }}>

      { config.features.metasuites.isEnabled && (
        <>
          <Box display="none" as="p" id="meta-suites__tx-info-label" data-status={ data.status } data-ready={ !isLoading }/>
          <Box display="none" as="p" id="meta-suites__tx-info-value"/>
          <DetailedInfo.ItemDivider display="none" as="p" id="meta-suites__details-info-item-divider"/>
        </>
      ) }

      { socketStatus && (
        <GridItem colSpan={{ base: undefined, lg: 2 }} mb={ 2 }>
          <TxSocketAlert status={ socketStatus }/>
        </GridItem>
      ) }

      { config.features.tac.isEnabled && <TxDetailsTacOperation isLoading={ isLoading } txHash={ data.hash }/> }

      { data.op_interop_messages ? data.op_interop_messages.map((message) => (
        <TxDetailsInterop key={ message.nonce } data={ message } isLoading={ isLoading }/>
      )) : null }

      { config.features.crossChainTxs.isEnabled && <TxDetailsCrossChainMessages hash={ data.hash } isLoading={ isLoading }/> }

      <TxHash hash={ data.hash } isLoading={ isLoading } status={ data.status }/>

      <TxDetailsStatus data={ data } isLoading={ isLoading } onShowDetailsClick={ expandDetailsSection }/>

      <TxDetailsOptimismWithdrawals data={ data }/>

      <TxDetailsArbitrumStatus data={ data } isLoading={ isLoading }/>

      <TxDetailsZkSyncStatus data={ data } isLoading={ isLoading }/>

      <TxDetailsBlock data={ data } isLoading={ isLoading }/>

      <TxDetailsZkSyncBatch data={ data } isLoading={ isLoading }/>

      <TxDetailsArbitrumBatch data={ data } isLoading={ isLoading }/>

      <TxDetailsTimestamp data={ data } isLoading={ isLoading }/>

      <TxDetailsSuave data={ data } isLoading={ isLoading }/>

      <DetailedInfoSponsoredItem isLoading={ isLoading }/>

      <DetailedInfo.ItemDivider/>

      { !noTxActions && <TxDetailsActions hash={ data.hash } isTxDataLoading={ isLoading }/> }

      <TxDetailsFrom from={ data.from } isLoading={ isLoading }/>

      <TxDetailsTo
        data={ data }
        isLoading={ isLoading }
        recipients={ recipients }
        onViewDetailClick={ expandDetailsSection }
      />

      { data.token_transfers && (
        <TxDetailsTokenTransfers
          data={ data.token_transfers }
          txHash={ data.hash }
          isOverflow={ Boolean(data.token_transfers_overflow) }/>
      ) }

      { config.features.crossChainTxs.isEnabled && <TxDetailsCrossChainTransfers hash={ data.hash } isLoading={ isLoading }/> }

      <TxDetailsInteropTarget data={ data } isLoading={ isLoading }/>

      <DetailedInfo.ItemDivider/>

      <TxDetailsArbitrumL1Txs data={ data } isLoading={ isLoading }/>

      <TxDetailsValue
        data={ data }
        isLoading={ isLoading }
        recipients={ recipients }
        onRecipientsClick={ expandDetailsSection }
      />

      <TxDetailsTxFee isLoading={ isLoading } data={ data }/>

      <TxDetailsOptimismOperatorFee data={ data } isLoading={ isLoading }/>

      <TxDetailsArbitrumFees data={ data } isLoading={ isLoading }/>

      <TxDetailsGasPrice gasPrice={ data.gas_price } gasToken={ data.celo?.gas_token } isLoading={ isLoading }/>

      <TxDetailsFeePerGas txFee={ data.fee.value } gasUsed={ data.gas_used } isLoading={ isLoading }/>

      { !config.slices.tx.additionalFields?.set_max_gas_limit && <TxDetailsGasUsage isLoading={ isLoading } data={ data }/> }

      <TxDetailsArbitrumGasUsed data={ data } isLoading={ isLoading }/>

      <TxDetailsScrollL1GasUsed data={ data } isLoading={ isLoading }/>

      <TxDetailsGasFees data={ data } isLoading={ isLoading }/>

      <TxDetailsBurntFees data={ data } isLoading={ isLoading }/>

      <TxDetailsOptimismL1Fees data={ data } isLoading={ isLoading }/>

      <TxInfoScrollFees data={ data } isLoading={ isLoading }/>

      <CollapsibleDetails
        id="CollapsibleDetails__tx-details"
        loading={ isLoading }
        mt={ 6 }
        gridColumn={{ base: undefined, lg: '1 / 3' }}
        isExpanded={ isExpanded }
        onClick={ handleCutLinkClick }
      >
        <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

        <TxDetailsSetMaxGasLimit data={ data }/>

        <TxDetailsWithdrawalStatusArbitrum data={ data }/>

        <TxDetailsBlobFees data={ data } isLoading={ isLoading }/>

        <TxDetailsOther nonce={ data.nonce } type={ data.type } position={ data.position } queueIndex={ data.scroll?.queue_index }/>

        <TxDetailsEden data={ data } isLoading={ isLoading }/>

        <DetailedInfo.ItemLabel
          hint="Binary data included with the transaction. See logs tab for additional info"
          mb={{ base: 1, lg: 0 }}
        >
          Raw input
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <RawInputData hex={ data.raw_input } defaultDataType={ data.zilliqa?.is_scilla ? 'UTF-8' : 'Hex' }/>
        </DetailedInfo.ItemValue>

        { data.decoded_input && (
          <>
            <DetailedInfo.ItemLabel
              hint="Decoded input data"
            >
              Decoded input data
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="wrap" mt={{ base: '5px', lg: '4px' }}>
              <LogDecodedInputData data={ data.decoded_input }/>
            </DetailedInfo.ItemValue>
          </>
        ) }

        { data.zksync && <ZkSyncL2TxnBatchHashesInfo data={ data.zksync } isLoading={ isLoading }/> }
      </CollapsibleDetails>
    </DetailedInfo.Container>
  );
};

export default TxDetails;
