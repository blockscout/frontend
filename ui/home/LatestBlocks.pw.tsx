import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as statsMock from 'mocks/stats/index';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';

import LatestBlocks from './LatestBlocks';

test('default view +@mobile +@dark-mode', async({ render, mockApiResponse }) => {
  await mockApiResponse('stats', statsMock.base);
  await mockApiResponse('homepage_blocks', [ blockMock.base, blockMock.base2 ]);
  const component = await render(<LatestBlocks/>);
  await expect(component).toHaveScreenshot();
});

test('L2 view', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.optimisticRollup);
  await mockApiResponse('stats', statsMock.base);
  await mockApiResponse('homepage_blocks', [ blockMock.base, blockMock.base2 ]);
  const component = await render(<LatestBlocks/>);
  await expect(component).toHaveScreenshot();
});

test('no reward view', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.blockHiddenFields);
  await mockApiResponse('stats', statsMock.base);
  await mockApiResponse('homepage_blocks', [ blockMock.base, blockMock.base2 ]);
  const component = await render(<LatestBlocks/>);
  await expect(component).toHaveScreenshot();
});

test('with long block height', async({ render, mockApiResponse }) => {
  await mockApiResponse('stats', statsMock.base);
  await mockApiResponse('homepage_blocks', [ { ...blockMock.base, height: 123456789012345 } ]);
  const component = await render(<LatestBlocks/>);
  await expect(component).toHaveScreenshot();
});

test.describe('socket', () => {
  test.describe.configure({ mode: 'serial' });
  test('new item', async({ render, mockApiResponse, createSocket }) => {
    await mockApiResponse('stats', statsMock.base);
    await mockApiResponse('homepage_blocks', [ blockMock.base, blockMock.base2 ]);
    const component = await render(<LatestBlocks/>, undefined, { withSocket: true });
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'blocks:new_block');
    socketServer.sendMessage(socket, channel, 'new_block', {
      average_block_time: '6212.0',
      block: {
        ...blockMock.base,
        height: blockMock.base.height + 1,
        timestamp: '2022-11-11T11:59:58Z',
      },
    });
    await expect(component).toHaveScreenshot();
  });
});
