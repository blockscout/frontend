import React from 'react';

import * as txMock from 'src/slices/tx/mocks/details';

import { Container } from 'src/shared/detailed-info/DetailedInfo';

import { test, expect } from 'playwright/lib';

import TxDetailsStatus from './TxDetailsStatus';

test.describe('error', () => {
  test('with decoded revert reason', async({ render }) => {
    const component = await render(
      <Container>
        <TxDetailsStatus data={ txMock.withDecodedRevertReason } isLoading={ false }/>
      </Container>,
    );
    await component.getByText('Show revert reason').click();

    await expect(component).toHaveScreenshot();
  });

  test('with decoded raw reason', async({ render }) => {
    const component = await render(
      <Container>
        <TxDetailsStatus data={ txMock.withRawRevertReason } isLoading={ false }/>
      </Container>,
    );
    await component.getByText('Show revert reason').click();

    await expect(component).toHaveScreenshot();
  });

  test('without reason', async({ render }) => {
    const component = await render(
      <Container>
        <TxDetailsStatus data={ txMock.withoutRevertReason } isLoading={ false }/>
      </Container>,
    );
    await component.getByText('Show revert reason').click();

    await expect(component).toHaveScreenshot();
  });

  test('with revert reason param', async({ render }) => {
    const component = await render(
      <Container>
        <TxDetailsStatus data={ txMock.withRevertReasonParam } isLoading={ false }/>
      </Container>,
    );
    await component.getByText('Show revert reason').click();
    await component.getByText('failed').hover();

    await expect(component).toHaveScreenshot();
  });
});
