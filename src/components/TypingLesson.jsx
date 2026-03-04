import { useState, useEffect, useRef, useCallback } from 'react'
import Keyboard from './Keyboard'
import HandGuide from './HandGuide'
import { completeLesson } from '../utils/storage'
import lessons from '../data/lessons.json'

const KEY_FINGER = {
  '`':'left-pinky','1':'left-pinky','2':'left-ring','3':'left-middle',
  '4':'left-index','5':'left-index','6':'right-index','7':'right-index',
  '8':'right-middle','9':'right-ring','0':'right-pinky','-':'right-pinky','=':'right-pinky',
  'q':'left-pinky','w':'left-ring','e':'left-middle','r':'left-index','t':'left-index',
  'y':'right-index','u':'right-index','i':'right-middle','o':'right-ring','p':'right-pinky',
  'a':'left-pinky','s':'left-ring','d':'left-middle','f':'left-index','g':'left-index',
  'h':'right-index','j':'right-index','k':'right-middle','l':'right-ring',';':'right-pinky',"'":'right-pinky',
  'z':'left-pinky','x':'left-ring','c':'left-middle','v':'left-index','b':'left-index',
  'n':'right-index','m':'right-index',',':'right-middle','.':'right-ring','/':'right-pinky',
  ' ':'thumb',
  'enter':'right-pinky',
}

const THEME_OPTIONS = [
  { val: 'system', icon: '💻' },
  { val: 'light',  icon: '☀️' },
  { val: 'dark',   icon: '🌙' },
]

function starsFor(accuracy) {
  if (accuracy >= 95) return ['⭐','⭐','⭐']
  if (accuracy >= 80) return ['⭐','⭐','☆']
  if (accuracy >= 60) return ['⭐','☆','☆']
  return ['☆','☆','☆']
}

function congratsMsg(accuracy) {
  if (accuracy >= 95) return 'Amazing! 🎉'
  if (accuracy >= 80) return 'Great job! 🙌'
  if (accuracy >= 60) return 'Good try! 👍'
  return 'Keep practicing! 💪'
}

export default function TypingLesson({ lessonId, user, theme, onThemeChange, onBack, onNext, onPrevious }) {
  const lesson = lessons.find(l => l.id === lessonId)
  const nextLesson = lessons.find(l => l.id === lessonId + 1)
  const prevLesson = lessons.find(l => l.id === lessonId - 1)
  const fullText = lesson.lines.join('\n')

  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [finished, setFinished] = useState(false)
  const [finalStats, setFinalStats] = useState(null)
  const [pressedKey, setPressedKey] = useState(null)
  const [now, setNow] = useState(Date.now())
  const errorsRef = useRef(0)
  const inputRef = useRef(null)
  // Refs keep handleKeyDown stable so the window listener never needs re-registering
  const typedRef = useRef('')
  const startTimeRef = useRef(null)
  const finishedRef = useRef(false)
  // Refs for popup navigation callbacks so handleKeyDown can call them without deps churn
  const onNextRef = useRef(onNext)
  const onPreviousRef = useRef(onPrevious)
  const onBackRef = useRef(onBack)
  useEffect(() => { onNextRef.current = onNext }, [onNext])
  useEffect(() => { onPreviousRef.current = onPrevious }, [onPrevious])
  useEffect(() => { onBackRef.current = onBack }, [onBack])

  const currentChar = fullText[typed.length] ?? ''
  const currentKey  = currentChar === '\n' ? 'enter' : currentChar
  const activeFinger = KEY_FINGER[currentKey] || null

  // live timer for WPM update
  useEffect(() => {
    if (!startTime || finished) return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [startTime, finished])

  useEffect(() => { inputRef.current?.focus() }, [])

  // Stable handler – reads from refs so it never goes stale
  const handleKeyDown = useCallback((e) => {
    if (finishedRef.current) {
      const k = e.key.toLowerCase()
      if (k === 'n' && nextLesson) { onNextRef.current(); return }
      if (k === 'p' && prevLesson) { onPreviousRef.current(); return }
      if (k === 'c') { onBackRef.current(); return }
      if (k === 'r') {
        typedRef.current = ''; startTimeRef.current = null; finishedRef.current = false
        setTyped(''); setStartTime(null); setFinished(false)
        setFinalStats(null); errorsRef.current = 0
        inputRef.current?.focus()
      }
      return
    }
    if (['Shift','Control','Alt','Meta','CapsLock'].includes(e.key)) return

    if (!startTimeRef.current) {
      const t = Date.now()
      startTimeRef.current = t
      setStartTime(t)
    }

    const currentTyped = typedRef.current
    const expected = fullText[currentTyped.length]

    if (e.key === 'Backspace') {
      const next = currentTyped.slice(0, -1)
      typedRef.current = next
      setTyped(next)
      setPressedKey('backspace')
      setTimeout(() => setPressedKey(null), 120)
      return
    }

    let char = e.key
    if (e.key === 'Enter') char = '\n'
    // Ignore non-printable / multi-char key names
    if (char.length > 1) return

    setPressedKey(char === '\n' ? 'enter' : char)
    setTimeout(() => setPressedKey(null), 120)

    if (char === expected) {
      const next = currentTyped + char
      typedRef.current = next
      setTyped(next)
      if (next.length === fullText.length) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60
        const words = fullText.trim().split(/\s+/).length
        const wpm = Math.max(1, Math.round(words / Math.max(elapsed, 0.01)))
        const totalKeystrokes = fullText.length + errorsRef.current
        const accuracy = Math.round((fullText.length / totalKeystrokes) * 100)
        const stats = { wpm, accuracy }
        setFinalStats(stats)
        finishedRef.current = true
        setFinished(true)
        completeLesson(user, lessonId, stats)
      }
    } else {
      errorsRef.current++
    }
  }, [fullText, user, lessonId])

  // Register once – stable handler means no churn on every keystroke
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  function handleReplay() {
    typedRef.current = ''; startTimeRef.current = null; finishedRef.current = false
    setTyped(''); setStartTime(null); setFinished(false)
    setFinalStats(null); errorsRef.current = 0
    inputRef.current?.focus()
  }

  function renderText() {
    const lines = fullText.split('\n')
    let charIndex = 0
    return lines.map((line, li) => {
      const chars = line.split('').map((ch, ci) => {
        const idx = charIndex + ci
        let cls = 'ch-pending'
        if (idx < typed.length)      cls = typed[idx] === ch ? 'ch-correct' : 'ch-wrong'
        else if (idx === typed.length) cls = 'ch-cursor'
        return <span key={ci} className={cls}>{ch === ' ' ? '\u00a0' : ch}</span>
      })
      charIndex += line.length + 1
      return (
        <div key={li} className="text-line">
          {chars}
          {li < lines.length - 1 && (
            <span className={
              charIndex - 1 === typed.length ? 'ch-cursor ch-newline' :
              charIndex - 1 < typed.length  ? 'ch-correct ch-newline' : 'ch-pending ch-newline'
            }>↵</span>
          )}
        </div>
      )
    })
  }

  const elapsed = startTime ? (now - startTime) / 1000 : 0
  const liveWpm = elapsed > 2
    ? Math.max(0, Math.round((typed.trim().split(/\s+/).filter(Boolean).length / elapsed) * 60))
    : 0
  const pct = Math.round((typed.length / fullText.length) * 100)

  const nextTheme = THEME_OPTIONS[(THEME_OPTIONS.findIndex(t => t.val === theme) + 1) % THEME_OPTIONS.length]

  return (
    <div className="typing-lesson">
      <header className="tl-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="tl-info">
          <span className="tl-badge">Lesson {lesson.id} of {lessons.length}</span>
          <h2>{lesson.title}</h2>
          <p className="tl-desc">{lesson.description}</p>
        </div>
        <div className="tl-stats">
          {startTime && !finished && (
            <div>
              <span style={{ fontSize: '1.3rem' }}>{liveWpm}</span>
              <span className="tl-stat-label">WPM</span>
            </div>
          )}
          <div>
            <span style={{ fontSize: '1.3rem' }}>{pct}%</span>
            <span className="tl-stat-label">Done</span>
          </div>
        </div>
        <button
          className="theme-btn"
          title={`Switch to ${nextTheme.label} mode`}
          onClick={() => onThemeChange(nextTheme.val)}
        >
          {THEME_OPTIONS.find(t => t.val === theme)?.icon}
        </button>
      </header>

      <div className="tl-progress">
        <div className="tl-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="text-area" onClick={() => inputRef.current?.focus()}>
        {finished && finalStats ? (
          <div className="finished-overlay">
            <div className="finished-card">
              <div className="fc-stars">{starsFor(finalStats.accuracy).join(' ')}</div>
              <h2>{congratsMsg(finalStats.accuracy)}</h2>
              <p className="fc-sub">Lesson {lesson.id} complete!</p>
              <div className="fc-stats">
                <div className="fc-stat">
                  <span className="fc-stat-val">{finalStats.wpm}</span>
                  <span className="fc-stat-label">WPM</span>
                </div>
                <div className="fc-stat">
                  <span className="fc-stat-val">{finalStats.accuracy}%</span>
                  <span className="fc-stat-label">Accuracy</span>
                </div>
              </div>
              <div className="fc-actions">
                {prevLesson && (
                  <button className="btn-secondary" onClick={onPrevious}>
                    ← <u>P</u>revious
                  </button>
                )}
                <button className="btn-secondary" onClick={handleReplay}>
                  <u>R</u>eplay
                </button>
                <button className="btn-secondary" onClick={onBack}>
                  <u>C</u>lose
                </button>
                {nextLesson && (
                  <button className="btn-primary" style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(58,174,232,.35)' }}
                    onClick={onNext}>
                    <u>N</u>ext →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-display">{renderText()}</div>
        )}
        <input
          ref={inputRef}
          className="hidden-input"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          onKeyDown={(e) => { e.stopPropagation(); handleKeyDown(e) }}
          onChange={(e) => { e.target.value = '' }}
          onBlur={() => setTimeout(() => inputRef.current && inputRef.current.focus(), 100)}
        />
      </div>

      <div className="bottom-panel">
        <HandGuide activeFinger={activeFinger} />
        <Keyboard
          activeKey={pressedKey}
          highlightKeys={[currentKey]}
          fingerMap={lesson.fingers || {}}
        />
      </div>
    </div>
  )
}
