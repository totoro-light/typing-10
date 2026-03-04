import { useState } from 'react'
import { listUsers, getUserData, saveUserData } from '../utils/storage'

const PALETTE = ['--green', '--blue', '--orange', '--pink', '--purple', '--teal']

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff
  return PALETTE[Math.abs(h) % PALETTE.length]
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function UserSelect({ onSelect }) {
  const [users, setUsers] = useState(listUsers)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  function handleStart(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    const existing = getUserData(trimmed)
    if (!existing.completedLessons) {
      saveUserData(trimmed, { completedLessons: {}, currentLesson: 1 })
    }
    setUsers(listUsers())
    onSelect(trimmed)
  }

  function handleNew(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) { setError('Please enter your name!'); return }
    if (trimmed.length < 2) { setError('Name is too short!'); return }
    setError('')
    handleStart(trimmed)
  }

  return (
    <div className="user-select">
      <div className="user-select-card">
        <div className="us-icon">⌨️</div>
        <h1>Typing Practice</h1>
        <p className="subtitle">Learn to type with all ten fingers! 🎉</p>

        {users.length > 0 && (
          <>
            <p className="us-section-label">Who is playing?</p>
            <div className="user-list">
              {users.map((u, i) => {
                const c = avatarColor(u)
                return (
                  <button
                    key={u}
                    className="user-btn"
                    style={{ '--btn-color': `var(${c})` }}
                    onClick={() => handleStart(u)}
                  >
                    {u}
                  </button>
                )
              })}
            </div>
            <div className="us-divider">or add new player</div>
          </>
        )}

        <form onSubmit={handleNew} className="new-user-form">
          {users.length === 0 && <h2>What is your name? 😊</h2>}
          <input
            className="us-input"
            type="text"
            placeholder={users.length === 0 ? 'Type your name...' : 'New player name...'}
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            maxLength={20}
            autoFocus
          />
          {error && <p className="us-error">{error}</p>}
          <button type="submit" className="start-btn">
            {users.length === 0 ? "Let's Start! 🚀" : "Add Player 🎮"}
          </button>
        </form>
      </div>
    </div>
  )
}
