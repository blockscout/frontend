import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import Script from 'next/script'

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsAction from './TxDetailsAction';

const TxDetailsActions = ({ actions }) => {
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
          { actions.map((action, index) => <TxDetailsAction key={ index } { ...action } isLast={ index === actions.length-1 }/>) }
        </Flex>
      </Box>
      <Script src="/static/js/jquery.mCustomScrollbar.concat.min.js" strategy="afterInteractive" onLoad={() => {
        $(".mCustomScrollbar").mCustomScrollbar({callbacks:{
          onOverflowY: () => {
            $("#txActionsTitle .note").css("display", "block");
            $(".mCustomScrollbar").removeClass("mCS_no_scrollbar_y");
          },
          onOverflowYNone: () => {
            $("#txActionsTitle .note").css("display", "none");
            $(".mCustomScrollbar").addClass("mCS_no_scrollbar_y");
          }
        },
        theme: "dark",
        autoHideScrollbar: true,
        scrollButtons: {enable: false},
        scrollbarPosition: "outside"});
      }} />
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
