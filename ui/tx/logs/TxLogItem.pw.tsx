import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as addressMocks from 'mocks/address/address';
import * as inputDataMocks from 'mocks/txs/decodedInputData';
import TestApp from 'playwright/TestApp';
import { DESKTOP, MOBILE } from 'playwright/viewports';

import TxLogItem from './TxLogItem';

const TOPICS = [
  '0x3a4ec416703c36a61a4b1f690847f1963a6829eac0b52debd40a23b66c142a56',
  '0x0000000000000000000000000000000000000000000000000000000005001bcf',
  '0xe835d1028984e9e6e7d016b77164eacbcc6cc061e9333c0b37982b504f7ea791',
  null,
];
const DATA = '0x0000000000000000000000000000000000000000000000000070265bf0112cee';

[
  { name: 'desktop', viewport: DESKTOP },
  { name: 'mobile', viewport: MOBILE },
].forEach(({ name, viewport }) => {
  test.describe(name, () => {
    test.use({ viewport });

    test('with decoded input data', async({ mount }) => {
      const component = await mount(
        <TestApp>
          <TxLogItem
            index={ 42 }
            decoded={ inputDataMocks.withIndexedFields }
            address={ addressMocks.withName }
            topics={ TOPICS }
            data={ DATA }
          />
        </TestApp>,
      );
      await expect(component).toHaveScreenshot();
    });

    test('without decoded input data', async({ mount }) => {
      const component = await mount(
        <TestApp>
          <TxLogItem
            index={ 42 }
            decoded={ null }
            address={ addressMocks.withoutName }
            topics={ TOPICS }
            data={ DATA }
          />
        </TestApp>,
      );
      await expect(component).toHaveScreenshot();
    });

    test('dark color mode', async({ mount }) => {
      const component = await mount(
        <TestApp colorMode="dark">
          <TxLogItem
            index={ 42 }
            decoded={ inputDataMocks.withIndexedFields }
            address={ addressMocks.withName }
            topics={ TOPICS }
            data={ DATA }
          />
        </TestApp>,
      );
      await expect(component).toHaveScreenshot();
    });
  });
});
