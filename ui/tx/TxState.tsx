import { Accordion, Text } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import TxStateList from 'ui/tx/state/TxStateList';
import TxStateTable from 'ui/tx/state/TxStateTable';

const TxState = () => {
  const isMobile = useIsMobile();
  const list = isMobile ? <TxStateList/> : <TxStateTable/>;

  return (
    <>
      <Text>
        A set of information that represents the current state is updated when a transaction takes place on the network. The below is a summary of those changes
      </Text>
      <Accordion allowMultiple defaultIndex={ [] }>
        { list }
      </Accordion>
    </>
  );
};

export default TxState;
