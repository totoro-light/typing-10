import { useState } from 'react'
import { getUserData } from '../utils/storage'
import lessons from '../data/lessons.json'

const PALETTE = ['--green', '--blue', '--orange', '--pink', '--purple', '--teal']

const CATEGORY_META = {
  beginner: { label: 'Beginner',  icon: '🌱', color: 'var(--green)'  },
  practice: { label: 'Practice',  icon: '🌿', color: 'var(--blue)'   },
  speed:    { label: 'Speed',     icon: '⚡', color: 'var(--orange)' },
}

const THEME_OPTIONS = [
  { val: 'system', icon: '💻' },
  { val: 'light',  icon: '☀️' },
  { val: 'dark',   icon: '🌙' },
]

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff
  return `var(${PALETTE[Math.abs(h) % PALETTE.length]})`
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// group lessons preserving declaration order
const CATEGORIES = ['beginner', 'practice', 'speed']
const grouped = CATEGORIES.reduce((acc, cat) => {
  acc[cat] = lessons.filter(l => l.category === cat)
  return acc
}, {})

export default function LessonMap({ user, theme, onThemeChange, onSelectLesson, onLogout }) {
  const userData = getUserData(user)
  const { completedLessons } = userData
  const doneCount = Object.keys(completedLessons).length
  const pct = Math.round((doneCount / lessons.length) * 100)

  const nextTheme = THEME_OPTIONS[(THEME_OPTIONS.findIndex(t => t.val === theme) + 1) % THEME_OPTIONS.length]

  return (
    <div className="lesson-map">
      <header className="lm-header">
        <span className="lm-logo">⌨️</span>
        <span className="lm-title">Typing Practice</span>

        <div className="lm-user-badge">
          <div className="lm-avatar" style={{ background: avatarColor(user) }}>
            {initials(user)}
          </div>
          {user}
        </div>

        <button className="theme-btn" title={`Switch to ${nextTheme.val} mode`}
          onClick={() => onThemeChange(nextTheme.val)}>
          {THEME_OPTIONS.find(t => t.val === theme)?.icon}
        </button>

        <button className="logout-btn" onClick={onLogout}>Switch User</button>
      </header>

      <div className="lm-progress-bar">
        <div className="lm-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="lm-progress-label">
        {doneCount} of {lessons.length} lessons done · {pct}%
      </div>

      <div className="lessons-scroll">
        {CATEGORIES.map(cat => {
          const meta  = CATEGORY_META[cat]
          const group = grouped[cat]
          const catDone = group.filter(l => !!completedLessons[l.id]).length

          return (
            <div key={cat} className="lesson-category">
              <div className="lc-header" style={{ '--cat-color': meta.color }}>
                <span className="lc-header-icon">{meta.icon}</span>
                <span className="lc-header-label">{meta.label}</span>
                <span className="lc-header-count">{catDone}/{group.length}</span>
              </div>

              <div className="category-grid">
                {group.map(lesson => {
                  const done  = !!completedLessons[lesson.id]
                  const stats = completedLessons[lesson.id]

                  return (
                    <button
                      key={lesson.id}
                      className={`lesson-card ${done ? 'done' : ''}`}
                      style={{ '--card-color': meta.color }}
                      onClick={() => onSelectLesson(lesson.id)}
                    >
                      <div className="lc-badge">{done ? '✓' : lesson.id}</div>
                      <div className="lc-info">
                        <div className="lc-title">{lesson.title}</div>
                        {done && stats && (
                          <div className="lc-stats">⭐ {stats.wpm} WPM · {stats.accuracy}%</div>
                        )}
                      </div>
                      {done && <div className="lc-check">✓</div>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
