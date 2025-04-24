import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QueryParams } from '@/types/shared/track';
import { ALL_ARTISTS, ALL_GENRES } from '@/constants/labels.constant';

export interface FiltersBarProps {
  params: QueryParams;
  setParams: (updater: (p: QueryParams) => QueryParams) => void;
  availableArtists: string[];
  availableGenres: string[];
}

export const FiltersBar: FC<FiltersBarProps> = ({
  params,
  setParams,
  availableArtists,
  availableGenres,
}) => {
  const onArtistChange = (v: string) =>
    setParams((p) => ({
      ...p,
      artist: v === ALL_ARTISTS ? null : v,
      page: 1,
    }));

  const onGenreChange = (v: string) =>
    setParams((p) => ({
      ...p,
      genre: v === ALL_GENRES ? null : v,
      page: 1,
    }));

  const FILTERS_LIST_KEY = [
    {
      value: params.artist ?? ALL_ARTISTS,
      onChange: onArtistChange,
      testid: 'filter-artist',
      placeholder: 'Filter by artist',
      availableOptions: availableArtists,
      selectedItem: ALL_ARTISTS,
    },
    {
      value: params.genre ?? ALL_GENRES,
      onChange: onGenreChange,
      testid: 'filter-genre',
      placeholder: 'Filter by genre',
      availableOptions: availableGenres,
      selectedItem: ALL_GENRES,
    },
  ];

  return (
    <div className='flex gap-4'>
      {FILTERS_LIST_KEY.map((filter) => (
        <Select
          key={filter.testid}
          value={filter.value}
          onValueChange={filter.onChange}
          data-testid={filter.testid}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={filter.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className='capitalize'
              value={filter.selectedItem}>
              {filter.selectedItem}
            </SelectItem>
            {filter.availableOptions?.map((option) => (
              <SelectItem
                key={option}
                value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
};
