import { getUserData } from '../utils/storage'
import lessons from '../data/lessons.json'

export default function LessonMap({ user, onSelectLesson, onLogout }) {
  const userData = getUserData(user)
  const { completedLessons, currentLesson } = userData

  return (
    <div className="lesson-map">
      <header className="lesson-map-header">
        <div className="header-left">
          <h1>⌨️ Typing Practice</h1>
          <span className="user-badge">👤 {user}</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>Switch User</button>
      </header>

      <div className="lessons-grid">
        {lessons.map(lesson => {
          const done = !!completedLessons[lesson.id]
          const unlocked = lesson.id <= currentLesson
          const stats = completedLessons[lesson.id]

          return (
            <button
              key={lesson.id}
              className={`lesson-card ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && onSelectLesson(lesson.id)}
              disabled={!unlocked}
            >
              <div className="lesson-num">{lesson.id}</div>
              <div className="lesson-info">
                <div className="lesson-title">{lesson.title}</div>
                {done && stats && (
                  <div className="lesson-stats">
                    ⭐ {stats.wpm} WPM · {stats.accuracy}%
                  </div>
                )}
                {!unlocked && <div className="locked-label">🔒 Locked</div>}
              </div>
              {done && <div className="checkmark">✓</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
