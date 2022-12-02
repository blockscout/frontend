import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsAction from './TxDetailsAction';

const TxDetailsActions = ({ actions }) => {
  return (
    <DetailsInfoItem
      title="Transaction Action"
      hint="Highlighted events of the transaction"
      position="relative"
    >
      <Box className="mCustomScrollbar" data-mcs-theme="minimal-dark" maxH={ 40 }>
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
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
