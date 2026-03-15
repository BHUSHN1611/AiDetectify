import { useEffect, useState } from 'react'
import { Search, AlertTriangle, CheckCircle, Minus, ScanLine, ImageIcon, RefreshCw } from 'lucide-react'
import { useHistory } from '../context/HistoryContext'
import { Link } from 'react-router-dom'

export default function HistoryPage() {
  const { history, stats, fetchHistory, loadingHistory } = useHistory()
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  useEffect(() => { fetchHistory() }, [])

  const filtered = history.filter(h => {
    const matchSearch =
      h.filename?.toLowerCase().includes(search.toLowerCase()) ||
      h.prediction?.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'ai'   && h.prediction === 'AI Generated') ||
      (filter === 'real' && h.prediction === 'Real Image')
    return matchSearch && matchFilter
  })

  const getIcon = (prediction) =>
    prediction === 'AI Generated'
      ? <AlertTriangle size={14} className="text-red-400" />
      : <CheckCircle   size={14} className="text-primary-400" />

  const getBadge = (prediction) =>
    prediction === 'AI Generated'
      ? <span className="badge-red">AI Generated</span>
      : <span className="badge-green">Real Image</span>

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Detection History</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>All your previous image detections.</p>
        </div>
        <button
          onClick={fetchHistory}
          disabled={loadingHistory}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <RefreshCw size={14} className={loadingHistory ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by filename or result..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all',  label: 'All' },
            { id: 'ai',   label: 'AI' },
            { id: 'real', label: 'Real' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === id
                  ? 'bg-primary-500 text-white'
                  : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-primary-500/40'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Scans',   value: stats.total_scans,   color: 'text-[var(--text-primary)]' },
          { label: 'AI Detected',   value: stats.ai_generated,  color: 'text-red-400' },
          { label: 'Real Verified', value: stats.real_images,   color: 'text-primary-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loadingHistory ? (
          <div className="flex items-center justify-center py-16 gap-3" style={{ color: 'var(--text-secondary)' }}>
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            Loading history...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon size={40} className="mx-auto mb-3 text-primary-500/30" />
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No detections found.</p>
            <Link to="/app/detect" className="text-sm text-primary-400 hover:text-primary-300 mt-2 inline-block">
              Upload your first image →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                  {['', 'Filename', 'Prediction', 'AI %', 'Real %', 'Confidence', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-5 py-4">{getIcon(scan.prediction)}</td>
                    <td className="px-5 py-4 max-w-[180px]">
                      <div className="flex items-center gap-2">
                        <ImageIcon size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                        <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{scan.filename}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">{getBadge(scan.prediction)}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold font-mono text-red-400">
                        {Math.round(scan.ai_probability ?? 0)}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold font-mono text-primary-400">
                        {Math.round(scan.real_probability ?? 0)}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div
                            className={`h-full rounded-full ${scan.prediction === 'AI Generated' ? 'bg-red-500' : 'bg-primary-500'}`}
                            style={{ width: `${Math.round((scan.confidence ?? 0) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {Math.round((scan.confidence ?? 0) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(scan.timestamp).toLocaleDateString()}<br />
                      <span className="text-[10px]">{new Date(scan.timestamp).toLocaleTimeString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
