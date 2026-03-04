import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../FireBase';
import { MessageSquare, RefreshCw, Star, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_LABELS = {
  predare: '📚 Modul de predare',
  platforma: '💻 Funcționalități platformă',
  continut: '📝 Conținut & materiale',
  altele: '💬 Altele',
};

const CATEGORY_COLORS = {
  predare: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  platforma: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  continut: 'bg-green-900/40 text-green-300 border-green-700/50',
  altele: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
};

const StarDisplay = ({ rating }) => {
  if (!rating) return <span className="text-gray-500 text-sm">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? 'text-amber-400' : 'text-gray-600'}>
          ★
        </span>
      ))}
      <span className="ml-1 text-sm text-gray-400">{rating}/5</span>
    </div>
  );
};

const toDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds != null) return new Date(timestamp.seconds * 1000);
  const d = new Date(timestamp);
  return isNaN(d.getTime()) ? null : d;
};

const formatDate = (timestamp) => {
  const d = toDate(timestamp);
  if (!d) return '—';
  return d.toLocaleString('ro-RO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const STATUS_OPTIONS = [
  { value: 'stand_by', label: '⏳ Stand By', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  { value: 'in_lucru', label: '🔧 În Lucru', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { value: 'rezolvat', label: '✅ Rezolvat', color: 'bg-green-500/20 text-green-300 border-green-500/40' },
];

const getStatusStyle = (status) => {
  const found = STATUS_OPTIONS.find((s) => s.value === status);
  return found ? found.color : 'bg-gray-500/20 text-gray-300 border-gray-500/40';
};

const getStatusOption = (status) => STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

const ConfirmStatusModal = ({ pending, onConfirm, onCancel, saving }) => {
  if (!pending) return null;
  const from = getStatusOption(pending.currentStatus);
  const to = getStatusOption(pending.newStatus);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-2">Schimbare status</h3>
        <p className="text-gray-400 text-sm mb-5">
          Vrei să schimbi statusul din{' '}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-semibold ${from.color}`}>{from.label}</span>
          {' '}în{' '}
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-semibold ${to.color}`}>{to.label}</span>
          ?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Anulează
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            Confirmă
          </button>
        </div>
      </div>
    </div>
  );
};

const PER_PAGE = 5;

const FeedbackArmyTab = ({ getCachedData, setCachedData, clearCachedData }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingChange, setPendingChange] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchFeedbacks = async (forceRefresh = false) => {
    const cacheKey = 'dashboard_army_feedback';

    if (!forceRefresh && getCachedData) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        console.log('📦 Feedback Army încărcat din cache');
        setFeedbacks(cached);
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'ArmyFeedback'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data);
      if (setCachedData) setCachedData(cacheKey, data);
    } catch (err) {
      console.error('Eroare fetch feedback Army:', err);
      setError('Eroare la încărcarea feedback-urilor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'ArmyFeedback', id), { status: newStatus });
      setFeedbacks((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
        if (setCachedData) setCachedData('dashboard_army_feedback', updated);
        return updated;
      });
    } catch (err) {
      console.error('Eroare la actualizarea statusului:', err);
    } finally {
      setSaving(false);
      setPendingChange(null);
    }
  };

  // Filtered + sorted data
  const filtered = feedbacks
    .filter((f) => filterCategory === 'all' || f.category === filterCategory)
    .filter((f) => {
      if (statusFilter === 'all') return true;
      return (f.status || 'stand_by') === statusFilter;
    })
    .slice()
    .sort((a, b) => {
      const aDate = toDate(a.createdAt) ?? new Date(0);
      const bDate = toDate(b.createdAt) ?? new Date(0);
      return sortBy === 'asc' ? aDate - bDate : bDate - aDate;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleFilterChange = (val) => {
    setFilterCategory(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  // Stats by category
  const stats = Object.keys(CATEGORY_LABELS).map((cat) => ({
    cat,
    count: feedbacks.filter((f) => f.category === cat).length,
    avgRating: (() => {
      const vals = feedbacks
        .filter((f) => f.category === cat && f.rating)
        .map((f) => f.rating);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
    })(),
  }));

  const overallAvg = (() => {
    const vals = feedbacks.filter((f) => f.rating).map((f) => f.rating);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  })();

  return (
    <div className="space-y-6">
      <ConfirmStatusModal
        pending={pendingChange}
        saving={saving}
        onConfirm={() => handleStatusChange(pendingChange.id, pendingChange.newStatus)}
        onCancel={() => setPendingChange(null)}
      />
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Feedback Army</h2>
          <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded-full text-xs font-semibold">
            {feedbacks.length} total
          </span>
        </div>
        <button
          onClick={() => {
            if (clearCachedData) clearCachedData('dashboard_army_feedback');
            fetchFeedbacks(true);
          }}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Reîncarcă
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 col-span-2 md:col-span-1">
          <div className="text-3xl font-bold text-white">{feedbacks.length}</div>
          <div className="text-xs text-gray-400 mt-1">Total feedbackuri</div>
          {overallAvg && (
            <div className="flex items-center gap-1 mt-2 text-amber-400 text-sm font-semibold">
              <Star className="w-3.5 h-3.5" />
              {overallAvg} medie generală
            </div>
          )}
        </div>
        {stats.map(({ cat, count, avgRating }) => (
          <div
            key={cat}
            className={`rounded-xl p-4 border ${CATEGORY_COLORS[cat] || 'bg-gray-800/50 border-gray-700/50 text-gray-300'}`}
          >
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs mt-1 opacity-80">{CATEGORY_LABELS[cat]}</div>
            {avgRating && (
              <div className="text-xs mt-1 opacity-70">★ {avgRating}</div>
            )}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Filtrează:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            Toate ({feedbacks.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <button
              key={val}
              onClick={() => handleFilterChange(val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                filterCategory === val
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {label} ({feedbacks.filter((f) => f.category === val).length})
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:border-blue-400 cursor-pointer"
          >
            <option value="all">Toate</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <span className="text-sm text-gray-400">Sortare:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-600 focus:border-blue-400 cursor-pointer"
          >
            <option value="desc">Cele mai recente</option>
            <option value="asc">Cele mai vechi</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Se încarcă feedbackurile...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Niciun feedback găsit.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-700/50">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/70 border-b border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Categorie</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Feedback</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Dată</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {paginated.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition-colors align-top">
                    <td className="px-4 py-4 text-gray-500 text-xs">
                      {(currentPage - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          CATEGORY_COLORS[item.category] || 'bg-gray-700/50 text-gray-300 border-gray-600'
                        }`}
                      >
                        {CATEGORY_LABELS[item.category] || item.category || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StarDisplay rating={item.rating} />
                    </td>
                    <td className="px-4 py-4 max-w-lg">
                      <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">{item.feedback}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={item.status || 'stand_by'}
                        onChange={(e) => setPendingChange({ id: item.id, currentStatus: item.status || 'stand_by', newStatus: e.target.value })}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none bg-transparent ${getStatusStyle(item.status || 'stand_by')}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value} className="bg-gray-800 text-white">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-400">
                {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} din {filtered.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackArmyTab;
