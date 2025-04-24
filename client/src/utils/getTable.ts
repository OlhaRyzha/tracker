import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface GetTableProps<T extends { id: string | number }> {
  tracks: T[];
  columns: ColumnDef<T>[];
  sorting: SortingState;
  handleSortingChange: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: Record<string, boolean>;
  setColumnVisibility: OnChangeFn<VisibilityState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setRowSelection: (updater: Record<string, boolean>) => void;
  meta?: {
    playingTrackId: string | null;
    setPlayingTrackId: (id: string | null) => void;
  };
}

export function getTable<T extends { id: string | number }>(
  props: GetTableProps<T>
) {
  const {
    tracks,
    columns,
    sorting,
    handleSortingChange,
    columnFilters,
    columnVisibility,
    rowSelection,
    setColumnVisibility,
    setColumnFilters,
    setRowSelection,
    meta,
  } = props;

  return useReactTable({
    data: tracks,
    columns,
    defaultColumn: {
      size: 150,
      minSize: 100,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    getRowId: (row) => String(row.id),
    meta,
    onColumnSizingChange: () => {},
  });
}
