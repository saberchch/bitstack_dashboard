import { getPageNumbers } from '../utils/publicSessionsPagination';

export default function PublicSessionsPagination({
  currentPage,
  totalPages,
  totalItems,
  rangeStart,
  rangeEnd,
  onPageChange,
}) {
  if (totalItems === 0 || totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mt-10 flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-bold text-gray-400">
          Showing {rangeStart}–{rangeEnd} of {totalItems} session{totalItems !== 1 ? 's' : ''}
        </p>
        <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="bg-bts-gold h-full transition-all duration-300"
            style={{ width: `${(rangeEnd / totalItems) * 100}%` }}
          />
        </div>
      </div>
      <nav className="flex items-center gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]!">chevron_left</span>
        </button>

        {pages[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-xs cursor-pointer"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-1 text-gray-300 text-xs font-bold">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              page === currentPage
                ? 'bg-bts-gold text-white shadow-sm'
                : 'border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-brand-dark'
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-gray-300 text-xs font-bold">...</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all text-xs cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]!">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
