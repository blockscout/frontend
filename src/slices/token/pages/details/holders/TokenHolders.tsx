// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import BubblemapsMap from 'src/features/bubblemaps/components/BubblemapsMap';
import CsvExport from 'src/features/csv-export/components/CsvExport';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import TokenHoldersList from './TokenHoldersList';
import { useTokenHoldersQuery } from './useTokenHoldersQuery';

export const TOKEN_HOLDERS_TAB_IDS = [ 'holders_address' as const, 'holders_bubblemaps' as const ];

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};

interface Props {
  token: schemas['Token'] | undefined;
  isLoading: boolean;
  tokenId?: string;
}

const TokenHolders = ({ token, isLoading, tokenId }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const tab = getQueryParamString(router.query.tab);

  const hasBubblemapsTab = config.features.bubblemaps.isEnabled && token?.type === 'ERC-20';
  const isAddressTab = !hasBubblemapsTab || tab === 'holders_address' || tab === 'holders';

  const holdersQuery = useTokenHoldersQuery({ token, tokenId, enabled: !isLoading && isAddressTab });

  const controls = (
    <>
      { token && (
        <CsvExport
          type="token_holders"
          resourceName="core:token_csv_export_holders"
          pathParams={{ hash: token.address_hash }}
          extraParams={{ token_name: token.name || 'Unknown token' }}
          periodFilter={ false }
          loadingInitial={ holdersQuery.pagination.isLoading }
        />
      ) }
      { holdersQuery.pagination.isVisible && <Pagination ml="auto" { ...holdersQuery.pagination }/> }
    </>
  );

  const addressActionBar = isMobile ? (
    <ActionBar>
      { controls }
    </ActionBar>
  ) : null;

  const tabs = [
    {
      id: 'holders_address',
      title: 'Address',
      component: <TokenHoldersList token={ token } query={ holdersQuery } actionBar={ addressActionBar }/>,
    },
    hasBubblemapsTab ? {
      id: 'holders_bubblemaps',
      title: 'Bubblemaps',
      component: token ? <BubblemapsMap hash={ token.address_hash }/> : null,
    } : null,
  ].filter(Boolean);

  const rightSlot = isAddressTab && !isMobile ? controls : null;

  const rightSlotProps = {
    display: 'flex',
    justifyContent: 'space-between',
    ml: { base: 0, lg: hasBubblemapsTab ? 4 : 0 },
    widthAllocation: 'available' as const,
  };

  return (
    <RoutedTabs
      variant="secondary"
      size="sm"
      tabs={ tabs }
      rightSlot={ rightSlot }
      rightSlotProps={ rightSlotProps }
      listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      stickyEnabled={ !isMobile && isAddressTab }
    />
  );
};

export default React.memo(TokenHolders);
