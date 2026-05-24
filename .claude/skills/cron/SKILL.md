---
name: cron
description: Create or update Vercel Cron settings for scheduled API execution
allowed-tools: Read, Write, Edit, Bash, Glob
---

Set up a Vercel Cron Job for this project based on: $ARGUMENTS

Rules:
1. Check whether `vercel.json` exists.
2. If it does not exist, create it.
3. Add or update the `crons` setting.
4. Use this format:

{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 23 * * *"
    }
  ]
}

5. Explain the schedule in Japan time.
6. If the user mentions a time like "毎朝8時", convert it to UTC for Vercel Cron.
7. Do not overwrite existing unrelated Vercel settings.
8. Check whether the API route exists.
9. If the API route does not exist, suggest creating it.
10. After editing, run `cat vercel.json` and explain the result.

Important:
- Vercel Cron uses UTC.
- Japan time is UTC+9.
- Example: 8:00 JST = 23:00 UTC on the previous day.
