import React from 'react';

import * as txMock from 'mocks/txs/tx';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import TxsTable from './TxsTable';

test.describe('base view', () => {

  test('+@dark-mode', async({ render }) => {
    const component = await render(
      <TxsTable
        txs={ [ txMock.base, txMock.withWatchListNames ] }
        // eslint-disable-next-line react/jsx-no-bind
        sort={ () => () => {} }
        top={ 0 }
        showBlockInfo
        showSocketInfo={ false }
      />,
    );

    await component.getByText('kitty').first().hover();

    await expect(component).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('', async({ render }) => {
      const component = await render(
        <TxsTable
          txs={ [ txMock.base, txMock.withWatchListNames ] }
          // eslint-disable-next-line react/jsx-no-bind
          sort={ () => () => {} }
          top={ 0 }
          showBlockInfo
          showSocketInfo={ false }
        />,
      );

      await component.getByText('kitty').first().hover();

      await expect(component).toHaveScreenshot();
    });
  });
});
