---
name: deploy
description: Commit and push changes so Vercel can deploy the project
allowed-tools: Bash
---

Deploy this project with the following steps.

1. Check current git status.
2. Add all changed files.
3. Create a git commit using this message: "$ARGUMENTS"
4. Push to the remote repository.
5. If an error occurs, explain the error clearly and suggest the next action.

Commands:
- git status
- git add .
- git commit -m "$ARGUMENTS"
- git push
