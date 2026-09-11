// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import PageTitle from 'src/shell/page/title/PageTitle';

import { BLOCK_ITEM } from 'src/slices/block/stubs/list';

import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { useChainValue } from 'src/features/multichain/hooks/useChainValue';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { route } from 'src/shared/router/routes';
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
  const { chainValue, chain, onChainValueChange } = useChainValue();

  const blocksQuery = useQueryWithPages({
    resourceName: 'core:blocks',
    queryParams: { type: 'block' },
    options: {
      enabled: tab === 'blocks' || !tab,
      placeholderData: generateListStub<'core:blocks'>(BLOCK_ITEM, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
    chain,
  });

  const reorgsQuery = useQueryWithPages({
    resourceName: 'core:blocks',
    queryParams: { type: 'reorg' },
    options: {
      enabled: tab === 'reorgs',
      placeholderData: generateListStub<'core:blocks'>(BLOCK_ITEM, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
    chain,
  });

  const unclesQuery = useQueryWithPages({
    resourceName: 'core:blocks',
    queryParams: { type: 'uncle' },
    options: {
      enabled: tab === 'uncles',
      placeholderData: generateListStub<'core:blocks'>(BLOCK_ITEM, 50, { next_page_params: {
        block_number: 8988686,
        items_count: 50,
      } }),
    },
    chain,
  });

  const tabs: Array<TabItemRegular> = [
    { id: 'blocks', title: 'All', component: <MultichainBlocksContent type="block" query={ blocksQuery } chainId={ chain?.id }/> },
    { id: 'reorgs', title: 'Forked', component: <MultichainBlocksContent type="reorg" query={ reorgsQuery } chainId={ chain?.id }/> },
    { id: 'uncles', title: 'Uncles', component: <MultichainBlocksContent type="uncle" query={ unclesQuery } chainId={ chain?.id }/> },
  ];

  const currentQuery = (() => {
    switch (tab) {
      case 'reorgs': return reorgsQuery;
      case 'uncles': return unclesQuery;
      default: return blocksQuery;
    }
  })();

  const leftSlot = (
    <ChainSelect
      value={ chainValue }
      onValueChange={ onChainValueChange }
    />
  );

  const rightSlot = (
    <HStack gap={ 8 } hideBelow="lg">
      <Link href={ route({ pathname: '/block/countdown' }, { chain }) }>
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
