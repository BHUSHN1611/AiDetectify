import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ScanLine, TrendingUp, Clock, CheckCircle,
  ArrowRight, BarChart3, Zap, AlertTriangle, ImageIcon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useHistory } from '../context/HistoryContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const { history, stats, fetchHistory, fetchStats, loadingHistory } = useHistory()

  useEffect(() => {
    fetchHistory()
    fetchStats()
  }, [])

  const recentScans = history.slice(0, 5)

  const getStatusBadge = (prediction) => {
    if (prediction === 'AI Generated') return <span className="badge-red">AI Generated</span>
    return <span className="badge-green">Real Image</span>
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Here's your AI image detection overview.
          </p>
        </div>
        <Link to="/app/detect" className="btn-primary flex items-center gap-2 text-sm self-start sm:self-auto">
          <Zap size={16} /> Detect Image
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: ScanLine,
            label: 'Total Scans',
            value: stats.total_scans,
            sub: 'images analysed',
            color: 'text-primary-400',
            bg: 'bg-primary-500/10',
          },
          {
            icon: AlertTriangle,
            label: 'AI Detected',
            value: stats.ai_generated,
            sub: 'AI-generated images',
            color: 'text-red-400',
            bg: 'bg-red-500/10',
          },
          {
            icon: CheckCircle,
            label: 'Real Images',
            value: stats.real_images,
            sub: 'verified real photos',
            color: 'text-primary-400',
            bg: 'bg-primary-500/10',
          },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={18} className={color} />
            </div>
            <div className={`text-3xl font-bold font-mono mb-1 ${color}`}>{value}</div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* AI vs Real ratio bar */}
      {stats.total_scans > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Detection Breakdown</span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {stats.ai_generated} AI · {stats.real_images} Real
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--border)' }}>
            <div
              className="h-full bg-red-500 transition-all duration-1000"
              style={{ width: `${(stats.ai_generated / stats.total_scans) * 100}%` }}
            />
            <div
              className="h-full bg-primary-500 transition-all duration-1000"
              style={{ width: `${(stats.real_images / stats.total_scans) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              AI Generated ({Math.round((stats.ai_generated / stats.total_scans) * 100)}%)
            </span>
            <span className="flex items-center gap-1.5">
              Real Image ({Math.round((stats.real_images / stats.total_scans) * 100)}%)
              <span className="w-2 h-2 rounded-full bg-primary-500 inline-block" />
            </span>
          </div>
        </div>
      )}

      {/* Recent Scans */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Recent Detections</h2>
          <Link to="/app/history" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loadingHistory ? (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : recentScans.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={40} className="mx-auto mb-3 text-primary-500/40" />
            <p style={{ color: 'var(--text-secondary)' }}>
              No detections yet.{' '}
              <Link to="/app/detect" className="text-primary-400">Upload your first image!</Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--border)]">
                  {scan.prediction === 'AI Generated'
                    ? <AlertTriangle size={14} className="text-red-400" />
                    : <CheckCircle size={14} className="text-primary-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{scan.filename}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(scan.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: scan.prediction === 'AI Generated' ? '#ef4444' : '#24a366' }}
                  >
                    {Math.round(scan.ai_probability ?? 0)}% AI
                  </span>
                  {getStatusBadge(scan.prediction)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/app/detect" className="glass-card p-6 flex items-center gap-4 hover:border-primary-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
            <ScanLine size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Detection</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Upload an image to analyse</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link to="/app/history" className="glass-card p-6 flex items-center gap-4 hover:border-primary-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
            <Clock size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>View History</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Browse all past results</p>
          </div>
          <ArrowRight size={18} className="ml-auto text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  )
}
