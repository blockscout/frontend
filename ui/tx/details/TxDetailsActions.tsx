import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { space } from 'lib/html-entities';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsAction from './TxDetailsAction';

const TxDetailsActions = ({ actions }) => {
  return (
    <DetailsInfoItem
      title="Transaction Action"
      hint="Highlighted events of the transaction"
      position="relative"
    >
      <Box w="100%">
        <Box className="mCustomScrollbar" data-mcs-theme="minimal-dark" maxH={ 36 }>
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
        <Text fontWeight={ 500 } color="gray.500" fontSize="sm" id="txActionsScrollForMore" display="none" marginTop={ 5 }>
          Scroll for more
          { space }
          <Text color="gray.500" transform="rotate(90deg)" display="inline-block" as="span">&raquo;</Text>
        </Text>
      </Box>
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
