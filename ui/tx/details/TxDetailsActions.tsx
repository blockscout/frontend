import { Box, Flex } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import type { TxAction as TTxAction } from 'types/api/txAction';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsAction from './TxDetailsAction';

interface Props {
  actions: Array<TTxAction>;
}

declare global {
  interface JQuery {
    mCustomScrollbar(options: object): void;
  }
}

const TxDetailsActions = ({ actions }: Props) => {
  function onScrollbarLoad() {
    const customScrollBar = $('.mCustomScrollbar');
    customScrollBar.mCustomScrollbar({ callbacks: {
      onOverflowY: () => {
        $('#txActionsTitle .note').css('display', 'block');
        customScrollBar.removeClass('mCS_no_scrollbar_y');
      },
      onOverflowYNone: () => {
        $('#txActionsTitle .note').css('display', 'none');
        customScrollBar.addClass('mCS_no_scrollbar_y');
      },
    },
    theme: 'dark',
    autoHideScrollbar: true,
    scrollButtons: { enable: false },
    scrollbarPosition: 'outside' });
  }

  return (
    <DetailsInfoItem
      title="Transaction Action"
      hint="Highlighted events of the transaction"
      note="Scroll to see more"
      noteDisplay="none"
      position="relative"
      id="txActionsTitle"
    >
      <Box className="mCustomScrollbar" maxH={ 36 } w="98%" overflow="hidden">
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          rowGap={ 5 }
          w="100%"
          fontWeight={ 500 }
        >
          { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action } isLast={ index === actions.length - 1 }/>) }
        </Flex>
      </Box>
      { /* eslint-disable-next-line react/jsx-no-bind */ }
      <Script src="/static/js/jquery.mCustomScrollbar.concat.min.js" strategy="afterInteractive" onLoad={ onScrollbarLoad }/>
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
