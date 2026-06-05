---
title: Scheduled & manual jobs
description: Create run-to-completion jobs on a cron schedule or trigger them by hand.
---

# Scheduled & manual jobs

[Jobs](../concepts/jobs.md) run to completion on the same runtime as services.
Use them for migrations, backups, batch work, or anything that runs and exits.

## Create a job

`POST /v1/jobs` (Operator) with an image source (Git or external image), a
`command`, optional `env`, an optional cron `schedule`, and `max_retries`:

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
        "project_id":"'"$PID"'",
        "name":"nightly-backup",
        "source":{"ExternalImage":{"image":"ghcr.io/you/backup:latest"}},
        "command":["/bin/backup","--all"],
        "schedule":"0 3 * * *",
        "max_retries":2
      }' \
  https://your-node.example.com/v1/jobs
```

The cron `schedule` uses standard 5-field syntax (here: 03:00 daily). Omit it for
a manual-only job.

## Trigger a run by hand

```bash
curl -fsS -X POST -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/jobs/$JOB_ID/run
```

## Inspect runs

```bash
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/jobs/$JOB_ID/runs
```

Each `JobRun` records its status (`Pending`, `Running`, `Succeeded`, `Failed`,
`Skipped`), attempt number, exit code, and timestamps. The scheduler guards
concurrency so a long run does not overlap its next tick. See
[ADR-010](../architecture/design-decisions.md).
