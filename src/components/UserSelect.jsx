import { useState } from 'react'
import { listUsers, getUserData, saveUserData } from '../utils/storage'

export default function UserSelect({ onSelect }) {
  const [users, setUsers] = useState(listUsers)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  function handleStart(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (!getUserData(trimmed)) {
      saveUserData(trimmed, { completedLessons: {}, currentLesson: 1 })
    }
    setUsers(listUsers())
    onSelect(trimmed)
  }

  function handleNew(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) { setError('Please enter your name'); return }
    if (trimmed.length < 2) { setError('Name too short'); return }
    setError('')
    handleStart(trimmed)
  }

  return (
    <div className="user-select">
      <div className="user-select-card">
        <h1>⌨️ Typing Practice</h1>
        <p className="subtitle">Learn to type with all ten fingers!</p>

        {users.length > 0 && (
          <div className="existing-users">
            <h2>Choose your name</h2>
            <div className="user-list">
              {users.map(u => (
                <button key={u} className="user-btn" onClick={() => handleStart(u)}>
                  {u}
                </button>
              ))}
            </div>
            <div className="divider">or</div>
          </div>
        )}

        <form onSubmit={handleNew} className="new-user-form">
          <h2>{users.length === 0 ? 'What is your name?' : 'New player'}</h2>
          <input
            type="text"
            placeholder="Type your name..."
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            maxLength={20}
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="start-btn">Start Learning!</button>
        </form>
      </div>
    </div>
  )
}
