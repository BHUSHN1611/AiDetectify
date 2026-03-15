import { useState } from 'react'
import { User, Mail, Lock, Sun, Moon, Bell, Shield, Trash2, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [notifications, setNotifications] = useState({
    email: true,
    scan: true,
    weekly: false,
  })

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your account preferences.</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6 space-y-5">
        <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <User size={18} className="text-primary-400" /> Profile Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/20 border-2 border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-xl">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.plan}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" />
            </div>
          </div>
        </div>

        {/* <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>New Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input type="password" placeholder="Leave blank to keep current" className="input-field pl-10" />
          </div>
        </div> */}

        {/* <button onClick={handleSave} className={`btn-primary flex items-center gap-2 ${saved ? 'bg-primary-600' : ''}`}>
          {saved ? <><CheckCircle size={16} /> Saved!</> : 'Save Changes'}
        </button> */}
      </div>

      {/* Appearance */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          {theme === 'dark' ? <Moon size={18} className="text-primary-400" /> : <Sun size={18} className="text-primary-400" />}
          Appearance
        </h2>

        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div>
            <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Theme Mode</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Currently using {theme} mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${theme === 'dark' ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['Dark', 'Light'].map(t => (
            <button
              key={t}
              onClick={() => { if ((t === 'Dark') !== (theme === 'dark')) toggleTheme() }}
              className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                (t === 'Dark' && theme === 'dark') || (t === 'Light' && theme === 'light')
                  ? 'border-primary-500 text-primary-400 bg-primary-500/10'
                  : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-primary-500/40'
              }`}
            >
              {t === 'Dark' ? '🌙' : '☀️'} {t} Mode
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Bell size={18} className="text-primary-400" /> Notifications
        </h2>
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Get notified via email for completed scans' },
          { key: 'scan', label: 'Scan Alerts', desc: 'Alert when AI content is detected above 80%' },
          { key: 'weekly', label: 'Weekly Report', desc: 'Receive a weekly summary of your activity' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
            <button
              onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${notifications[key] ? 'bg-primary-500' : 'bg-gray-500/40'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${notifications[key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="glass-card p-6 border border-red-500/20 space-y-4">
        <h2 className="font-bold flex items-center gap-2 text-red-400">
          <Shield size={18} /> Danger Zone
        </h2>
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Delete Account</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Permanently delete your account and all data</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
