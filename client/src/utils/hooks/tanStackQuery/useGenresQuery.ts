import { useQuery } from '@tanstack/react-query';
import genresService from '../../../services/api/genresService';
import { GENRES_QUERY_KEY } from '@/constants/queryKeys.constants';

export const useGenresQuery = () => {
  return useQuery<string[]>({
    queryKey: GENRES_QUERY_KEY,
    queryFn: genresService.getAll,
  });
};
