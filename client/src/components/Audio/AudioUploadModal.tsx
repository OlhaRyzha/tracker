import React, { useRef, useState, useEffect, lazy, Suspense } from 'react';
import { HiXMark } from 'react-icons/hi2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  useUploadTrackAudio,
  useDeleteTrackAudio,
} from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { validateAudioFile } from '@/utils/audioUpload';
import type { Track } from '@/types/shared/track';
import { BTNS_LABELS } from '@/constants/labels.constant';
import { Loader } from '../Loader';

const Waveform = lazy(() => import('@/components/Audio/AudioWaveform'));

interface AudioUploadModalProps {
  track: Track;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded?: () => void;
}

export function AudioUploadModal({
  track,
  open,
  onOpenChange,
  onUploaded,
}: AudioUploadModalProps) {
  const { mutateAsync: upload, isPending } = useUploadTrackAudio();
  const { mutate: remove } = useDeleteTrackAudio();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null | undefined>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setSelectedUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleChoose = () => fileRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    validateAudioFile(file).then(({ valid, error }) => {
      if (!valid) {
        setError(error);
        setSelectedFile(null);
      } else {
        setError(null);
        setSelectedFile(file);
      }
    });
  };

  const handlePlayPause = (id: string) => {
    setPlayingTrackId((prev) => (prev === id ? null : id));
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      await upload({ id: track?.id, file: selectedFile });
      onOpenChange(false);
      onUploaded?.();
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };
  const handleRemove = () => {
    remove({ id: track.id });
    onOpenChange(false);
  };
  if (isPending) {
    return <Loader loading={isPending} />;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Audio for “{track.title}”</DialogTitle>
          <DialogDescription>
            {track.audioFile
              ? 'Replace or remove the current audio file.'
              : 'Select an audio file to upload.'}
          </DialogDescription>
        </DialogHeader>

        <input
          ref={fileRef}
          type='file'
          accept='audio/*'
          className='hidden'
          onChange={handleChange}
        />

        {error && (
          <p
            className='mt-2 text-sm text-red-600'
            role='alert'>
            {error}
          </p>
        )}

        <div className='mt-4 space-y-4'>
          {selectedFile && selectedUrl ? (
            <>
              <p className='text-sm mb-2'>Preview:</p>
              <Suspense fallback={<Loader loading />}>
                <Waveform
                  url={selectedUrl}
                  id='preview'
                  isPlaying={playingTrackId === 'preview'}
                  onPlayPause={handlePlayPause}
                />
              </Suspense>
              <div className='flex items-center gap-2 mt-2'>
                <span className='truncate text-sm'>{selectedFile.name}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className='text-gray-500 hover:text-gray-700'
                  data-testid={`clear-selected-file-${track.id}`}>
                  <HiXMark className='h-4 w-4' />
                </button>
              </div>
            </>
          ) : track.audioFile ? (
            <>
              <p className='text-sm mb-2'>Current file:</p>
              <Suspense fallback={<Loader loading />}>
                <Waveform
                  url={`${import.meta.env.VITE_API_BASE_URL}/api/files/${
                    track.audioFile
                  }`}
                  id={track.id}
                  isPlaying={playingTrackId === track.id}
                  onPlayPause={handlePlayPause}
                />
              </Suspense>
            </>
          ) : null}
        </div>

        <DialogFooter className='flex justify-between mt-4'>
          {track.audioFile && !selectedFile && (
            <Button
              variant='destructive'
              onClick={handleRemove}
              data-testid={`delete-audio-${track.id}`}>
              {BTNS_LABELS.REMOVE_FILE}
            </Button>
          )}
          <div className='flex gap-2 ml-auto'>
            <Button
              variant='outline'
              onClick={() => onOpenChange(false)}>
              {BTNS_LABELS.CANCEL}
            </Button>
            <Button
              onClick={handleChoose}
              data-testid={`choose-file-${track.id}`}>
              {BTNS_LABELS.CHOOSE_FILE}
            </Button>
            <Button
              disabled={!selectedFile}
              onClick={handleSave}
              data-testid={`save-audio-${track.id}`}>
              {BTNS_LABELS.SAVE}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
