import { useState, useRef, useCallback } from 'react'
import {
  Upload, ImageIcon, X, Zap, AlertTriangle, CheckCircle,
  Info, RotateCcw, Camera, Eye
} from 'lucide-react'
import { useHistory } from '../context/HistoryContext'
import { detectAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_MB = 10

const SCAN_STEPS = [
  'Loading image data...',
  'Preprocessing pixels...',
  'Running MobileNetV2 inference...',
  'Analysing feature maps...',
  'Computing confidence scores...',
  'Generating report...',
]

function ConfidenceRing({ value, label, color }) {
  const [animated, setAnimated] = useState(false)
  const r = 54
  const circ = 2 * Math.PI * r

  // trigger animation after mount
  if (!animated) setTimeout(() => setAnimated(true), 80)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={animated ? circ * (1 - value / 100) : circ}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono" style={{ color }}>{value}%</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

function ImagePreview({ file, onRemove }) {
  const [preview, setPreview] = useState(null)

  if (!preview && file) {
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="relative group">
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full max-h-72 object-contain rounded-xl border border-[var(--border)]"
        />
      ) : (
        <div className="w-full h-40 rounded-xl border border-[var(--border)] flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
          <ImageIcon size={32} style={{ color: 'var(--text-secondary)' }} />
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
      >
        <X size={13} />
      </button>
      <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <ImageIcon size={12} />
        <span className="truncate">{file?.name}</span>
        <span className="ml-auto flex-shrink-0">{(file?.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>
    </div>
  )
}

export default function DetectionPage() {
  const [file, setFile]       = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const fileRef               = useRef()
  const { addDetection }      = useHistory()

  const acceptFile = (f) => {
    setError('')
    if (!f) return
    if (!ACCEPTED.includes(f.type)) {
      setError('Only JPEG, PNG, and WebP images are supported.')
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large. Max ${MAX_MB}MB allowed.`)
      return
    }
    setFile(f)
    setResult(null)
  }

  const handleFileChange = (e) => acceptFile(e.target.files[0])
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    acceptFile(e.dataTransfer.files[0])
  }, [])

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)
    setError('')
    setScanStep(0)

    // animate scan steps
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 420))
      setScanStep(i)
    }

    try {
      const data = await detectAPI.detect(file)
      setResult(data)
      addDetection(data)
    } catch (err) {
      setError(err.message || 'Detection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const isAI   = result?.prediction === 'AI Generated'
  const verdict = isAI
    ? { label: 'AI Generated', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30', Icon: AlertTriangle }
    : { label: 'Real Image',   color: '#24a366', bg: 'bg-primary-500/10', border: 'border-primary-500/30', Icon: CheckCircle }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Image Detection</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Upload an image to detect whether it's AI-generated or a real photograph.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertTriangle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Upload area — only show when no result */}
      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !file && fileRef.current?.click()}
            className={`glass-card p-8 flex flex-col items-center justify-center gap-4 transition-all duration-200 min-h-64
              ${dragOver ? 'border-primary-500 bg-primary-500/5' : 'border-dashed hover:border-primary-500/50'}
              ${!file ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
            />
            {file ? (
              <ImagePreview file={file} onRemove={reset} />
            ) : (
              <>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
                  ${dragOver ? 'bg-primary-500/20 scale-110' : 'bg-primary-500/10'}`}>
                  <Upload size={28} className="text-primary-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {dragOver ? 'Drop to upload' : 'Drop image here'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
                  <p className="text-xs mt-3 font-mono" style={{ color: 'var(--text-secondary)' }}>
                    JPEG · PNG · WebP · max {MAX_MB}MB
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Instructions card */}
          <div className="glass-card p-6 flex flex-col gap-5">
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>How it works</h3>
            {[
              { icon: Camera, step: '1', text: 'Upload any image — photo, artwork, or screenshot.' },
              { icon: Zap,    step: '2', text: 'Our MobileNetV2 CNN model analyses pixel patterns, texture noise, and frequency artefacts.' },
              { icon: Eye,    step: '3', text: 'Get a confidence score showing the probability of AI generation vs real photography.' },
            ].map(({ icon: Icon, step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-primary-400" />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
              </div>
            ))}

            <div className="mt-auto pt-4 border-t border-[var(--border)]">
              <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <Info size={13} className="text-primary-400 flex-shrink-0 mt-0.5" />
                Images are processed in-memory and never stored on disk.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analyse button */}
      {file && !result && !loading && (
        <button
          onClick={analyze}
          className="btn-primary flex items-center gap-2"
        >
          <Zap size={16} />
          Analyse Image
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass-card p-12 text-center space-y-6">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Analysing image...</p>
            <p className="text-sm font-mono text-primary-400">{SCAN_STEPS[scanStep]}</p>
          </div>
          <div className="max-w-xs mx-auto h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Detection Results</h2>
            <button onClick={reset} className="btn-secondary text-sm">Analyse Another</button>
          </div>

          {/* Verdict banner */}
          <div className={`glass-card p-5 flex items-center gap-4 border ${verdict.border}`}>
            <div className={`w-12 h-12 rounded-2xl ${verdict.bg} flex items-center justify-center flex-shrink-0`}>
              <verdict.Icon size={22} style={{ color: verdict.color }} />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: verdict.color }}>{verdict.label}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {result.confidence
                  ? `${Math.round(result.confidence * 100)}% confidence · ${result.filename}`
                  : result.filename}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Probability rings */}
            <div className="glass-card p-8">
              <h3 className="font-semibold text-sm mb-6 text-center" style={{ color: 'var(--text-secondary)' }}>PROBABILITY BREAKDOWN</h3>
              <div className="flex justify-around">
                <ConfidenceRing
                  value={Math.round(result.ai_probability ?? 0)}
                  label="AI Generated"
                  color="#ef4444"
                />
                <ConfidenceRing
                  value={Math.round(result.real_probability ?? 0)}
                  label="Real Image"
                  color="#24a366"
                />
              </div>

              {/* Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-mono mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span>AI Generated</span>
                  <span>Real Photo</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden flex" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full bg-red-500 transition-all duration-1000"
                    style={{ width: `${result.ai_probability ?? 0}%` }}
                  />
                  <div
                    className="h-full bg-primary-500 transition-all duration-1000"
                    style={{ width: `${result.real_probability ?? 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary table */}
            <div className="space-y-4">
              <div className="glass-card p-5">
                <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>ANALYSIS SUMMARY</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Filename',         value: result.filename },
                    { label: 'Verdict',          value: result.prediction },
                    { label: 'Confidence',        value: `${Math.round((result.confidence ?? 0) * 100)}%` },
                    { label: 'AI Probability',   value: `${result.ai_probability ?? 0}%` },
                    { label: 'Real Probability', value: `${result.real_probability ?? 0}%` },
                    { label: 'Scanned at',        value: result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span
                        className="font-medium truncate ml-4 max-w-[55%] text-right"
                        style={{
                          color: label === 'Verdict'
                            ? (isAI ? '#ef4444' : '#24a366')
                            : 'var(--text-primary)',
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-4 flex items-start gap-3">
                <Info size={15} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Results are based on a MobileNetV2 CNN trained to detect GAN/diffusion model artefacts. Heavily edited photos may score higher. Always use human judgement alongside AI tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
