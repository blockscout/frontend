import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useEffect, useCallback } from 'react';
import { formatUnits, hexToBigInt } from 'viem';

import type { Epoch } from 'types/api/epoch';

import { getEnvValue } from 'configs/app/utils';
import dayjs from 'lib/date/dayjs';

import type { PaginationParams } from './usePagination';

dayjs.extend(relativeTime);

interface EpochResponse {
  data: {
    epochs: {
      totalCount: `0x${ string }`;
      pageInfo: {
        first: string;
        last: string;
        hasNext: boolean;
        hasPrevious: boolean;
        __typename: string;
      };
      edges: Array<{
        epoch: {
          id: `0x${ string }`;
          duration: `0x${ string }`;
          endTime: `0x${ string }`;
          epochFee: `0x${ string }`;
          __typename: `0x${ string }`;
        };
        cursor: string;
        __typename: string;
      }>;
      __typename: string;
    };
  };
}

interface FetchEpochsResult {
  data: Array<Epoch>;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextCursor: string | null;
  loading: boolean;
  error: unknown;
  pagination: PaginationParams;
}

const formatCompactRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp * 1000; // Convert seconds to milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${ days }d ago`;
  if (hours > 0) return `${ hours }h ago`;
  if (minutes > 0) return `${ minutes }m ago`;
  return `${ seconds }s ago`;
};

export function useFetchEpochsInfo(
  pageSize: number = 50,
  initialCursor: string | null = null,
  paginationParams?: PaginationParams,
): FetchEpochsResult {
  const [ data, setData ] = useState<Array<Epoch>>([]);
  const [ totalCount, setTotalCount ] = useState<number>(0);
  const [ hasNext, setHasNext ] = useState<boolean>(false);
  const [ hasPrevious, setHasPrevious ] = useState<boolean>(false);
  const [ nextCursor, setNextCursor ] = useState<string | null>(null);
  const [ cursors, setCursors ] = useState<Array<string | null>>([ initialCursor ]);
  const [ currentCursorIndex, setCurrentCursorIndex ] = useState<number>(0);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<unknown>('');

  const GRAPHQL_SERVER_URL = getEnvValue(
    'NEXT_PUBLIC_CUSTOM_GRAPHQL_SERVER_BASE_URL',
  ) as string;

  const fetchEpochs = useCallback(async(cursor: string | null = null) => {
    try {
      setLoading(true);
      const query = JSON.stringify({
        operationName: 'EpochList',
        query: `
          query EpochList($cursor: Cursor, $count: Int!) {
            epochs(cursor: $cursor, count: $count) {
              totalCount
              pageInfo {
                first
                last
                hasNext
                hasPrevious
                __typename
              }
              edges {
                epoch {
                  id
                  duration
                  endTime
                  epochFee
                  __typename
                }
                cursor
                __typename
              }
              __typename
            }
          }
        `,
        variables: {
          cursor: cursor,
          count: pageSize,
        },
      });

      const response = await fetch(GRAPHQL_SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error('Fetching epochs failed');
      }

      const result = (await response.json()) as EpochResponse;

      const epochs: Array<Epoch> = result.data.epochs.edges.map((edge) => ({
        id: String(hexToBigInt(edge.epoch.id)),
        duration: new Date(
          Number(formatUnits(hexToBigInt(edge.epoch.duration), 0)) * 1000,
        )
          .toISOString()
          .substr(11, 8),
        endTime: formatCompactRelativeTime(
          Number(formatUnits(hexToBigInt(edge.epoch.endTime), 0)),
        ),
        epochFee: Number(
          formatUnits(hexToBigInt(edge.epoch.epochFee), 18),
        ).toFixed(2),
      }));

      setData(epochs);

      setTotalCount(Number(hexToBigInt(result.data.epochs.totalCount)));
      setHasNext(result.data.epochs.pageInfo.hasNext);
      setHasPrevious(result.data.epochs.pageInfo.hasPrevious);

      const newNextCursor = result.data.epochs.pageInfo.hasNext ?
        result.data.epochs.edges[result.data.epochs.edges.length - 1].epoch.id :
        null;
      // Remove console.log statement as flagged by linter
      // console.log({ newNextCursor });

      setNextCursor(newNextCursor);

      return {
        data: epochs,
        hasNext: result.data.epochs.pageInfo.hasNext,
        hasPrevious: result.data.epochs.pageInfo.hasPrevious,
        nextCursor: newNextCursor,
      };
    } catch (error: unknown) {
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [ GRAPHQL_SERVER_URL, pageSize ]);

  const goToNextPage = useCallback(() => {
    if (!hasNext || loading) return;

    if (currentCursorIndex < cursors.length - 1) {
      setCurrentCursorIndex(currentCursorIndex + 1);
      return;
    }

    setCursors((prev) => [ ...prev, nextCursor ]);
    setCurrentCursorIndex(currentCursorIndex + 1);
  }, [ hasNext, loading, currentCursorIndex, cursors, nextCursor ]);

  const goToPrevPage = useCallback(() => {
    if (!hasPrevious || loading || currentCursorIndex <= 0) return;

    setCurrentCursorIndex(currentCursorIndex - 1);
  }, [ hasPrevious, loading, currentCursorIndex ]);

  const resetPages = useCallback(() => {
    setCursors([ initialCursor ]);
    setCurrentCursorIndex(0);
  }, [ initialCursor ]);

  useEffect(() => {
    const cursor = cursors[currentCursorIndex];
    fetchEpochs(cursor);
  }, [ currentCursorIndex, cursors, fetchEpochs ]);

  // Create pagination object
  const pagination: PaginationParams = paginationParams || {
    page: currentCursorIndex + 1,
    onNextPageClick: goToNextPage,
    onPrevPageClick: goToPrevPage,
    resetPage: resetPages,
    hasPages: hasNext || hasPrevious,
    hasNextPage: hasNext,
    canGoBackwards: hasPrevious && currentCursorIndex > 0,
    isLoading: loading,
    isVisible: true,
  };

  return {
    data,
    totalCount,
    hasNext,
    hasPrevious,
    nextCursor,
    loading,
    error,
    pagination,
  };
}
