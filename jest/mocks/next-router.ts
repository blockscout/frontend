import type { NextRouter } from 'next/router';

export function mockRouter(params?: Partial<NextRouter>) {
  return {
    useRouter: jest.fn(() => ({
      query: {},
      push: jest.fn(),
      ...params,
    })),
  };
}
