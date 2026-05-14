// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';

import type { TransactionRevertReason } from 'client/slices/tx/types/api';

import LogDecodedInputData from 'client/slices/log/components/LogDecodedInputData';

import hexToUtf8 from 'client/shared/transformers/hex-to-utf8';

import { HEX_REGEXP } from 'toolkit/utils/regexp';

type Props = TransactionRevertReason;

const TxRevertReason = (props: Props) => {
  if ('raw' in props) {
    if (!HEX_REGEXP.test(props.raw)) {
      return <Text>{ props.raw }</Text>;
    }

    const decoded = hexToUtf8(props.raw);

    return (
      <Grid
        bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
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
        { decoded.replace(/\s|\0/g, '') && (
          <>
            <GridItem fontWeight={ 500 }>Decoded:</GridItem>
            <GridItem>{ decoded }</GridItem>
          </>
        ) }
      </Grid>
    );
  }

  return <LogDecodedInputData data={ props }/>;
};

export default React.memo(TxRevertReason);
