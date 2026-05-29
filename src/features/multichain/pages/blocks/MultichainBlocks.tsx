// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import { route } from 'src/server/routes';

import PageTitle from 'src/shell/page/title/PageTitle';

import { BLOCK } from 'src/slices/block/stubs/block';

import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import MultichainBlocksContent from './MultichainBlocksContent';

const QUERY_PRESERVED_PARAMS = [ 'chain_id' ];
const TABS_LEFT_SLOT_PROPS = {
  mr: { base: 'auto', lg: 6 - 2 },
};
const TAB_LIST_PROPS = {
  mb: 0,
  mt: -6,
  pt: 6,
  pb: { base: 9, lg: 3 },
};

const MultichainBlocks = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const blocksQuery = useQueryWithPages({
    resourceName: 'general:blocks',
    filters: { type: 'block' },
    options: {
      enabled: tab === 'blocks' || !tab,
      placeholderData: generateListStub<'general:blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
    isMultichain: true,
  });

  const reorgsQuery = useQueryWithPages({
    resourceName: 'general:blocks',
    filters: { type: 'reorg' },
    options: {
      enabled: tab === 'reorgs',
      placeholderData: generateListStub<'general:blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
    isMultichain: true,
  });

  const unclesQuery = useQueryWithPages({
    resourceName: 'general:blocks',
    filters: { type: 'uncle' },
    options: {
      enabled: tab === 'uncles',
      placeholderData: generateListStub<'general:blocks'>(BLOCK, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
    isMultichain: true,
  });

  const tabs: Array<TabItemRegular> = [
    { id: 'blocks', title: 'All', component: <MultichainBlocksContent type="block" query={ blocksQuery } chainId={ blocksQuery.chainValue?.[0] }/> },
    { id: 'reorgs', title: 'Forked', component: <MultichainBlocksContent type="reorg" query={ reorgsQuery } chainId={ reorgsQuery.chainValue?.[0] }/> },
    { id: 'uncles', title: 'Uncles', component: <MultichainBlocksContent type="uncle" query={ unclesQuery } chainId={ unclesQuery.chainValue?.[0] }/> },
  ];

  const currentQuery = (() => {
    switch (tab) {
      case 'reorgs': return reorgsQuery;
      case 'uncles': return unclesQuery;
      default: return blocksQuery;
    }
  })();

  const currentChainInfo = multichainConfig()?.chains.find(chain => chain.id === currentQuery.chainValue?.[0]);

  const leftSlot = (
    <ChainSelect
      value={ currentQuery.chainValue }
      onValueChange={ currentQuery.onChainValueChange }
    />
  );

  const rightSlot = (
    <HStack gap={ 8 } hideBelow="lg">
      <Link href={ route({ pathname: '/block/countdown' }, { chain: currentChainInfo }) }>
        <SpriteIcon name="hourglass" boxSize={ 5 } mr={ 2 }/>
        <span>Block countdown</span>
      </Link>
      <Pagination { ...currentQuery.pagination }/>
    </HStack>
  );

  return (
    <>
      <PageTitle
        withTextAd
        title="Blocks"
      />
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        preservedParams={ QUERY_PRESERVED_PARAMS }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        leftSlot={ leftSlot }
        leftSlotProps={ TABS_LEFT_SLOT_PROPS }
        rightSlot={ !isMobile ? rightSlot : undefined }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default React.memo(MultichainBlocks);
