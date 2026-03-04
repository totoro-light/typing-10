import { useState } from 'react'
import { getUserData } from '../utils/storage'
import lessons from '../data/lessons.json'

const PALETTE = ['--green', '--blue', '--orange', '--pink', '--purple', '--teal']
const THEME_OPTIONS = [
  { val: 'system', icon: '💻', label: 'System' },
  { val: 'light',  icon: '☀️', label: 'Light' },
  { val: 'dark',   icon: '🌙', label: 'Dark' },
]

function cardColor(id) {
  return `var(${PALETTE[(id - 1) % PALETTE.length]})`
}

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff
  return `var(${PALETTE[Math.abs(h) % PALETTE.length]})`
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function LessonMap({ user, theme, onThemeChange, onSelectLesson, onLogout }) {
  const userData = getUserData(user)
  const { completedLessons, currentLesson } = userData
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

        <button
          className="theme-btn"
          title={`Switch to ${nextTheme.label} mode`}
          onClick={() => onThemeChange(nextTheme.val)}
        >
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

      <div className="lessons-grid">
        {lessons.map(lesson => {
          const done = !!completedLessons[lesson.id]
          const unlocked = lesson.id <= currentLesson
          const stats = completedLessons[lesson.id]
          const color = cardColor(lesson.id)

          return (
            <button
              key={lesson.id}
              className={`lesson-card ${done ? 'done' : ''}`}
              style={{ '--card-color': color }}
              onClick={() => unlocked && onSelectLesson(lesson.id)}
              disabled={!unlocked}
            >
              <div className="lc-badge">
                {done ? '✓' : lesson.id}
              </div>
              <div className="lc-info">
                <div className="lc-title">{lesson.title}</div>
                {done && stats && (
                  <div className="lc-stats">⭐ {stats.wpm} WPM · {stats.accuracy}%</div>
                )}
                {!unlocked && <div className="lc-locked">🔒 Complete previous lesson</div>}
              </div>
              {done && <div className="lc-check">✓</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
