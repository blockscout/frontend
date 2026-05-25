import React from 'react';

import * as addressMetadataMock from 'client/features/address-metadata/mocks/tags';

import { test, expect } from 'playwright/lib';

import MetadataTags from './MetadataTags';

test('mixed name length +@mobile', async({ render }) => {
  const data = [
    addressMetadataMock.protocolTagWithMeta,
    addressMetadataMock.infoTagWithLink,
    addressMetadataMock.genericTag,
    addressMetadataMock.tagWithTooltip,
  ];
  const component = await render(<MetadataTags tags={ data }/>);
  await expect(component).toHaveScreenshot();
});

test('one tag with long name +@mobile -@default', async({ render }) => {
  const data = [
    addressMetadataMock.infoTagWithLink,
  ];
  const component = await render(<MetadataTags tags={ data }/>);
  await expect(component).toHaveScreenshot();
});
