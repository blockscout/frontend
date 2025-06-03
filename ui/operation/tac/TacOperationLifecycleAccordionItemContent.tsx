import { AccordionItemContent, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityTon from 'ui/shared/entities/tx/TxEntityTon';
import StatusTag from 'ui/shared/statusTag/StatusTag';

interface Props {
  isLast: boolean;
  data: tac.OperationStage;
}

const TacOperationLifecycleAccordionItemContent = ({ isLast, data }: Props) => {
  return (
    <AccordionItemContent
      ml={{ base: 0, lg: '9px' }}
      pl={{ base: 0, lg: '17px' }}
      pt={ 2 }
      borderLeftWidth={{ base: 0, lg: isLast ? undefined : '2px' }}
      borderColor="border.divider"
    >
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
        <GridItem py={ 1 }>
          <StatusTag type={ data.is_success ? 'ok' : 'error' } text={ data.is_success ? 'Success' : 'Failed' }/>
        </GridItem>

        { data.timestamp && (
          <>
            <GridItem color="text.secondary" py="6px">
              Timestamp
            </GridItem>
            <GridItem
              display="inline-flex"
              flexWrap="wrap"
              alignItems="center"
              py="6px"
            >
              <DetailedInfoTimestamp timestamp={ data.timestamp } noIcon isLoading={ false }/>
            </GridItem>
          </>
        ) }

        <GridItem color="text.secondary" py="6px">
          Transactions
        </GridItem>
        <GridItem
          display="flex"
          flexDirection="column"
          rowGap={ 3 }
          py="6px"
          width="100%"
          overflow="hidden"
        >
          {
            data.transactions.map((tx) => {
              if (tx.type === tac.BlockchainType.TON) {
                return <TxEntityTon key={ tx.hash } hash={ tx.hash } noCopy={ false }/>;
              }

              return <TxEntity key={ tx.hash } hash={ tx.hash } icon={{ name: 'brands/tac' }} noCopy={ false }/>;
            })
          }
        </GridItem>

        { data.note && (
          <>
            <GridItem color="text.secondary" py="6px">
              Note
            </GridItem>
            <GridItem
              display="inline-flex"
              alignItems="center"
              py="6px"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
            >
              { data.note }
            </GridItem>
          </>
        ) }
      </Grid>
    </AccordionItemContent>
  );
};

export default React.memo(TacOperationLifecycleAccordionItemContent);
