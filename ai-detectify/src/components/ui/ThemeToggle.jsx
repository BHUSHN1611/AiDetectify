import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center hover:border-primary-500/50 transition-all duration-200 hover:bg-primary-500/10"
      style={{ color: 'var(--text-secondary)' }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
