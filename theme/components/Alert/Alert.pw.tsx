import type { AlertProps } from '@chakra-ui/react';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

test.use({ viewport: { width: 400, height: 720 } });

const TEST_CASES: Array<AlertProps> = [
  {
    status: 'info',
  },
  {
    status: 'warning',
  },
  {
    status: 'success',
  },
  {
    status: 'error',
  },
  {
    status: 'info',
    colorScheme: 'gray',
  },
];

TEST_CASES.forEach((props) => {
  const testName = Object.entries(props).map(([ key, value ]) => `${ key }=${ value }`).join(', ');

  test(`${ testName } +@dark-mode`, async({ mount }) => {
    const component = await mount(
      <TestApp>
        <Alert { ...props }>
          <AlertIcon/>
          <AlertTitle>
            This is alert text
          </AlertTitle>
        </Alert>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});
