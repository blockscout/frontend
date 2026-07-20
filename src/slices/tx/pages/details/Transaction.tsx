// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { MetadataTag as TMetadataTag } from 'src/features/address-metadata/components/tag/types';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import PageTitle from 'src/shell/page/title/PageTitle';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import TxInternals from 'src/slices/internal-tx/pages/tx/TxInternals';
import TxTokenTransfer from 'src/slices/token-transfer/pages/tx/TxTokenTransfer';
import useTxQuery from 'src/slices/tx/hooks/useTxQuery';

import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';
import TextAd from 'src/features/ads/text/components/TextAd';
import TxDetailsWrapped from 'src/features/chain-variants/suave/pages/tx/TxDetailsWrapped';
import { isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';
import TxBlobs from 'src/features/data-availability/pages/tx/TxBlobs';
import TxFheOperations from 'src/features/fhe-operations/pages/tx/TxFheOperations';
import TxAuthorizations from 'src/features/tx-authorization/pages/tx/TxAuthorizations';
import TxAssetFlows from 'src/features/tx-interpretation/noves/pages/tx-asset-flows/TxAssetFlows';
import TxUserOps from 'src/features/user-ops/pages/tx/TxUserOps';

import config from 'src/config';
import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import useEtherscanRedirects from 'src/shared/router/useEtherscanRedirects';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

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

  const showDegradedView = isPublicClientAvailable && ((isError && error.status !== 422) || isPlaceholderData) && errorUpdateCount > 0;

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
      config.slices.internalTx.isEnabled ? { id: 'internal', title: 'Internal txns', component: <TxInternals txQuery={ txQuery }/> } : undefined,
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

  const txTags: Array<TMetadataTag> = data?.transaction_tag ?
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

  const isTabsLoading = txQuery.isPlaceholderData && !txQuery.errorUpdateCount;

  const tags = (
    <MetadataTags
      isLoading={ isTabsLoading }
      tags={ txTags }
    />
  );

  const titleSecondRow = <TxSubHeading hash={ hash } hasTag={ Boolean(data?.transaction_tag) } txQuery={ txQuery }/>;

  if (isError && !showDegradedView) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ resource: 'core:tx', error, isError: true });
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
      <RoutedTabs tabs={ tabs } isLoading={ isTabsLoading }/>
    </AddressHighlightProvider>
  );
};

export default TransactionPageContent;
