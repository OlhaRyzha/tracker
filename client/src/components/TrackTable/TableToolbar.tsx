import { Input } from '@/components/ui/input';
import { FiltersBar } from '../FiltersBar';
import { Button } from '@/components/ui/button';
import { initialParams } from '@/configs/tableConfig';
import { AlertDialogComponent } from '../AlertDialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { QueryParams, Track } from '@/types/shared/track';
import { Table } from '@tanstack/react-table';
import { useBulkDeleteTracks } from '@/utils/hooks/tanStackQuery/useTracksQuery';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useGenresQuery } from '@/utils/hooks/tanStackQuery/useGenresQuery';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectSelectMode,
  setSelectMode,
} from '@/store/slices/table/tableSlice';
import { BTNS_LABELS } from '@/constants/labels.constant';

interface TableToolbarProps {
  search: string;
  setSearch: (value: string) => void;
  params: QueryParams;
  setParams: (updater: (p: QueryParams) => QueryParams) => void;
  availableArtists: string[];
  selectedIds: string[];
  table: Table<Track>;
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
}

export const TableToolbar = ({
  search,
  setSearch,
  params,
  setParams,
  availableArtists,
  selectedIds,
  table,
  setRowSelection,
}: TableToolbarProps) => {
  const dispatch = useAppDispatch();

  const selectMode = useAppSelector(selectSelectMode);

  const { data: allGenres = [] } = useGenresQuery();
  const bulkDeleteMutation = useBulkDeleteTracks();

  const [localSearch, setLocalSearch] = useState(search);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, setSearch]);

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        setRowSelection({});
        setDeleteDialogOpen(false);
      },
      onError: () => {
        setDeleteDialogOpen(true);
      },
    });
  };

  const handleReset = () => {
    setParams((p) => ({ ...p, ...initialParams }));
    setLocalSearch(initialParams.search || '');
  };

  return (
    <div className='flex items-center gap-4 py-2'>
      <Input
        placeholder='Search…'
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className='max-w-xs relative'
        data-testid='search-input'
      />

      <FiltersBar
        params={params}
        setParams={setParams}
        availableArtists={availableArtists}
        availableGenres={allGenres}
      />

      {selectedIds?.length > 0 && (
        <AlertDialogComponent
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          data-testid='confirm-dialog'
          trigger={
            <Button
              type='button'
              variant='destructive'
              data-testid='bulk-delete-button'>
              {BTNS_LABELS.DELETE_SELECTED_ITEMS(selectedIds.length)}
            </Button>
          }
          title='Delete selected tracks?'
          description='This will permanently delete all selected tracks.'
          confirmText='Delete'
          cancelText='Cancel'
          onConfirm={handleBulkDelete}
        />
      )}

      <Button
        type='button'
        onClick={handleReset}
        data-testid='reset-button'>
        {BTNS_LABELS.RESET_ALL}
      </Button>

      <Button
        type='button'
        onClick={() => dispatch(setSelectMode(!selectMode))}
        data-testid='select-mode-toggle'>
        {selectMode
          ? BTNS_LABELS.DISABLE_BULK_SELECT
          : BTNS_LABELS.ENABLE_BULK_SELECT}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            variant='outline'
            className='ml-auto'>
            Columns <ChevronDown className='ml-1 h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)}
                data-testid={`column-toggle-${col.id}`}>
                {col.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
