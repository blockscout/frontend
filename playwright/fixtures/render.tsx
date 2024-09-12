/* eslint-disable no-restricted-imports */
import type { MountOptions } from '@playwright/experimental-ct-react';
import type { Locator, TestFixture } from '@playwright/test';
import type router from 'next/router';
import React from 'react';

import type { JsonObject } from '@playwright/experimental-ct-core/types/component';

import ContentWrapper from 'playwright/ContentWrapper';
import type { Props as TestAppProps } from 'playwright/TestApp';
import TestApp from 'playwright/TestApp';

interface MountResult extends Locator {
  unmount(): Promise<void>;
  update(component: JSX.Element): Promise<void>;
}

type Mount = <HooksConfig extends JsonObject>(component: JSX.Element, options?: MountOptions<HooksConfig>) => Promise<MountResult>;

interface Options extends JsonObject {
  hooksConfig?: {
    router: Partial<Pick<typeof router, 'query' | 'isReady' | 'asPath' | 'pathname'>>;
  };
}

export type RenderFixture = (component: JSX.Element, options?: Options, props?: Omit<TestAppProps, 'children'>) => Promise<MountResult>

const fixture: TestFixture<RenderFixture, { mount: Mount }> = async({ mount }, use) => {
  await use((component, options, props) => {
    return mount(
      <TestApp { ...props }><ContentWrapper>{ component }</ContentWrapper></TestApp>,
      options,
    );
  });
};

export default fixture;
