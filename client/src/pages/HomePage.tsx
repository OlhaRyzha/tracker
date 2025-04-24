import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROOT, TRACKS } from '@/constants/route.constant';

const HomePage: FC = () => (
  <section className='min-h-screen flex flex-col items-center justify-center gap-6 text-center'>
    <h1 className='text-3xl font-bold tracking-tight'>
      Welcome to Tracks&nbsp;Manager
    </h1>

    <p className='max-w-md text-muted-foreground'>
      Upload, edit and keep your music library organised in one place.
    </p>

    <Button
      asChild
      size='lg'>
      <Link
        to={`${ROOT}${TRACKS}`}
        data-testid='go-to-tracks'>
        Go to Tracks
      </Link>
    </Button>
  </section>
);

export default HomePage;
