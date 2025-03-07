import { Box } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

import AddressFromToIcon from './AddressFromToIcon';

test.use({ viewport: { width: 36, height: 36 } });

[ 'in', 'out', 'self', 'unspecified' ].forEach((type) => {
  test(`${ type } txn type +@dark-mode`, async({ render }) => {
    const component = await render(
      <Box p={ 2 }>
        <AddressFromToIcon type={ type }/>
      </Box>,
    );
    await expect(component).toHaveScreenshot();
  });
});
