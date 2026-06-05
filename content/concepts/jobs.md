---
title: Jobs
description: Run-to-completion workloads, triggered manually or on a cron schedule.
---

# Jobs

A **Job** is a run-to-completion workload that runs on the same runtime as
services, triggered manually or on a cron schedule
([ADR-010](../architecture/design-decisions.md)).

A `Job` carries the same kind of image source as a service (Git or external
image), a `command`, environment, an optional cron `schedule`, and a
`max_retries` count. Each execution is recorded as a `JobRun`.

## Scheduler

An in-process tokio scheduler ticks every minute, emits `Pending` runs for any job
whose cron schedule is due, and a job executor drives each run to completion
through the runtime, retrying on failure up to `max_retries`. Concurrency is
guarded so a slow run does not overlap its next scheduled tick.

## Run status

| Status | Meaning |
| --- | --- |
| `Pending` | Enqueued, not yet started |
| `Running` | Executing in an isolated namespace |
| `Succeeded` | Exited `0` |
| `Failed` | Non-zero exit (after retries) |
| `Skipped` | Skipped (e.g. a prior run still active) |

## Triggering

- **Scheduled** — set a cron `schedule` on the job.
- **Manual** — `POST /v1/jobs/{id}/run` (Operator) enqueues a run immediately.

List history with `GET /v1/jobs/{id}/runs`. See the
[Scheduled jobs guide](../guides/scheduled-jobs.md).
