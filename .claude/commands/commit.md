Stage all changes and create a conventional commit.

1. Run `git diff` and `git status` to review what changed.
2. Choose the correct type from the project guidelines in CLAUDE.md.
3. Write a commit message following the format:
   ```
   <type>(optional scope): <short description>
   ```
   - Subject line ≤ 72 characters
   - Use imperative mood ("add", "fix", "update" — not "added" or "adds")
   - Add a body if the change needs explanation
4. Stage only relevant files (never `.env`, secrets, or `dist/`).
5. Commit with the message and the co-author trailer:
   ```
   Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
   ```
6. Show the final `git log --oneline -5` so the user can confirm.
