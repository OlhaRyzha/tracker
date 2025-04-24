import { useMemo } from 'react';
import { Formik, Form, ErrorMessage, FormikHelpers } from 'formik';
import {
  useCreateTrack,
  useUpdateTrack,
} from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { useGenresQuery } from '@/utils/hooks/tanStackQuery/useGenresQuery';
import { DialogHeader, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Loader } from '../Loader';
import {
  formFields,
  getInitialValues,
  validationSchema,
} from '@/configs/formConfig';
import { Track, CreateTrackDto } from '@/types/shared/track';
import defaultCover from '@/assets/image_not_available.png';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';
import { BTNS_LABELS } from '@/constants/labels.constant';
import { Plus, X } from 'lucide-react';

export interface CreateTrackModalProps {
  track?: Track;
  onClose: () => void;
}

export default function CreateTrackModal({
  track,
  onClose,
}: CreateTrackModalProps) {
  const { data: genresList = [], isLoading: loadingGenres } = useGenresQuery();
  const { mutate: createTrack } = useCreateTrack();
  const { mutate: updateTrack } = useUpdateTrack();

  const initialValues = useMemo<CreateTrackDto>(
    () => getInitialValues(track),
    [track]
  );

  const handleSubmit = (
    values: CreateTrackDto,
    { setSubmitting }: FormikHelpers<CreateTrackDto>
  ) => {
    const operation = track
      ? () => updateTrack({ id: track.id, payload: values })
      : () => createTrack(values);

    operation();
    setSubmitting(false);
    onClose();
  };

  const toggleGenre = (
    genre: string,
    currentGenres: string[],
    setFieldValue: (field: string, value: any) => void
  ) => {
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];
    setFieldValue('genres', newGenres);
  };

  if (loadingGenres) {
    return <Loader loading={true} />;
  }

  return (
    <DialogContent
      onPointerDownOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      aria-describedby={undefined}
      className='bg-white rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto max-w-md'>
      <DialogHeader>
        <DialogTitle>
          {track ? BTNS_LABELS.UPDATE_TRACK : BTNS_LABELS.CREATE_TRACK}
        </DialogTitle>
      </DialogHeader>

      <Formik
        data-testid='track-form'
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting, dirty, isValid }) => (
          <Form className='space-y-4'>
            <div className='flex justify-center'>
              <img
                src={values.coverImage || defaultCover}
                alt='Cover preview'
                className='h-32 w-32 object-cover rounded-md shadow'
              />
            </div>

            {formFields.map((field) => (
              <FormField
                key={field.name}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                testId={field.testId}
                errorTestId={field.errorTestId}
              />
            ))}

            <div>
              <p className='text-sm font-medium mb-1'>Genres</p>
              <div
                className='flex flex-wrap gap-2'
                data-testid='genre-selector'>
                {genresList?.map((genre) => {
                  const selected = values.genres.includes(genre);

                  return (
                    <button
                      type='button'
                      key={genre}
                      onClick={() =>
                        toggleGenre(genre, values.genres, setFieldValue)
                      }
                      className={cn(
                        'flex items-center gap-1 rounded border px-2 py-1 text-sm transition-colors',
                        selected
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}>
                      {genre}
                      {selected ? (
                        <X
                          className='h-3 w-3 shrink-0  '
                          aria-label='Remove genre'
                        />
                      ) : (
                        <Plus
                          className='h-3 w-3 shrink-0 font-black'
                          aria-label='Add genre'
                        />
                      )}
                    </button>
                  );
                })}
              </div>
              <ErrorMessage
                name='genres'
                component='p'
                className='text-red-500 text-xs'
                data-testid='error-genre'
              />
            </div>

            <div className='flex justify-end space-x-3 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}>
                {BTNS_LABELS.CANCEL}
              </Button>
              <Button
                type='submit'
                data-testid='submit-button'
                disabled={isSubmitting || !dirty || !isValid}>
                {isSubmitting ? BTNS_LABELS.SAVING : BTNS_LABELS.SAVE}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </DialogContent>
  );
}
