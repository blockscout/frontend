import React from 'react';

import { base as baseBlock } from 'src/slices/block/mocks/details';
import * as blockMock from 'src/slices/block/mocks/list';
import * as statsMock from 'src/slices/chain/stats/mocks';
import { HomeDataContextProvider } from 'src/slices/home/contexts/home-data-context';
import { HomeRpcDataContextProvider } from 'src/slices/home/contexts/rpc-data-context';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import * as socketServer from 'playwright/fixtures/socketServer';
import { test, expect } from 'playwright/lib';

import LatestBlocks from './LatestBlocks';

test('default view +@mobile +@dark-mode', async({ render, mockApiResponse }) => {
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:homepage_blocks', blockMock.baseListResponse.items);
  const component = await render(
    <HomeDataContextProvider>
      <HomeRpcDataContextProvider>
        <LatestBlocks/>
      </HomeRpcDataContextProvider>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});

test('L2 view', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.optimisticRollup);
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:homepage_blocks', blockMock.baseListResponse.items);
  const component = await render(
    <HomeDataContextProvider>
      <HomeRpcDataContextProvider>
        <LatestBlocks/>
      </HomeRpcDataContextProvider>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});

test('no reward view', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.blockHiddenFields);
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:homepage_blocks', blockMock.baseListResponse.items);
  const component = await render(
    <HomeDataContextProvider>
      <HomeRpcDataContextProvider>
        <LatestBlocks/>
      </HomeRpcDataContextProvider>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});

test('with long block height', async({ render, mockApiResponse }) => {
  await mockApiResponse('core:stats', statsMock.base);
  await mockApiResponse('core:homepage_blocks', [ { ...blockMock.baseListResponse.items[0], height: 123456789012345 } ]);
  const component = await render(
    <HomeDataContextProvider>
      <HomeRpcDataContextProvider>
        <LatestBlocks/>
      </HomeRpcDataContextProvider>
    </HomeDataContextProvider>,
  );
  await expect(component).toHaveScreenshot();
});

test.describe('socket', () => {
  test.describe.configure({ mode: 'serial' });
  test('new item', async({ render, mockApiResponse, createSocket }) => {
    await mockApiResponse('core:stats', statsMock.base);
    await mockApiResponse('core:homepage_blocks', blockMock.baseListResponse.items);
    const component = await render(
      <HomeDataContextProvider>
        <HomeRpcDataContextProvider>
          <LatestBlocks/>
        </HomeRpcDataContextProvider>
      </HomeDataContextProvider>,
      undefined,
      { withSocket: true },
    );
    const socket = await createSocket();
    const channel = await socketServer.joinChannel(socket, 'blocks:new_block');
    socketServer.sendMessage(socket, channel, 'new_block', {
      average_block_time: '6212.0',
      block: {
        ...baseBlock,
        height: baseBlock.height + 1,
        timestamp: '2022-11-11T11:59:58Z',
      },
    });
    await expect(component).toHaveScreenshot();
  });
});
