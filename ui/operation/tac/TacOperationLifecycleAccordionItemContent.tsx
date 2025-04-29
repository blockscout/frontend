import { AccordionItemContent, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import StatusTag from 'ui/shared/statusTag/StatusTag';

interface Props {
  isLast: boolean;
}

const TacOperationLifecycleAccordionItemContent = ({ isLast }: Props) => {
  return (
    <AccordionItemContent ml="9px" pl="17px" pt={ 2 } borderLeftWidth={ isLast ? undefined : '2px' } borderColor="border.divider">
      <Grid
        gridTemplateColumns="112px 1fr"
        alignItems="flex-start"
        columnGap={ 3 }
        rowGap={ 1 }
        bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
        p="6px"
        pl="18px"
        textStyle="sm"
        borderBottomLeftRadius="base"
        borderBottomRightRadius="base"
      >
        <GridItem color="text.secondary" py="6px">
          Status
        </GridItem>
        <GridItem>
          <StatusTag type="ok" text="Success" py={ 1 }/>
        </GridItem>

        <GridItem color="text.secondary" py="6px">
          Timestamp
        </GridItem>
        <GridItem display="inline-flex" alignItems="center" py="6px">
          <DetailedInfoTimestamp timestamp="171973451500" noIcon isLoading={ false }/>
        </GridItem>

        <GridItem color="text.secondary" py="6px">
          Transactions
        </GridItem>
        <GridItem
          display="flex"
          flexDirection="column"
          rowGap={ 3 }
          py="6px"
        >
          {
            [
              '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B9',
              '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B1',
              '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B3',
            ].map((txHash) => {
              return <TxEntity key={ txHash } hash={ txHash } noCopy={ false } isExternal/>;
            })
          }
        </GridItem>

        <GridItem color="text.secondary" py="6px">
          Note
        </GridItem>
        <GridItem display="inline-flex" alignItems="center" py="6px" whiteSpace="pre-wrap">
          ProxyCallError: UniswapV2Router: Insufficient output amount ProxyCallError: UniswapV2Router: Insufficient output amount
        </GridItem>
      </Grid>
    </AccordionItemContent>
  );
};

export default React.memo(TacOperationLifecycleAccordionItemContent);
