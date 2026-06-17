// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import LogDecodedInputData from 'src/slices/log/components/LogDecodedInputData';

import hexToUtf8 from 'src/shared/data/transformers/hex-to-utf8';

import { HEX_REGEXP } from 'src/toolkit/utils/regexp';

type Props = NonNullable<schemas['Transaction']['revert_reason']>;

const TxRevertReason = (props: Props) => {
  if ('raw' in props) {
    if (!props.raw) {
      return null;
    }

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
