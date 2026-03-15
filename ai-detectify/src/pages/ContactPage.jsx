import { useState } from 'react'
import { Mail, MessageSquare, Send, CheckCircle, MapPin, Github, Twitter } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    setErrors({})
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Message Sent!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
        <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-primary">
          Send Another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contact Us</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info cards */}
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email', value: 'hello@aidetectify.app', color: 'text-primary-400', bg: 'bg-primary-500/10' },
            { icon: MessageSquare, title: 'Discord', value: 'discord.gg/aidetectify', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: MapPin, title: 'Based In', value: 'Mumbai, India', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map(({ icon: Icon, title, value, color, bg }) => (
            <div key={title} className="glass-card p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{title}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            </div>
          ))}

          <div className="glass-card p-4">
            <p className="text-xs mb-3 font-semibold" style={{ color: 'var(--text-secondary)' }}>FOLLOW US</p>
            <div className="flex gap-2">
              {[Github, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center hover:border-primary-500/50 hover:text-primary-400 transition-all" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Name</label>
                <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} className="input-field" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} className="input-field" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Subject (optional)</label>
              <input type="text" placeholder="What's this about?" value={form.subject} onChange={set('subject')} className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Message</label>
              <textarea
                placeholder="Tell us more..."
                value={form.message}
                onChange={set('message')}
                rows={5}
                className="input-field resize-none"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
              ) : (
                <><Send size={16} /> Send Message</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
