import { Grid } from '@chakra-ui/react';
import React from 'react';

import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

import TacOperationLifecycleAccordion from './TacOperationLifecycleAccordion';

interface Props {
  isLoading?: boolean;
}

const TacOperationDetails = ({ isLoading }: Props) => {
  return (
    <Grid
      columnGap={ 8 }
      rowGap={ 3 }
      templateColumns={{ base: 'minmax(0, 1fr)', lg: '210px minmax(728px, auto)' }}
    >
      <DetailedInfo.ItemLabel
        hint="Lifecycle"
        isLoading={ isLoading }
      >
        Lifecycle
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <TacOperationLifecycleAccordion/>
      </DetailedInfo.ItemValue>
    </Grid>
  );
};

export default React.memo(TacOperationDetails);
