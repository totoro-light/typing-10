const ROOT_KEY = 'typing_practice'

function getRoot() {
  try {
    return JSON.parse(localStorage.getItem(ROOT_KEY)) || {}
  } catch {
    return {}
  }
}

function setRoot(data) {
  localStorage.setItem(ROOT_KEY, JSON.stringify(data))
}

export function listUsers() {
  return Object.keys(getRoot())
}

export function getUserData(name) {
  const root = getRoot()
  return root[name] || { completedLessons: {}, currentLesson: 1 }
}

export function saveUserData(name, data) {
  const root = getRoot()
  root[name] = data
  setRoot(root)
}

export function getUserSetting(name, key, defaultVal) {
  const data = getUserData(name)
  return key in data ? data[key] : defaultVal
}

export function setUserSetting(name, key, value) {
  const data = getUserData(name)
  data[key] = value
  saveUserData(name, data)
}

export function completeLesson(name, lessonId, stats) {
  const data = getUserData(name)
  data.completedLessons[lessonId] = {
    ...stats,
    completedAt: Date.now(),
  }
  if (lessonId >= data.currentLesson) {
    data.currentLesson = lessonId + 1
  }
  saveUserData(name, data)
}

export function deleteUser(name) {
  const root = getRoot()
  delete root[name]
  setRoot(root)
}
