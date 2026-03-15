import { Brain, Shield, Zap, Code2, GraduationCap, Target, Github } from 'lucide-react'

const tech = [
  { name: 'React.js', desc: 'Frontend UI framework', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling', icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'React Router', desc: 'Client-side routing', icon: Code2, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { name: 'NLP Models', desc: 'AI detection engine', icon: Brain, color: 'text-primary-400', bg: 'bg-primary-500/10' },
  { name: 'Vite', desc: 'Build tool & dev server', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { name: 'Lucide Icons', desc: 'Icon library', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
]

const team = [
  { name: 'Yash Ghabale', role: 'Lead Developer', avatar: 'YG' },
  { name: 'Bhushan Jadhav', role: 'ML Engineer', avatar: 'BJ' },
  { name: 'Rahul Singh', role: 'UI/UX Designer', avatar: 'RS' },
  { name: 'Abhishek Yadav', role: 'ML Engineer', avatar: 'AY' },
  
]

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>About AI Detectify</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>The story behind the project.</p>
      </div>

      {/* Hero card */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="w-14 h-14 bg-primary-500/10 border border-primary-500/30 rounded-2xl flex items-center justify-center mb-5">
            <Brain size={28} className="text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>What is AI Detectify?</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            AI Detectify is a web-based tool designed to help educators, editors, researchers, and HR professionals identify AI-generated content with high accuracy. Built as a final year college project, it combines modern frontend development with natural language processing techniques to deliver real-time analysis.
          </p>
        </div>
      </div>

      {/* Purpose */}
      <div className="glass-card p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target size={20} className="text-primary-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Purpose of the Project</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              With the rise of large language models like GPT-4, Gemini, and Claude, AI-generated content has become increasingly indistinguishable from human writing. This creates challenges in academic integrity, journalism, and hiring. AI Detectify aims to address these challenges by providing an accessible, accurate, and privacy-respecting tool for content verification.
            </p>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {[
                'Promote academic integrity in schools and colleges',
                'Help editors verify content authenticity',
                'Assist HR teams in evaluating written submissions',
                'Raise awareness about AI-generated content',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Technology Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tech.map(({ name, desc, icon: Icon, color, bg }) => (
            <div key={name} className="glass-card p-4 hover:border-primary-500/30 transition-all hover:-translate-y-0.5">
              <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}>Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {team.map(({ name, role, avatar }) => (
            <div key={name} className="glass-card p-5 text-center hover:border-primary-500/30 transition-all">
              <div className="w-14 h-14 bg-primary-500/20 border-2 border-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-400 font-bold text-lg">
                {avatar}
              </div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* College info */}
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <GraduationCap size={24} className="text-primary-400" />
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Final Year College Project — 2026</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Department of Computer Science &amp; Engineering · B.Tech Final Year
          </p>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto btn-ghost flex items-center gap-2 text-sm flex-shrink-0"
        >
          <Github size={16} /> Source
        </a>
      </div>
    </div>
  )
}
