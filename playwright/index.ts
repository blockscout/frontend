import './fonts.css';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import MockDate from 'mockdate';
import * as router from 'next/router';

const NEXT_ROUTER_MOCK = {
  query: {},
};

beforeMount(async({ hooksConfig }) => {
  // Before mount, redefine useRouter to return mock value from test.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: I really want to redefine this property :)
  router.useRouter = () => hooksConfig?.router || NEXT_ROUTER_MOCK;

  // set current date
  MockDate.set('2022-11-11T12:00:00Z');
});

export {};
