import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TxAction } from 'types/api/txAction';

import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

import TxDetailsAction from './TxDetailsAction';

interface Props {
  actions: Array<TxAction>;
}

const TxDetailsActions = ({ actions }: Props) => {
  return (
    <DetailsInfoItem
      title="Transaction Action"
      hint="Highlighted events of the transaction"
      note="Scroll to see more"
    >
      <Flex
        flexDirection="column"
        alignItems="flex-start"
        rowGap={ 5 }
        w="100%"
      >
        { actions.map((action, index: number) => <TxDetailsAction key={ index } action={ action }/>) }
      </Flex>
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsActions);
