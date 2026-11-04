// @vitest-environment jsdom

import * as addressParamMock from 'src/slices/address/mocks/address-param';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, wrapper, act, cleanup } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
import { routerStandIn } from 'vitest/utils/routerStandIn';

vi.mock('next/router', () => import('vitest/utils/routerStandIn').then((m) => m.nextRouterModule));
vi.mock('react-scroll', () => ({ animateScroll: { scrollToTop: vi.fn() } }));

import { useInternalTxsPaginatedQuery } from './useInternalTxsPaginatedQuery';

const response = { items: [], next_page_params: null };
const responseInit = { headers: { 'Content-Type': 'application/json' } };

const params = {
  resourceName: 'core:address_internal_txs' as const,
  pathParams: { hash: addressParamMock.hash },
};

const lastRequestSearch = () => {
  const requests = fetchMock.requests();
  return new URL(requests[requests.length - 1].url).searchParams;
};

async function waitForApiResponse() {
  await flushPromises();
  await act(flushPromises);
}

beforeEach(() => {
  fetchMock.resetMocks();
  fetchMock.mockResponse(JSON.stringify(response), responseInit);
  routerStandIn.reset({ pathname: '/address/[hash]' });
});

afterEach(cleanup);

describe('zero-value internal transactions filter', () => {
  it('hides zero-value items by default and asks the API to exclude them', async() => {
    const { result } = renderHook(() => useInternalTxsPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.isZeroValueShown).toBe(false);
    expect(lastRequestSearch().get('include_zero_value')).toBe('false');
  });

  it('shows zero-value items when the URL opts in', async() => {
    routerStandIn.reset({ pathname: '/address/[hash]', query: { include_zero_value: 'true' } });

    const { result } = renderHook(() => useInternalTxsPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    expect(result.current.isZeroValueShown).toBe(true);
    expect(lastRequestSearch().get('include_zero_value')).toBe('true');
  });

  it('turning the switch on writes only the opt-in to the URL and keeps the other filters', async() => {
    routerStandIn.reset({ pathname: '/address/[hash]', query: { filter: 'from' } });

    const { result } = renderHook(() => useInternalTxsPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.onZeroValueToggle(true);
    });
    await waitForApiResponse();

    expect(routerStandIn.query).toEqual({ filter: 'from', include_zero_value: 'true' });
    expect(result.current.isZeroValueShown).toBe(true);
    expect(lastRequestSearch().get('include_zero_value')).toBe('true');
    expect(lastRequestSearch().get('filter')).toBe('from');
  });

  it('turning the switch off removes the param from the URL', async() => {
    routerStandIn.reset({ pathname: '/address/[hash]', query: { filter: 'from', include_zero_value: 'true' } });

    const { result } = renderHook(() => useInternalTxsPaginatedQuery(params), { wrapper });
    await waitForApiResponse();

    await act(async() => {
      result.current.onZeroValueToggle(false);
    });
    await waitForApiResponse();

    expect(routerStandIn.query).toEqual({ filter: 'from' });
    expect(result.current.isZeroValueShown).toBe(false);
    expect(lastRequestSearch().get('include_zero_value')).toBe('false');
  });
});
