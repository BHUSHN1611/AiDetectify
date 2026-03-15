import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Zap, LayoutDashboard, ScanLine, History, Info,
  Mail, Settings, LogOut, Menu, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../ui/ThemeToggle'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',   to: '/app' },
  { icon: ScanLine,        label: 'AI Detection', to: '/app/detect' },
  { icon: History,         label: 'History',      to: '/app/history' },
  { icon: Info,            label: 'About',        to: '/app/about' },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location  = useLocation()
  const { user, logout } = useAuth()
  const navigate  = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (to) =>
    to === '/app' ? location.pathname === '/app' : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 flex flex-col
        border-r border-[var(--border)] transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `} style={{ background: 'var(--bg-secondary)' }}>
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-gradient">AI Detectify</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {isActive(to) && <ChevronRight size={14} className="ml-auto text-primary-500" />}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center gap-3 px-3">
            <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="nav-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-30 px-6 py-4 border-b border-[var(--border)] flex items-center justify-between"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <button onClick={() => setSidebarOpen(true)} className="md:hidden btn-ghost p-2">
            <Menu size={20} />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="badge-green">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse-slow" />
              System Online
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
