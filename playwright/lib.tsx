/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-console */
import { test as base } from '@playwright/experimental-ct-react';
import type router from 'next/router';
import React from 'react';

import type { JsonObject } from '@playwright/experimental-ct-core/types/component';

import buildUrl from 'lib/api/buildUrl';
import type { ResourceName, ResourcePayload } from 'lib/api/resources';
import * as textAdMock from 'mocks/ad/textAd';
import type { Locator } from 'playwright/test';
import type { Props as TestAppProps } from 'playwright/TestApp';
import TestApp from 'playwright/TestApp';

namespace render {
  export interface MountResult extends Locator {
    unmount(): Promise<void>;
    update(component: JSX.Element): Promise<void>;
  }

  export interface Options extends JsonObject {
    hooksConfig?: {
      router: Pick<typeof router, 'query'>;
    };
  }

  export type Fixture = (component: JSX.Element, options?: Options, props?: TestAppProps) => Promise<MountResult>;
}

namespace mockApiResponse {
  interface ResourceInfo<R extends ResourceName> {
    resourceName: Parameters<typeof buildUrl<R>>[0];
    pathParams?: Parameters<typeof buildUrl<R>>[1];
    queryParams?: Parameters<typeof buildUrl<R>>[2];
  }

  export type Fixture = <R extends ResourceName>(resourceInfo: ResourceInfo<R>, responseMock: ResourcePayload<R>) => Promise<string>;
}

interface Fixtures {
  render: render.Fixture;
  mockApiResponse: mockApiResponse.Fixture;
}

const test = base.extend<Fixtures>({
  render: async({ mount }, use) => {
    await use((component, options, props) => {
      return mount(
        <TestApp { ...props }>{ component }</TestApp>,
        options,
      );
    });
  },

  mockApiResponse: async({ page }, use) => {
    interface ResourceInfo<R extends ResourceName> {
      resourceName: Parameters<typeof buildUrl<R>>[0];
      pathParams?: Parameters<typeof buildUrl<R>>[1];
      queryParams?: Parameters<typeof buildUrl<R>>[2];
    }

    await use(async<R extends ResourceName>(resourceInfo: ResourceInfo<R>, responseMock: ResourcePayload<R>) => {
      const url = buildUrl(resourceInfo.resourceName, resourceInfo.pathParams, resourceInfo.queryParams);

      await page.route(url, (route) => route.fulfill({
        status: 200,
        body: JSON.stringify(responseMock),
      }));

      return url;
    });
  },
});

test.beforeEach(async({ page }) => {
  // debug
  if (process.env.PWDEBUG === '1') {
    page.on('console', msg => console.log(msg.text()));
    page.on('request', request => console.info('\x1b[34m%s\x1b[0m', '>>', request.method(), request.url()));
    page.on('response', response => console.info('\x1b[35m%s\x1b[0m', '<<', String(response.status()), response.url()));
  }

  await page.route('**', (route) => {
    if (!route.request().url().startsWith('http://localhost')) {
      console.info('Aborting request to', route.request().url());
      route.abort();
    } else {
      route.continue();
    }
  });

  // Text AD
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));

  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

export * from '@playwright/experimental-ct-react';
export { test };
