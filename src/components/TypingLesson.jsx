import { useState, useEffect, useRef, useCallback } from 'react'
import Keyboard from './Keyboard'
import HandGuide from './HandGuide'
import { completeLesson } from '../utils/storage'
import lessons from '../data/lessons.json'

const KEY_FINGER = {
  '`':'left-pinky','1':'left-pinky','2':'left-ring','3':'left-middle',
  '4':'left-index','5':'left-index','6':'right-index','7':'right-index',
  '8':'right-middle','9':'right-ring','0':'right-pinky','-':'right-pinky',
  '=':'right-pinky',
  'q':'left-pinky','w':'left-ring','e':'left-middle',
  'r':'left-index','t':'left-index','y':'right-index','u':'right-index',
  'i':'right-middle','o':'right-ring','p':'right-pinky',
  'a':'left-pinky','s':'left-ring','d':'left-middle',
  'f':'left-index','g':'left-index','h':'right-index','j':'right-index',
  'k':'right-middle','l':'right-ring',';':'right-pinky',"'":'right-pinky',
  'z':'left-pinky','x':'left-ring','c':'left-middle',
  'v':'left-index','b':'left-index','n':'right-index','m':'right-index',
  ',':'right-middle','.':'right-ring','/':'right-pinky',
  ' ':'thumb',
}

function buildText(lesson) {
  return lesson.lines.join('\n')
}

export default function TypingLesson({ lessonId, user, onBack, onComplete }) {
  const lesson = lessons.find(l => l.id === lessonId)
  const fullText = buildText(lesson)

  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [finished, setFinished] = useState(false)
  const [pressedKey, setPressedKey] = useState(null)
  const inputRef = useRef(null)

  const currentIndex = typed.length
  const currentChar = fullText[currentIndex] ?? ''
  const currentKey = currentChar === '\n' ? 'enter' : currentChar
  const activeFinger = KEY_FINGER[currentKey] || null

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (finished) return

    // ignore modifier-only
    if (['Shift','Control','Alt','Meta','CapsLock'].includes(e.key)) return

    if (!startTime) setStartTime(Date.now())

    const expected = fullText[typed.length]

    if (e.key === 'Backspace') {
      setTyped(t => t.slice(0, -1))
      setPressedKey('backspace')
      return
    }

    let char = e.key
    if (e.key === 'Enter') char = '\n'

    setPressedKey(char === '\n' ? 'enter' : char)
    setTimeout(() => setPressedKey(null), 120)

    if (char === expected) {
      const next = typed + char
      setTyped(next)
      if (next.length === fullText.length) {
        const elapsed = (Date.now() - startTime) / 1000 / 60
        const words = fullText.split(/\s+/).length
        const wpm = Math.round(words / elapsed)
        const errors = [...next].filter((c, i) => c !== fullText[i]).length
        const accuracy = Math.round(((next.length - errors) / next.length) * 100)
        setFinished(true)
        completeLesson(user, lessonId, { wpm, accuracy })
        onComplete && onComplete({ wpm, accuracy })
      }
    }
  }, [finished, fullText, startTime, typed, user, lessonId, onComplete])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Build display segments: completed, current, remaining, broken by lines
  function renderText() {
    const lines = fullText.split('\n')
    let charIndex = 0
    return lines.map((line, li) => {
      const chars = line.split('').map((ch, ci) => {
        const idx = charIndex + ci
        let cls = 'ch-pending'
        if (idx < typed.length) {
          cls = typed[idx] === ch ? 'ch-correct' : 'ch-wrong'
        } else if (idx === typed.length) {
          cls = 'ch-cursor'
        }
        return <span key={ci} className={cls}>{ch === ' ' ? '\u00a0' : ch}</span>
      })
      charIndex += line.length + 1 // +1 for the \n
      return (
        <div key={li} className="text-line">
          {chars}
          {li < lines.length - 1 && (
            <span className={
              charIndex - 1 === typed.length ? 'ch-cursor ch-newline' :
              charIndex - 1 < typed.length ? 'ch-correct ch-newline' : 'ch-pending ch-newline'
            }>↵</span>
          )}
        </div>
      )
    })
  }

  // elapsed & live wpm
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
  const liveWpm = elapsed > 2
    ? Math.round((typed.split(/\s+/).filter(Boolean).length / elapsed) * 60)
    : 0

  return (
    <div className="typing-lesson">
      {/* TOP: lesson info + stats bar */}
      <header className="lesson-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <div className="lesson-title-area">
          <span className="lesson-badge">Lesson {lesson.id}</span>
          <h2>{lesson.title}</h2>
          <p className="lesson-desc">{lesson.description}</p>
        </div>
        <div className="stats-bar">
          {!finished && startTime && <span>{liveWpm} WPM</span>}
          <span>{Math.round((typed.length / fullText.length) * 100)}%</span>
        </div>
      </header>

      {/* MIDDLE: text display */}
      <div className="text-area" onClick={() => inputRef.current?.focus()}>
        {finished ? (
          <div className="finished-overlay">
            <div className="finished-card">
              <div className="big-star">⭐</div>
              <h2>Great job!</h2>
              <p>Lesson {lesson.id} complete!</p>
              <div className="result-stats">
                <div className="stat">
                  <span className="stat-val">{liveWpm}</span>
                  <span className="stat-label">WPM</span>
                </div>
              </div>
              <div className="finished-actions">
                <button className="btn-primary" onClick={() => {
                  setTyped(''); setStartTime(null); setFinished(false)
                }}>Try Again</button>
                <button className="btn-secondary" onClick={onBack}>Back to Lessons</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-display">{renderText()}</div>
        )}
        <input
          ref={inputRef}
          className="hidden-input"
          readOnly
          onBlur={() => setTimeout(() => inputRef.current?.focus(), 100)}
        />
      </div>

      {/* BOTTOM: keyboard + hands */}
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
