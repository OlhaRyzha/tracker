import { META } from '@/constants/table.constants';
import { QueryParams } from '@/types/shared/track';

export const initialParams: QueryParams = {
  page: META.page,
  limit: META.limit,
  search: '',
  sort: META.sort,
  order: META.order,
  genre: '',
  artist: '',
};
