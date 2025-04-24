import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PlayIcon, PauseIcon } from 'lucide-react';
import fileBroken from '@/assets/png-transparent-file-broken-sign-computer.png';
import { motion } from 'framer-motion';
import { Loader } from '@/components/Loader';

interface WaveformProps {
  url: string;
  id: string;
  isPlaying?: boolean;
  onPlayPause: (id: string) => void;
  minWidth?: number;
}

const Waveform = ({
  url,
  id,
  isPlaying,
  onPlayPause,
  minWidth,
}: WaveformProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#9ca3af',
      progressColor: '#374151',
      cursorColor: 'transparent',
      height: 40,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
    });

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Audio not found');

        await wavesurferRef.current?.load(url);
        setError(null);
      } catch (err) {
        setError('Audio file not available');
        console.error('Audio load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.play();
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <div
      className={`min-w-[200px] flex items-center gap-1 ${
        !error
          ? 'bg-gray-50 p-2 rounded-xl shadow-lg border border-gray-200'
          : ''
      }`}
      data-testid={`audio-progress-${id}`}>
      {isLoading && <Loader loading={isLoading} />}

      {error ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <img
                src={fileBroken}
                alt={error}
                className='w-10 h-10 opacity-50'
              />
            </TooltipTrigger>
            <TooltipContent>{error}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        !isLoading && (
          <motion.button
            type='button'
            onClick={() => onPlayPause(id)}
            className='p-2 bg-gray-800 hover:bg-gray-700 transition rounded-full shadow-md'
            whileTap={{ scale: 0.9 }}
            animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5 }}>
            {isPlaying ? (
              <PauseIcon className='text-white w-5 h-5' />
            ) : (
              <PlayIcon className='text-white w-5 h-5' />
            )}
          </motion.button>
        )
      )}

      {!error && (
        <div
          ref={waveformRef}
          className='flex-1 min-w-0'
        />
      )}
    </div>
  );
};

export default Waveform;
