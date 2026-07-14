import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Plus, AlertCircle } from 'lucide-react';
import { Button } from './Button';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchField?: keyof T;
  addButtonLabel?: string;
  onAddClick?: () => void;
  onEditClick?: (item: T) => void;
  onDeleteClick?: (item: T) => void;
  onViewClick?: (item: T) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
  actionsLabel?: string;
}

export function DataTable<T extends { _id?: string; id?: string }>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchField,
  addButtonLabel,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onViewClick,
  isLoading = false,
  emptyStateMessage = 'No records found.',
  actionsLabel = 'Actions',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !searchField) return data;
    return data.filter((item) => {
      const value = item[searchField];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [data, searchTerm, searchField]);

  // Paginated data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleExport = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((item) =>
      columns
        .map((c) => {
          if (typeof c.accessor === 'function') {
            return '""';
          }
          return `"${String(item[c.accessor] || '')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'export_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-5">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/20 border border-zinc-900 p-4.5 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-950 border border-zinc-900 rounded-xl text-zinc-150 placeholder-zinc-550 focus:outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-150"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 py-2.5 rounded-xl font-semibold"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {onAddClick && addButtonLabel && (
            <Button
              variant="primary"
              size="sm"
              onClick={onAddClick}
              className="bg-emerald-650 hover:bg-emerald-555 text-white font-semibold py-2.5 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {addButtonLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-900 bg-zinc-955/40 max-h-[60vh] scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
        <table className="w-full border-collapse text-left text-sm text-zinc-300">
          <thead className="sticky top-0 z-10 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 font-bold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {(onEditClick || onDeleteClick || onViewClick) && (
                <th className="px-6 py-4 font-bold text-right">{actionsLabel}</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/30">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, idx) => (
                    <td key={idx} className="px-6 py-4.5">
                      <div className="h-4 bg-zinc-900 rounded-md w-3/4" />
                    </td>
                  ))}
                  {(onEditClick || onDeleteClick || onViewClick) && (
                    <td className="px-6 py-4.5">
                      <div className="h-4 bg-zinc-900 rounded-md w-1/2 ml-auto" />
                    </td>
                  )}
                </tr>
              ))
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEditClick || onDeleteClick || onViewClick ? 1 : 0)} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <AlertCircle className="h-8 w-8 text-zinc-600" />
                    <p className="text-sm font-semibold text-zinc-500">{emptyStateMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item, itemIdx) => (
                <tr
                  key={item._id || item.id || itemIdx}
                  className="hover:bg-zinc-900/30 transition-colors duration-150 even:bg-zinc-900/10"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4.5 font-medium ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {(onEditClick || onDeleteClick || onViewClick) && (
                    <td className="px-6 py-4.5 text-right space-x-2 whitespace-nowrap">
                      {onViewClick && (
                        <button
                          onClick={() => onViewClick(item)}
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 rounded-xl transition-all duration-150"
                        >
                          View
                        </button>
                      )}
                      {onEditClick && (
                        <button
                          onClick={() => onEditClick(item)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-955/20 text-emerald-400 border border-emerald-900/30 rounded-xl hover:bg-emerald-900/20 transition-all duration-150"
                        >
                          Edit
                        </button>
                      )}
                      {onDeleteClick && (
                        <button
                          onClick={() => onDeleteClick(item)}
                          className="px-3 py-1.5 text-xs font-semibold bg-red-955/20 text-red-400 border border-red-900/30 rounded-xl hover:bg-red-900/20 transition-all duration-150"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4 px-2">
          <p className="text-xs text-zinc-500 font-semibold">
            Showing <span className="text-zinc-350">{indexOfFirstItem + 1}</span> to{' '}
            <span className="text-zinc-350">
              {Math.min(indexOfLastItem, totalItems)}
            </span>{' '}
            of <span className="text-zinc-350">{totalItems}</span> records
          </p>
          <div className="flex items-center space-x-2.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-1 px-3 border-zinc-800 disabled:opacity-40 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-zinc-400 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-1 px-3 border-zinc-800 disabled:opacity-40 rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
