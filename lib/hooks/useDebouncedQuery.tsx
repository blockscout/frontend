import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  QueryKey,
  QueryFunction,
  UseQueryOptions,
  QueryFunctionContext } from '@tanstack/react-query';
import { useRef } from 'react';

export default function useDebouncedQuery<TQueryData, TQueryError = unknown>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryData | TQueryError>,
  debounceMs: number,
  remainingUseQueryOptions?: UseQueryOptions<unknown, TQueryError, TQueryData>,
) {
  const timeoutRef = useRef<number>();
  const queryClient = useQueryClient();
  const previousQueryKeyRef = useRef<QueryKey>();

  const debouncesQueryFn: (queryFnContext: QueryFunctionContext) => Promise<TQueryData | TQueryError> = (queryFnContext: QueryFunctionContext) => {
    // This means the react-query is retrying the query so we should not debounce it.
    if (previousQueryKeyRef.current === queryKey) {
      return queryFn(queryFnContext) as Promise<TQueryData | TQueryError>;
    }

    // We need to cancel previous "pending" queries otherwise react-query will give us an infinite
    // loading state for this key since the Promise we returned was neither resolved nor rejected.
    if (previousQueryKeyRef.current) {
      queryClient.cancelQueries({ queryKey: previousQueryKeyRef.current });
    }

    previousQueryKeyRef.current = queryKey;
    window.clearTimeout(timeoutRef.current);

    return new Promise((resolve, reject) => {
      timeoutRef.current = window.setTimeout(async() => {
        try {
          const result = await queryFn(queryFnContext);

          previousQueryKeyRef.current = undefined;
          resolve(result as TQueryData);
        } catch (error) {
          reject(error as TQueryError);
        }
      }, debounceMs);
    });
  };

  return useQuery<unknown, TQueryError, TQueryData>(
    queryKey,
    debouncesQueryFn,
    remainingUseQueryOptions,
  );
}
