import { Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TransactionRevertReason } from 'types/api/transaction';

import hexToUtf8 from 'lib/hexToUtf8';
import TxDecodedInputData from 'ui/tx/TxDecodedInputData/TxDecodedInputData';

type Props = TransactionRevertReason;

const TxRevertReason = (props: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  if ('raw' in props) {
    return (
      <Grid
        bgColor={ bgColor }
        p={ 4 }
        fontSize="sm"
        borderRadius="md"
        templateColumns="auto minmax(0, 1fr)"
        rowGap={ 2 }
        columnGap={ 4 }
        whiteSpace="normal"
      >
        <GridItem fontWeight={ 500 }>Raw:</GridItem>
        <GridItem>{ props.raw }</GridItem>
        <GridItem fontWeight={ 500 }>Decoded:</GridItem>
        <GridItem>{ hexToUtf8(props.raw) }</GridItem>
      </Grid>
    );
  }

  return <TxDecodedInputData data={ props }/>;
};

export default React.memo(TxRevertReason);
