import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ui/ThemeToggle'

const rules = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'Contains a number',     test: p => /\d/.test(p) },
  { label: 'Contains uppercase',    test: p => /[A-Z]/.test(p) },
]

export default function RegisterPage() {
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const { register, loading }   = useAuth()
  const navigate                = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm)
      return setError('Please fill in all fields.')
    if (form.password !== form.confirm)
      return setError('Passwords do not match.')
    if (form.password.length < 8)
      return setError('Password must be at least 8 characters.')

    const result = await register(form.name, form.email, form.password)
    if (result.success) {
      navigate('/app')
    } else {
      setError(result.error || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 grid-bg" style={{ background: 'var(--bg-primary)' }}>
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <ThemeToggle />
        <Link to="/" className="btn-ghost text-sm">← Back</Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-gradient">AI Detectify</span>
          </Link>
          <h1 className="text-2xl font-bold mt-4" style={{ color: 'var(--text-primary)' }}>Create your account</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Start detecting AI images for free</p>
        </div>

        <div className="glass-card p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Full name" value={form.name} onChange={set('name')} className="input-field pl-11" />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="email" placeholder="Email address" value={form.email} onChange={set('email')} className="input-field pl-11" />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                className="input-field pl-11 pr-11"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {form.password && (
              <div className="space-y-1.5 pl-1">
                {rules.map(({ label, test }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={12} className={test(form.password) ? 'text-primary-400' : ''} style={!test(form.password) ? { color: 'var(--text-secondary)' } : {}} />
                    <span className={test(form.password) ? 'text-primary-400' : ''} style={!test(form.password) ? { color: 'var(--text-secondary)' } : {}}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input type="password" placeholder="Confirm password" value={form.confirm} onChange={set('confirm')} className="input-field pl-11" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
