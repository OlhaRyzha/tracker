import { keepPreviousData, useQuery } from '@tanstack/react-query';
import trackService from '../../../services/api/trackService';
import { useMutateItemWithOptimisticUpdate } from './useMutateItemWithOptimisticUpdate';
import { TRACKS_QUERY_KEY } from '../../../constants/queryKeys.constants';
import { ACTIONS } from '../../../constants/actions.constants';
import {
  BatchDeleteResponse,
  CreateTrackDto,
  PaginatedResponse,
  QueryParams,
  Track,
  UpdateTrackDto,
} from '../../../types/shared/track';
import { IdType } from '@/types/ids';
import {
  FILE_KEY,
  TRACK_KEY,
  TRACKS_LIST_KEY,
} from '@/constants/table.constants';

export const useTracksQuery = (params?: QueryParams) => {
  return useQuery<PaginatedResponse<Track>>({
    queryKey: [TRACKS_LIST_KEY, params],
    queryFn: () => trackService.getAll(params),
    placeholderData: keepPreviousData,
  });
};
export const useGetTrack = (slug: string) => {
  return useQuery<Track>({
    queryKey: [TRACKS_LIST_KEY, slug],
    queryFn: () => trackService.getTrackBySlug(slug),
    enabled: Boolean(slug),
  });
};

export const useCreateTrack = () =>
  useMutateItemWithOptimisticUpdate<Track, CreateTrackDto>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.CREATE,
    mutateFn: trackService.create,
    entity: TRACK_KEY,
  });

export const useUpdateTrack = () =>
  useMutateItemWithOptimisticUpdate<
    Track,
    UpdateTrackDto & { id: string; payload: UpdateTrackDto }
  >({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.UPDATE,
    mutateFn: ({ id, payload }) => trackService.update(id!, payload),
    entity: TRACK_KEY,
  });

export const useDeleteTrack = () =>
  useMutateItemWithOptimisticUpdate<Track, { id: string }>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.DELETE,
    mutateFn: ({ id }) => trackService.delete(id),
    entity: TRACK_KEY,
  });

export const useBulkDeleteTracks = () =>
  useMutateItemWithOptimisticUpdate<BatchDeleteResponse, IdType[]>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.BULK_DELETE,
    mutateFn: (ids) => trackService.bulkDelete(ids),
    entity: TRACKS_LIST_KEY,
  });

export const useUploadTrackAudio = () =>
  useMutateItemWithOptimisticUpdate<Track, { id: string; file: File }>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.UPLOAD_AUDIO,
    mutateFn: ({ id, file }) => trackService.uploadAudio(id, file),
    entity: FILE_KEY,
  });

export const useDeleteTrackAudio = () =>
  useMutateItemWithOptimisticUpdate<Track, { id?: string }>({
    queryKey: TRACKS_QUERY_KEY,
    action: ACTIONS.DELETE_AUDIO,
    mutateFn: ({ id }) => trackService.deleteAudio(id),
    entity: FILE_KEY,
  });
