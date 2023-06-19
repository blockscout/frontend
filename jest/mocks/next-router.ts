import type { NextRouter } from 'next/router';

export const router = {
  query: {},
  push: jest.fn(() => Promise.resolve()),
};

export const useRouter = jest.fn<unknown, Array<Partial<NextRouter>>>(() => (router));

export const mockUseRouter = (params?: Partial<NextRouter>) => {
  return {
    useRouter: jest.fn(() => ({
      ...router,
      ...params,
    })),
  };
};
