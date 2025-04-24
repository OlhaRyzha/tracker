import type { FC } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { generatePageNumbers } from '@/utils/generatePageNumbers';
import { TABLE_SIZES } from '@/constants/table.constants';

interface PaginationControlsProps {
  totalItems: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
  totalPages: number;
  handleLimitChange: (page: number) => void;
  limit: number;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  totalItems,
  currentPage,
  handlePageChange,
  totalPages,
  handleLimitChange,
  limit,
}) => {
  return (
    <div className='flex items-center justify-between py-3 text-sm text-muted-foreground'>
      <div className='flex items-center gap-2 shrink-0'>
        Total tracks: <b>{totalItems}</b>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              disabled={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePageChange(currentPage - 1);
              }}
              data-testid='pagination-prev'
            />
          </PaginationItem>

          {generatePageNumbers(totalPages, currentPage).map((p, i) => (
            <PaginationItem key={i}>
              {p === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href='#'
                  isActive={p === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePageChange(p as number);
                  }}>
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href='#'
              disabled={currentPage >= totalPages}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePageChange(currentPage + 1);
              }}
              data-testid='pagination-next'
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <select
        value={limit}
        onChange={(e) => handleLimitChange(Number(e.target.value))}
        className='text-sm p-1 border rounded'>
        {TABLE_SIZES.map((sz) => (
          <option
            key={sz}
            value={sz}>
            {sz} / page
          </option>
        ))}
      </select>
    </div>
  );
};
export default PaginationControls;
