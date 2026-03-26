---
description: Generate and explain cron expressions with next run times
permissions:
  reads: []
  writes: []
  commands: []
  network: false
  destructive: false
---

Help with cron expressions.

Based on the request:

**Generate cron from description:**
1. Parse the natural language schedule description
2. Generate the correct cron expression (5-field or 6-field)
3. Show the next 5 execution times
4. Verify it matches the intended schedule

**Explain existing cron:**
1. Break down each field:
   ```
   ┌───────── minute (0-59)
   │ ┌─────── hour (0-23)
   │ │ ┌───── day of month (1-31)
   │ │ │ ┌─── month (1-12)
   │ │ │ │ ┌─ day of week (0-7, 0 and 7 are Sunday)
   * * * * *
   ```
2. Explain in plain English
3. Show the next 5 execution times
4. Warn about common mistakes:
   - Day of month AND day of week (OR logic, not AND)
   - Timezone considerations
   - Month/day-of-week starting at 0 vs 1

**Common patterns:**
- Every 5 minutes: `*/5 * * * *`
- Daily at midnight: `0 0 * * *`
- Weekdays at 9am: `0 9 * * 1-5`
- First of month: `0 0 1 * *`

$ARGUMENTS
