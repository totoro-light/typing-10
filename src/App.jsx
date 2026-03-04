import { useState } from 'react'
import UserSelect from './components/UserSelect'
import LessonMap from './components/LessonMap'
import TypingLesson from './components/TypingLesson'

export default function App() {
  const [user, setUser] = useState(null)
  const [lessonId, setLessonId] = useState(null)

  if (!user) return <UserSelect onSelect={setUser} />

  if (lessonId) {
    return (
      <TypingLesson
        lessonId={lessonId}
        user={user}
        onBack={() => setLessonId(null)}
        onComplete={() => {}}
      />
    )
  }

  return (
    <LessonMap
      user={user}
      onSelectLesson={setLessonId}
      onLogout={() => setUser(null)}
    />
  )
}
