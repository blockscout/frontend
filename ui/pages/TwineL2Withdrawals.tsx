import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import { rightLineArrow, nbsp } from 'lib/html-entities';
import { TWINE_WITHDRAWAL_ITEM } from 'stubs/twineL2';
import { generateListStub } from 'stubs/utils';
import TwineDepositsListItem from 'ui/deposits/twine/TwineDepositsListItem';
import TwineDepositsTable from 'ui/deposits/twine/TwineDepositsTable';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const TwineL2Withdrawals = () => {
  const { data, isError, isPlaceholderData, pagination } = useQueryWithPages({
    resourceName: 'twine_l2_withdrawals',
    options: {
      placeholderData: generateListStub<'twine_l2_withdrawals'>(
        TWINE_WITHDRAWAL_ITEM,
        50,
        {
          next_page_params: {
            items_count: 50,
            nonce: '',
          },
        },
      ),
    },
  });

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        { data.items.map(((item, index) => (
          <TwineDepositsListItem
            key={ item.tx_hash + (isPlaceholderData ? index : '') }
            isLoading={ isPlaceholderData }
            item={ item }
          />
        ))) }
      </Show>
      <Hide below="lg" ssr={ false }>
        <TwineDepositsTable items={ data.items } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  return (
    <>
      <PageTitle title={ `Withdrawals (L2${ nbsp }${ rightLineArrow }${ nbsp }L1)` } withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no withdrawals."
        content={ content }
      />
    </>
  );
};

export default TwineL2Withdrawals;
