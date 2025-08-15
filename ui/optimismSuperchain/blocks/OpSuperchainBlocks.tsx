import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { route } from 'nextjs/routes';

import multichainConfig from 'configs/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { BLOCK } from 'stubs/block';
import { generateListStub } from 'stubs/utils';
import { Link } from 'toolkit/chakra/link';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import IconSvg from 'ui/shared/IconSvg';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import OpSuperchainBlocksContent from './OpSuperchainBlocksContent';

const QUERY_PRESERVED_PARAMS = [ 'chain-slug' ];
const TABS_LEFT_SLOT_PROPS = {
  mr: { base: 'auto', lg: 6 - 2 },
};
const TAB_LIST_PROPS = {
  mb: 0,
  mt: -6,
  pt: 6,
  pb: { base: 9, lg: 3 },
};

const OpSuperchainBlocks = () => {
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
    { id: 'blocks', title: 'All', component: <OpSuperchainBlocksContent type="block" query={ blocksQuery } chainSlug={ blocksQuery.chainValue?.[0] }/> },
    { id: 'reorgs', title: 'Forked', component: <OpSuperchainBlocksContent type="reorg" query={ reorgsQuery } chainSlug={ reorgsQuery.chainValue?.[0] }/> },
    { id: 'uncles', title: 'Uncles', component: <OpSuperchainBlocksContent type="uncle" query={ unclesQuery } chainSlug={ unclesQuery.chainValue?.[0] }/> },
  ];

  const currentQuery = (() => {
    switch (tab) {
      case 'reorgs': return reorgsQuery;
      case 'uncles': return unclesQuery;
      default: return blocksQuery;
    }
  })();

  const currentChainInfo = multichainConfig()?.chains.find(chain => chain.slug === currentQuery.chainValue?.[0]);

  const leftSlot = (
    <ChainSelect
      value={ currentQuery.chainValue }
      onValueChange={ currentQuery.onChainValueChange }
    />
  );

  const rightSlot = (
    <HStack gap={ 8 } hideBelow="lg">
      <Link href={ route({ pathname: '/block/countdown' }, currentChainInfo ? { chain: currentChainInfo } : undefined) }>
        <IconSvg name="hourglass_slim" boxSize={ 5 } mr={ 2 }/>
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

export default React.memo(OpSuperchainBlocks);
