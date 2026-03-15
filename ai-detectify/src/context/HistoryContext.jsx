import { createContext, useContext, useState, useCallback } from 'react'
import { detectAPI } from '../services/api'

const HistoryContext = createContext()

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ total_scans: 0, ai_generated: 0, real_images: 0 })
  const [loadingHistory, setLoadingHistory] = useState(false)

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true)
    try {
      const data = await detectAPI.history(50, 0)
      setHistory(data.items || [])
    } catch {
      // silently fail; user may not be logged in yet
    } finally {
      setLoadingHistory(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const data = await detectAPI.stats()
      setStats(data)
    } catch {
      // silently fail
    }
  }, [])

  const addDetection = (item) => {
    setHistory((prev) => [item, ...prev])
    setStats((s) => ({
      total_scans: s.total_scans + 1,
      ai_generated: s.ai_generated + (item.prediction === 'AI Generated' ? 1 : 0),
      real_images: s.real_images + (item.prediction === 'Real Image' ? 1 : 0),
    }))
  }

  return (
    <HistoryContext.Provider
      value={{ history, stats, loadingHistory, fetchHistory, fetchStats, addDetection }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)
