import React, { useRef, useState, useEffect } from 'react';
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
import Waveform from './AudioWaveform';
import { BTNS_LABELS } from '@/constants/labels.constant';

interface AudioUploadModalProps {
  track: Track;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AudioUploadModal({
  track,
  open,
  onOpenChange,
}: AudioUploadModalProps) {
  const { mutate: upload } = useUploadTrackAudio();
  const { mutate: remove } = useDeleteTrackAudio();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null | undefined>(null);

  useEffect(() => {
    if (!selectedFile) {
      setSelectedUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setSelectedUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setSelectedUrl(null);
    };
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

  const handleSave = () => {
    if (!selectedFile) return;
    upload({ id: track.id, file: selectedFile });
    onOpenChange(false);
  };

  const handleRemove = () => {
    remove({ id: track.id });
    onOpenChange(false);
  };

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

        {selectedFile && selectedUrl && (
          <div className='mt-4'>
            <p className='text-sm mb-2'>Preview:</p>
            <Waveform
              url={selectedUrl}
              id={track?.id}
            />
            <div className='flex items-center space-x-2'>
              <span className='truncate'>{selectedFile.name}</span>
              <Button
                type='button'
                size='icon'
                variant='outline'
                onClick={() => setSelectedFile(null)}
                data-testid={`clear-selected-file-${track.id}`}>
                ✕
              </Button>
            </div>
          </div>
        )}

        {!selectedFile && track.audioFile && (
          <div className='mt-4'>
            <p className='text-sm mb-2'>Current file:</p>
            <audio
              controls
              src={track.audioFile}
              className='w-full mb-4'
              data-testid={`audio-player-${track.id}`}
            />
          </div>
        )}

        <DialogFooter className='flex justify-between'>
          {track.audioFile && !selectedFile && (
            <Button
              type='button'
              variant='destructive'
              onClick={handleRemove}
              data-testid={`delete-audio-${track.id}`}>
              {BTNS_LABELS.REMOVE_FILE}
            </Button>
          )}
          <div className='ml-auto flex space-x-2'>
            <Button
              type='button'
              onClick={handleChoose}
              data-testid={`choose-file-${track.id}`}>
              {BTNS_LABELS.CHOOSE_FILE}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}>
              {BTNS_LABELS.CANCEL}
            </Button>
            <Button
              type='button'
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
