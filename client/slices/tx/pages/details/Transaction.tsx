// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { EntityTag as TEntityTag } from 'ui/shared/EntityTags/types';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';
import TxInternals from 'client/slices/internal-tx/pages/tx/TxInternals';
import TxTokenTransfer from 'client/slices/token-transfer/pages/tx/TxTokenTransfer';
import useTxQuery from 'client/slices/tx/hooks/useTxQuery';

import TxDetailsWrapped from 'client/features/chain-variants/suave/pages/tx/TxDetailsWrapped';
import { publicClient } from 'client/features/connect-wallet/utils/public-client';
import TxBlobs from 'client/features/data-availability/pages/tx/TxBlobs';
import TxFheOperations from 'client/features/fhe-operations/pages/tx/TxFheOperations';
import TxAuthorizations from 'client/features/tx-authorization/pages/tx/TxAuthorizations';
import TxAssetFlows from 'client/features/tx-interpretation/noves/pages/tx-asset-flows/TxAssetFlows';
import TxUserOps from 'client/features/user-ops/pages/tx/TxUserOps';

import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';
import useEtherscanRedirects from 'client/shared/router/useEtherscanRedirects';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import TextAd from 'ui/shared/ad/TextAd';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import PageTitle from 'ui/shared/Page/PageTitle';

import TxDetailsApi from './info/TxDetailsApi';
import TxDetailsRpc from './info/TxDetailsRpc';
import TxLogs from './logs/TxLogs';
import TxRawTrace from './raw-trace/TxRawTrace';
import TxState from './state/TxState';
import TxSubHeading from './TxSubHeading';

const txInterpretation = config.features.txInterpretation;
const rollupFeature = config.features.rollup;

const TransactionPageContent = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  useEtherscanRedirects();

  const txQuery = useTxQuery();

  const { data, isPlaceholderData, isError, error, errorUpdateCount } = txQuery;

  const showDegradedView = publicClient && ((isError && error.status !== 422) || isPlaceholderData) && errorUpdateCount > 0;

  const tabs: Array<TabItemRegular> = (() => {
    const detailsComponent = showDegradedView ?
      <TxDetailsRpc hash={ hash } txQuery={ txQuery }/> :
      <TxDetailsApi txQuery={ txQuery }/>;

    return [
      {
        id: 'index',
        title: config.features.suave.isEnabled && data?.wrapped ? 'Confidential compute tx details' : 'Details',
        component: detailsComponent,
      },
      txInterpretation.isEnabled && txInterpretation.provider === 'noves' ?
        { id: 'asset_flows', title: 'Asset Flows', component: <TxAssetFlows hash={ hash }/> } :
        undefined,
      config.features.suave.isEnabled && data?.wrapped ?
        { id: 'wrapped', title: 'Regular tx details', component: <TxDetailsWrapped data={ data.wrapped }/> } :
        undefined,
      {
        id: 'token_transfers',
        title: 'Token transfers',
        component: <TxTokenTransfer txQuery={ txQuery }/>,
        subTabs: [ 'token_transfers', 'token_transfers_cross_chain' ],
      },
      config.features.userOps.isEnabled ?
        { id: 'user_ops', title: 'User operations', component: <TxUserOps txQuery={ txQuery }/> } :
        undefined,
      config.UI.views.internalTx.isEnabled ? { id: 'internal', title: 'Internal txns', component: <TxInternals txQuery={ txQuery }/> } : undefined,
      config.features.dataAvailability.isEnabled && txQuery.data?.blob_versioned_hashes?.length ?
        { id: 'blobs', title: 'Blobs', component: <TxBlobs txQuery={ txQuery }/> } :
        undefined,
      { id: 'logs', title: 'Logs', component: <TxLogs txQuery={ txQuery }/> },
      { id: 'state', title: 'State', component: <TxState txQuery={ txQuery }/> },
      { id: 'raw_trace', title: 'Raw trace', component: <TxRawTrace txQuery={ txQuery }/> },
      txQuery.data?.fhe_operations_count && txQuery.data.fhe_operations_count > 0 ?
        { id: 'fhe_operations', title: 'FHE operations', component: <TxFheOperations txQuery={ txQuery }/> } :
        undefined,
      txQuery.data?.authorization_list?.length ?
        { id: 'authorizations', title: 'Authorizations', component: <TxAuthorizations txQuery={ txQuery }/> } :
        undefined,
    ].filter(Boolean);
  })();

  const txTags: Array<TEntityTag> = data?.transaction_tag ?
    [ { slug: data.transaction_tag, name: data.transaction_tag, tagType: 'private_tag' as const, ordinal: 1 } ] : [];

  if (rollupFeature.isEnabled && rollupFeature.interopEnabled && data?.op_interop_messages && data.op_interop_messages.length > 0) {
    if (data.op_interop_messages.some(message => message.init_chain !== undefined)) {
      txTags.push({ slug: 'relay_tx', name: 'Relay tx', tagType: 'custom' as const, ordinal: 0 });
    }
    if (data.op_interop_messages.some(message => message.relay_chain !== undefined)) {
      txTags.push({ slug: 'init_tx', name: 'Source tx', tagType: 'custom' as const, ordinal: 0 });
    }
  }

  const protocolTags = data?.to?.metadata?.tags?.filter(tag => tag.tagType === 'protocol');
  if (protocolTags && protocolTags.length > 0) {
    txTags.push(...protocolTags);
  }

  const tags = (
    <EntityTags
      isLoading={ !txQuery.isFetchedAfterMount }
      tags={ txTags }
    />
  );

  const titleSecondRow = <TxSubHeading hash={ hash } hasTag={ Boolean(data?.transaction_tag) } txQuery={ txQuery }/>;

  if (isError && !showDegradedView) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ resource: 'general:tx', error, isError: true });
    }
  }

  return (
    <AddressHighlightProvider>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Transaction details"
        contentAfter={ tags }
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ !txQuery.isFetchedAfterMount }/>
    </AddressHighlightProvider>
  );
};

export default TransactionPageContent;
