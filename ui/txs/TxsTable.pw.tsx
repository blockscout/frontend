import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';
import * as configs from 'playwright/utils/configs';

import TxsTable from './TxsTable';

test.describe('base view', () => {

  test('+@dark-mode', async({ mount }) => {
    const component = await mount(
      <TestApp>
        { /* eslint-disable-next-line react/jsx-no-bind */ }
        <TxsTable txs={ [ txMock.base, txMock.withWatchListNames ] } sort={ () => () => {} } top={ 0 } showBlockInfo showSocketInfo={ false }/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('', async({ mount }) => {
      const component = await mount(
        <TestApp>
          { /* eslint-disable-next-line react/jsx-no-bind */ }
          <TxsTable txs={ [ txMock.base, txMock.withWatchListNames ] } sort={ () => () => {} } top={ 0 } showBlockInfo showSocketInfo={ false }/>
        </TestApp>,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});
