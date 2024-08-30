import { Box } from '@chakra-ui/react';
import React from 'react';

import * as metadataMock from 'mocks/metadata/address';
import { test, expect } from 'playwright/lib';

import AddressMetadataAlert from './AddressMetadataAlert';

test('base view', async({ render }) => {
  const component = await render(<Box mt={ 1 }><AddressMetadataAlert tags={ [ metadataMock.noteTag ] }/></Box>);

  await expect(component).toHaveScreenshot();
});
