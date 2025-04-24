import { IdType } from '../../types/ids';
import {
  BatchDeleteResponse,
  CreateTrackDto,
  PaginatedResponse,
  QueryParams,
  Track as TrackType,
  UpdateTrackDto,
} from '../../types/shared/track';
import apiClient from '../BaseService';

const Track = {
  getAll: async (params?: QueryParams) =>
    apiClient.get<PaginatedResponse<TrackType>>('/api/tracks', { params }),

  getTrackBySlug: (slug: string) =>
    apiClient.get<TrackType>(`/api/tracks/${slug}`),

  create: (payload: CreateTrackDto) =>
    apiClient.post<TrackType, CreateTrackDto>('/api/tracks', payload),

  update: (id: IdType, payload: UpdateTrackDto) =>
    apiClient.put<TrackType, UpdateTrackDto>(`/api/tracks/${id}`, payload),

  delete: (id: IdType) => apiClient.delete<void>(`/api/tracks/${id}`),

  bulkDelete: (ids: IdType[]) =>
    apiClient.post<BatchDeleteResponse, { ids: IdType[] }>(
      '/api/tracks/delete',
      { ids }
    ),

  uploadAudio: (id: IdType, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<TrackType, FormData>(
      `/api/tracks/${id}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  deleteAudio: (id?: IdType) =>
    apiClient.delete<TrackType>(`/api/tracks/${id}/file`),
};

export default Track;
