import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import ThemeToggle from '../ui/ThemeToggle'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass-card px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-gradient">AI Detectify</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="btn-ghost text-sm">Features</a>
          <a href="#how-it-works" className="btn-ghost text-sm">How it Works</a>
          <a href="#testimonials" className="btn-ghost text-sm">Reviews</a>
          <ThemeToggle />
          <Link to="/login" className="btn-ghost text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="btn-ghost p-2">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-card mt-2 mx-0 p-4 flex flex-col gap-2">
          <a href="#features" className="nav-link" onClick={() => setOpen(false)}>Features</a>
          <a href="#how-it-works" className="nav-link" onClick={() => setOpen(false)}>How it Works</a>
          <a href="#testimonials" className="nav-link" onClick={() => setOpen(false)}>Reviews</a>
          <Link to="/login" className="nav-link" onClick={() => setOpen(false)}>Login</Link>
          <Link to="/register" className="btn-primary text-center" onClick={() => setOpen(false)}>Get Started</Link>
        </div>
      )}
    </nav>
  )
}
