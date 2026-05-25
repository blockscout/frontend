import { Box } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

import VerificationSteps from './VerificationSteps';

const STEPS = [ 'Confirmed by Sequencer', 'L1 Confirmed' ];

test('first step +@mobile +@dark-mode', async({ render }) => {
  const component = await render(
    <Box p={ 10 }>
      <VerificationSteps currentStep={ STEPS[0] } steps={ STEPS }/>
    </Box>,
  );
  await expect(component).toHaveScreenshot();
});

test('second status', async({ render }) => {
  const component = await render(
    <VerificationSteps currentStep={ STEPS[1] } steps={ STEPS }/>,
  );
  await expect(component).toHaveScreenshot();
});
