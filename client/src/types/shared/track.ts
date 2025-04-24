import { IdType } from '../ids';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  slug: string;
  coverImage?: string;
  audioFile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackDto {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}

export interface UpdateTrackDto {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
  audioFile?: string;
}
export type Sort = 'title' | 'artist' | 'album' | 'createdAt' | '';
export type Order = 'asc' | 'desc' | '';

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: Sort;
  order?: Order;
  search?: string;
  genre?: string | null;
  artist?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BatchDeleteResponse {
  id: IdType;
  success: string[];
  failed: string[];
}
