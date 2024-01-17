import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import AddressFromToIcon from './AddressFromToIcon';

test.use({ viewport: { width: 36, height: 36 } });

[ 'in', 'out', 'self', 'unspecified' ].forEach((type) => {
  test(`${ type } txn type +@dark-mode`, async({ mount }) => {
    const component = await mount(
      <TestApp>
        <Box p={ 2 }>
          <AddressFromToIcon type={ type }/>
        </Box>
      </TestApp>,
    );
    await expect(component).toHaveScreenshot();
  });
});
