// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import LogDecodedInputData from 'src/slices/log/components/LogDecodedInputData';

import hexToUtf8 from 'src/shared/data/transformers/hex-to-utf8';

import { HEX_REGEXP } from 'src/toolkit/utils/regexp';

type Props = NonNullable<schemas['Transaction']['revert_reason']>;

const TxRevertReason = (props: Props) => {

  const bgColor = { _light: 'red.50', _dark: 'red.900/30' };

  if ('raw' in props) {
    if (!props.raw || !HEX_REGEXP.test(props.raw)) {
      return (
        <Text w="100%" p={{ base: 3, lg: 4 }} bgColor={ bgColor } textStyle="sm" borderBottomRadius="md" mb={ 4 }>
          { props.raw || 'This transaction does not include a revert reason' }
        </Text>
      );
    }

    const decoded = hexToUtf8(props.raw);

    return (
      <Grid
        bgColor={ bgColor }
        p={{ base: 3, lg: 4 }}
        mb={ 4 }
        textStyle="sm"
        borderBottomRadius="md"
        templateColumns="auto minmax(0, 1fr)"
        rowGap={ 2 }
        columnGap={ 4 }
        whiteSpace="normal"
        w="100%"
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

  return (
    <Box mt={ 4 } mb={ 4 } w="100%">
      <LogDecodedInputData data={ props } inputsTableProps={{ bgColor }}/>
    </Box>
  );
};

export default React.memo(TxRevertReason);
