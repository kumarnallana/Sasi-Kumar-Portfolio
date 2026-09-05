# Workflow Rules: Git Operations & Workflow Completion

## Git Workflow Rule
- **Never run `git commit` or `git push` autonomously in the background.**
- When a task or milestone is completed and verified:
  1. Conclude the turn immediately so the user receives the chat notification without delay.
  2. Provide the exact shell commands in a code block for the user to review and run manually:
     ```bash
     git add .
     git commit -m "<concise descriptive message>"
     git push
     ```
- Do not schedule timers or background waiting tasks on Git commands.
