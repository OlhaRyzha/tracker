import { AnyAction, combineReducers, Reducer } from 'redux';
import { CacheState } from './slices/cacheParams/cacheSlice';
import cache from './slices/cacheParams/cacheSlice';
import table from './slices/table/tableSlice';
import { TableState } from './slices/table/tableSlice';

export type RootState = {
  cache: CacheState;
  table: TableState;
};

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  cache,
  table,
};

const rootReducer = (asyncReducers?: AsyncReducers) => {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
};

export default rootReducer;
