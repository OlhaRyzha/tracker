import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from '@/components/ui/button';

interface WaveformProps {
  url: string;
  id?: string;
}

const Waveform = ({ url, id }: WaveformProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F46E5',
      progressColor: '#4338CA',
      cursorColor: 'transparent',
      height: 100,
    });

    wavesurferRef.current.load(url);

    wavesurferRef.current.on('play', () => setIsPlaying(true));
    wavesurferRef.current.on('pause', () => setIsPlaying(false));
    wavesurferRef.current.on('finish', () => setIsPlaying(false));

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [url]);

  const handlePlayPause = () => {
    wavesurferRef.current?.playPause();
  };

  return url ? (
    <div data-testid={`audio-progress-${id}`}>
      <div ref={waveformRef} />
      <Button
        type='button'
        data-testid={isPlaying ? `pause-button-${id}` : `play-button-${id}`}
        onClick={handlePlayPause}
        className='mt-2'
        variant='outline'
        size='sm'>
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
    </div>
  ) : null;
};

export default Waveform;
