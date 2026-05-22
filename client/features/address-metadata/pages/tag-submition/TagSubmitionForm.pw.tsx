import React from 'react';

import { publicTagTypes as configMock } from 'client/features/address-metadata/mocks/tag-types';

import { base as useInfoMock } from 'client/features/account/mocks/user-profile';

import { expect, test } from 'playwright/lib';

import * as mocks from './mocks';
import TagSubmitionForm from './TagSubmitionForm';

const onSubmitResult = () => {};

test('base view +@mobile', async({ render }) => {
  const component = await render(
    <TagSubmitionForm config={ configMock } onSubmitResult={ onSubmitResult } userInfo={ useInfoMock }/>,
  );

  await component.getByLabel(/Smart contract \/ Address/i).fill(mocks.address1);
  await component.getByLabel(/add/i).nth(1).click();

  await component.getByLabel('Tag (max 35 characters)*').fill(mocks.tag1.name);
  await component.getByLabel(/label url/i).fill(mocks.tag1.meta.tagUrl);
  await component.getByLabel(/background \(hex\)/i).fill(mocks.tag1.meta.bgColor);
  await component.getByLabel(/text \(hex\)/i).fill(mocks.tag1.meta.textColor);

  await component.getByLabel(/add/i).nth(3).click();
  await component.getByLabel(/connection/i).focus();
  await component.getByLabel(/connection/i).blur();

  await expect(component).toHaveScreenshot();
});
