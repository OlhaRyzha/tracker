import { validationMessages } from '@/constants/message.constant';
import { CreateTrackDto, Track } from '@/types/shared/track';
import * as Yup from 'yup';

export const validationSchema = Yup.object({
  title: Yup.string().required(validationMessages.required),
  artist: Yup.string().required(validationMessages.required),
  album: Yup.string().optional(),
  coverImage: Yup.string()
    .url(validationMessages.url)
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  genres: Yup.array()
    .of(Yup.string())
    .min(1, validationMessages.selectAtLeastOne),
});

export const getInitialValues = (track?: Track): CreateTrackDto => ({
  title: track?.title || '',
  artist: track?.artist || '',
  album: track?.album || '',
  coverImage: track?.coverImage || '',
  genres: track?.genres || [],
});

export const formFields = [
  {
    name: 'title',
    label: 'Title',
    placeholder: 'Track title',
    testId: 'input-title',
    errorTestId: 'error-title',
  },
  {
    name: 'artist',
    label: 'Artist',
    placeholder: 'Artist name',
    testId: 'input-artist',
    errorTestId: 'error-artist',
  },
  {
    name: 'album',
    label: 'Album',
    placeholder: 'Album name',
    testId: 'input-album',
    errorTestId: 'error-album',
  },
  {
    name: 'coverImage',
    label: 'Cover Image URL',
    placeholder: 'https://...',
    testId: 'input-cover-image',
    errorTestId: 'error-coverImage',
  },
];
