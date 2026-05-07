import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { ZilliqaQuorumCertificate } from 'client/features/chain-variants/zilliqa/types/api';

import * as blockMock from 'client/slices/block/mocks/block';

import { test, expect } from 'playwright/lib';

import BlockDetailsZilliqaQuorumCertificate from './BlockDetailsZilliqaQuorumCertificate';

test('quorum certificate', async({ render }) => {
  const component = await render(
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <BlockDetailsZilliqaQuorumCertificate data={ blockMock.zilliqaWithAggregateQuorumCertificate.zilliqa?.quorum_certificate as ZilliqaQuorumCertificate }/>
    </Grid>,
  );
  await expect(component).toHaveScreenshot();
});

test('aggregated quorum certificate +@mobile', async({ render }) => {
  const component = await render(
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <BlockDetailsZilliqaQuorumCertificate
        data={ blockMock.zilliqaWithAggregateQuorumCertificate.zilliqa?.aggregate_quorum_certificate as ZilliqaQuorumCertificate }
      />
    </Grid>,
  );
  await component.getByRole('button', { name: 'Nested quorum certificates' }).click();

  await expect(component).toHaveScreenshot();
});
