import React from 'react';

import * as metadataMock from 'mocks/metadata/address';
import { test, expect } from 'playwright/lib';

import AddressMetadataAlert from './AddressMetadataAlert';

test('base view', async({ render }) => {
  const component = await render(<AddressMetadataAlert tags={ [ metadataMock.noteTag, metadataMock.noteTag2 ] }/>);

  await expect(component).toHaveScreenshot();
});
