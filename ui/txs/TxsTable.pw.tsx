import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';

import TxsTable from './TxsTable';

test('base view +@dark-mode +@desktop-xl', async({ mount }) => {
  const component = await mount(
    <TestApp>
      { /* eslint-disable-next-line react/jsx-no-bind */ }
      <TxsTable txs={ [ txMock.base, txMock.base ] } sort={ () => () => {} } top={ 0 } showBlockInfo showSocketInfo={ false }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
