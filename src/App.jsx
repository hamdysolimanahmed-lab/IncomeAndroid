import { useState, useEffect, useMemo } from 'react';
import { fetchData } from './lib/api';
import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { Filters } from './components/Filters';
import { DataTable } from './components/DataTable';
import { Modal } from './components/ui/Modal';
import { TransactionDetails } from './components/TransactionDetails';
import { Button } from './components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true); // Dark mode by default

  // Filters
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'transaction_date_iso', direction: 'desc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal state for transaction details
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    // Always start with dark mode
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await fetchData();
      setData(result.rows || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        (row.payer && row.payer.toLowerCase().includes(searchLower)) ||
        (row.description && row.description.toLowerCase().includes(searchLower)) ||
        (row.amount && row.amount.toLowerCase().includes(searchLower));

      const matchesMonth = month ? row.mo === month : true;
      const matchesYear = year ? row.yr === year : true;

      return matchesSearch && matchesMonth && matchesYear;
    });
  }, [data, search, month, year]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric sorting for amount_value
        if (sortConfig.key === 'amount_value') {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + (row.amount_value || 0), 0);
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="container py-4 animate-fade-in">
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Error: {error}
          </div>
        ) : (
          <>
            <Summary totalRows={filteredData.length} totalAmount={totalAmount} />

            <Filters
              search={search} setSearch={setSearch}
              month={month} setMonth={setMonth}
              year={year} setYear={setYear}
              onClear={() => { setSearch(''); setMonth(''); setYear(''); }}
            />

            <DataTable
              data={paginatedData}
              sortConfig={sortConfig}
              onSort={handleSort}
              isLoading={loading}
              onRowClick={(row) => setSelectedTransaction(row)}
              selectedTransaction={selectedTransaction}
            />

            {!loading && sortedData.length > 0 && (
              <div className="glass-dark p-4 rounded-2xl border border-white/10 mt-4">
                <div className="row align-items-center g-3">
                  <div className="col-12 col-md-6 text-sm text-slate-400 font-arabic mb-3 mb-md-0">
                    <span className="text-white font-bold">{((currentPage - 1) * pageSize) + 1}</span>
                    {' '}إلى{' '}
                    <span className="text-white font-bold">{Math.min(currentPage * pageSize, sortedData.length)}</span>
                    {' '}من{' '}
                    <span className="text-white font-bold">{sortedData.length}</span>
                    {' '}معاملة
                  </div>

                  <div className="col-12 col-md-6 d-flex align-items-center justify-content-md-end gap-3">
                    <select
                      className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-arabic backdrop-blur"
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    >
                      <option value={10} className="bg-slate-900">10 لكل صفحة</option>
                      <option value={25} className="bg-slate-900">25 لكل صفحة</option>
                      <option value={50} className="bg-slate-900">50 لكل صفحة</option>
                    </select>

                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="bg-white/5 hover:bg-white/10 border-white/10 text-white disabled:opacity-30"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-white/5 hover:bg-white/10 border-white/10 text-white disabled:opacity-30"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="تفاصيل المعاملة"
      >
        <TransactionDetails transaction={selectedTransaction} />
      </Modal>
    </div>
  );
}

export default App;
