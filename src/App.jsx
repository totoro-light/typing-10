import { useState } from 'react'
import UserSelect from './components/UserSelect'
import LessonMap from './components/LessonMap'
import TypingLesson from './components/TypingLesson'
import AboutLeaf from './components/AboutLeaf'
import { getUserSetting, setUserSetting } from './utils/storage'

function applyTheme(theme) {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', theme)
}

export default function App() {
  const [user, setUser] = useState(null)
  const [lessonId, setLessonId] = useState(null)
  const [theme, setTheme] = useState('system')

  function handleSelectUser(name) {
    const saved = getUserSetting(name, 'theme', 'system')
    setUser(name)
    setTheme(saved)
    applyTheme(saved)
  }

  function handleThemeChange(newTheme) {
    setTheme(newTheme)
    applyTheme(newTheme)
    if (user) setUserSetting(user, 'theme', newTheme)
  }

  function handleLogout() {
    setUser(null)
    setLessonId(null)
    setTheme('system')
    applyTheme('system')
  }

  if (!user) return <><UserSelect onSelect={handleSelectUser} /><AboutLeaf /></>

  if (lessonId) {
    return (
      <><TypingLesson
        key={lessonId}
        lessonId={lessonId}
        user={user}
        theme={theme}
        onThemeChange={handleThemeChange}
        onBack={() => setLessonId(null)}
        onNext={() => setLessonId(lessonId + 1)}
        onPrevious={() => setLessonId(lessonId - 1)}
      /><AboutLeaf /></>
    )
  }

  return (
    <><LessonMap
      user={user}
      theme={theme}
      onThemeChange={handleThemeChange}
      onSelectLesson={setLessonId}
      onLogout={handleLogout}
    /><AboutLeaf /></>
  )
}
