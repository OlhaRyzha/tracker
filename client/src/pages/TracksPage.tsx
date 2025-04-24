import TrackTable from '@/components/TrackTable/TrackTable';
import CreateTrackModal from '@/components/Modal/CreateTrackModal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { TRACKS_LIST_KEY } from '@/constants/table.constants';
import { BTNS_LABELS } from '@/constants/labels.constant';

export default function TracksPage() {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <section className='p-6'>
        <h1
          data-testid='tracks-header'
          className='text-2xl font-bold mb-4 capitalize'>
          {TRACKS_LIST_KEY}
        </h1>

        <Dialog
          open={open}
          onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type='button'
              data-testid='create-track-button'
              className='mb-4'>
              {BTNS_LABELS.CREATE_TRACK}
            </Button>
          </DialogTrigger>
          <CreateTrackModal onClose={() => setOpen(false)} />
        </Dialog>

        <TrackTable />
      </section>
    </main>
  );
}
