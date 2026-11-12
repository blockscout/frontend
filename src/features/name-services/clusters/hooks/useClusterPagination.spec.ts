// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from 'vitest/lib';
import { routerStandIn } from 'vitest/utils/routerStandIn';

import { useClusterPagination } from './useClusterPagination';

const PATHNAME = '/name-services';

function renderPagination(hasNextPage = true, isLoading = false) {
  return renderHook(() => useClusterPagination(hasNextPage, isLoading), { wrapper: routerStandIn.wrapper });
}

describe('useClusterPagination', () => {
  beforeEach(() => {
    routerStandIn.reset({ pathname: PATHNAME, query: {} });
  });

  afterEach(cleanup);

  describe('page calculation', () => {
    it('is on the first page when the URL has no page', () => {
      const { result } = renderPagination();

      expect(result.current.page).toBe(1);
      expect(result.current.pagination.page).toBe(1);
    });

    it('reads the page from the URL', () => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: '3' } });

      const { result } = renderPagination();

      expect(result.current.page).toBe(3);
      expect(result.current.pagination.page).toBe(3);
    });

    it('yields no page number for a page that is not a number', () => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: 'invalid' } });

      const { result } = renderPagination();

      expect(result.current.page).toBeNaN();
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      routerStandIn.reset({ pathname: PATHNAME, query: { tab: 'directories', page: '2' } });
    });

    it('moves to the next page and keeps the rest of the URL', async() => {
      const { result } = renderPagination();

      await act(async() => result.current.pagination.onNextPageClick());

      expect(routerStandIn.pathname).toBe(PATHNAME);
      expect(routerStandIn.query).toEqual({ tab: 'directories', page: '3' });
      expect(result.current.page).toBe(3);
    });

    it('drops the page from the URL when going back to the first page', async() => {
      const { result } = renderPagination();

      await act(async() => result.current.pagination.onPrevPageClick());

      expect(routerStandIn.query).toEqual({ tab: 'directories' });
      expect(result.current.page).toBe(1);
    });

    it('moves to the previous page from page 3', async() => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: '3' } });
      const { result } = renderPagination();

      await act(async() => result.current.pagination.onPrevPageClick());

      expect(routerStandIn.query).toEqual({ page: '2' });
      expect(result.current.page).toBe(2);
    });

    it('resets to the first page', async() => {
      const { result } = renderPagination();

      await act(async() => result.current.pagination.resetPage());

      expect(routerStandIn.query).toEqual({ tab: 'directories' });
      expect(result.current.page).toBe(1);
    });
  });

  describe('pagination state', () => {
    it('has pages behind it and can go back past the first page', () => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: '2' } });

      const { result } = renderPagination();

      expect(result.current.pagination.hasPages).toBe(true);
      expect(result.current.pagination.canGoBackwards).toBe(true);
    });

    it('has no pages behind it and cannot go back on the first page', () => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: '1' } });

      const { result } = renderPagination();

      expect(result.current.pagination.hasPages).toBe(false);
      expect(result.current.pagination.canGoBackwards).toBe(false);
    });

    it('passes the next-page flag through', () => {
      const { result } = renderPagination(false, false);

      expect(result.current.pagination.hasNextPage).toBe(false);
    });

    it('passes the loading flag through', () => {
      const { result } = renderPagination(true, true);

      expect(result.current.pagination.isLoading).toBe(true);
    });
  });

  describe('pagination visibility', () => {
    it('is visible past the first page', () => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: '2' } });

      const { result } = renderPagination(false, false);

      expect(result.current.pagination.isVisible).toBe(true);
    });

    it('is visible on the first page when there is a next page', () => {
      const { result } = renderPagination(true, false);

      expect(result.current.pagination.isVisible).toBe(true);
    });

    it('is hidden on the first page when there is no next page', () => {
      const { result } = renderPagination(false, false);

      expect(result.current.pagination.isVisible).toBe(false);
    });
  });

  describe('handler stability', () => {
    it('keeps the same handlers across renders while the page does not change', () => {
      routerStandIn.reset({ pathname: PATHNAME, query: { page: '2' } });

      const { result, rerender } = renderPagination();

      const { onNextPageClick, onPrevPageClick, resetPage } = result.current.pagination;

      rerender();

      expect(result.current.pagination.onNextPageClick).toBe(onNextPageClick);
      expect(result.current.pagination.onPrevPageClick).toBe(onPrevPageClick);
      expect(result.current.pagination.resetPage).toBe(resetPage);
    });
  });
});
