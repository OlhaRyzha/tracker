import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import type { QueryParams } from '@/types/shared/track';
import { setCacheParams } from '@/store/slices/cacheParams/cacheSlice';
import { META } from '@/constants/table.constants';
import type { OnChangeFn, SortingState } from '@tanstack/react-table';

export interface UseTableParamsOptions {
  listKey: string;
}
export function useTableParams({ listKey }: UseTableParamsOptions) {
  const dispatch = useAppDispatch();
  const cache = useAppSelector(
    (state) => state.cache[listKey] as QueryParams | undefined
  );

  const [params, setParams] = useState<QueryParams>({
    page: cache?.page ?? META.page,
    limit: cache?.limit ?? META.limit,
    search: cache?.search ?? '',
    sort: cache?.sort ?? META.sort,
    order: cache?.order ?? META.order,
    artist: cache?.artist,
    genre: cache?.genre ?? null,
  });

  const [sortingState, setSortingState] = useState<SortingState>([]);

  useEffect(() => {
    dispatch(setCacheParams({ key: listKey, params }));
  }, [dispatch, listKey, params]);

  const update = useCallback((updater: (prev: QueryParams) => QueryParams) => {
    setParams(updater);
  }, []);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSortingState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setParams((paramsPrev) =>
        next?.length
          ? {
              ...paramsPrev,
              sort: next[0].id as QueryParams['sort'],
              order: next[0].desc ? 'desc' : 'asc',
              page: 1,
            }
          : { ...paramsPrev, sort: undefined, order: undefined, page: 1 }
      );

      return next;
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setParams((p) => ({ ...p, page }));
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setParams((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setParams((p) => ({ ...p, search, page: 1 }));
  }, []);

  return {
    params,
    setParams: update,
    sorting: sortingState,
    handleSortingChange,
    handlePageChange,
    handleLimitChange,
    search: params.search ?? '',
    setSearch: handleSearchChange,
  };
}
