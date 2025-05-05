import { Grid } from '@chakra-ui/react';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';

import TacOperationLifecycleAccordion from './TacOperationLifecycleAccordion';
import { sortStatusHistory } from './utils';

interface Props {
  isLoading?: boolean;
  data: tac.OperationDetails;
}

const TacOperationDetails = ({ isLoading, data }: Props) => {

  const statusHistory = data.status_history.filter((item) => item.is_exist).sort(sortStatusHistory);

  return (
    <Grid
      columnGap={ 8 }
      rowGap={ 3 }
      templateColumns={{ base: 'minmax(0, 1fr)', lg: '210px minmax(728px, auto)' }}
    >
      { data?.sender && (
        <>
          <DetailedInfo.ItemLabel
            hint="Sender"
            isLoading={ isLoading }
          >
            Sender
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            { data.sender }
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.timestamp && (
        <>
          <DetailedInfo.ItemLabel
            hint="Timestamp"
            isLoading={ isLoading }
          >
            Timestamp
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <DetailedInfoTimestamp timestamp={ data.timestamp } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { statusHistory.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint="Lifecycle"
            isLoading={ isLoading }
          >
            Lifecycle
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <TacOperationLifecycleAccordion data={ statusHistory } isLoading={ isLoading }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </Grid>
  );
};

export default React.memo(TacOperationDetails);
