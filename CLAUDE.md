# Project Guidelines

## Stack
- Vite + React (JSX, no TypeScript)
- pnpm package manager
- Offline-first, deployed to GitHub Pages via `gh-pages` branch

## Commit Convention
All commits **must** follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(optional scope): <short description>

[optional body]

[optional footer]
```

### Types
| Type       | When to use                              |
|------------|------------------------------------------|
| `feat`     | New feature or lesson content            |
| `fix`      | Bug fix                                  |
| `style`    | CSS / visual changes, no logic change    |
| `refactor` | Code restructure, no behavior change     |
| `perf`     | Performance improvement                  |
| `ci`       | GitHub Actions / deployment changes      |
| `chore`    | Tooling, config, deps (no src change)    |
| `docs`     | Documentation only                       |

### Examples
```
feat(lessons): add capital letters lesson
fix(keyboard): correct finger assignment for Y key
style(lesson-map): increase card font size for kids
ci: update Node version to 22 in deploy workflow
```

## Code Style
- Functional React components only (no class components)
- Keep components small and focused
- CSS custom properties for all colors (`src/index.css` `:root`)
- Finger color system must stay consistent across `Keyboard.jsx` and `HandGuide.jsx`

## Lesson Data
- Lessons live in `src/data/lessons.json`
- Each lesson must have: `id`, `title`, `description`, `keys[]`, `fingers{}`, `lines[]`
- Progression order: home row → top row → bottom row → center keys → full alphabet → words → numbers → sentences

## Storage
- All user data in `localStorage` under key `typing_practice`
- Never store sensitive data; only lesson progress and WPM stats
