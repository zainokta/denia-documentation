---
title: Deployments
description: An immutable build + release of a service, promoted only after a health gate.
---

# Deployments

A **Deployment** is one immutable build + release of a [service](services.md).
Deployments are **asynchronous** and **health-gated**
([ADR-024](../architecture/design-decisions.md),
[ADR-028](../architecture/design-decisions.md)).

## Status lifecycle

`POST /v1/deployments` returns immediately (`202`-style) with a `Pending`
deployment; the `DeploymentCoordinator` then drives it through:

```
Pending → Building → Starting → Healthy
                            └──→ Failed
Healthy ──(superseded / stopped)──→ Inactive / Stopped
```

| Status | Meaning |
| --- | --- |
| `Pending` | Accepted, queued for the coordinator |
| `Building` | Artifact being acquired/built (BuildKit for Git/Upload; in-process pull for OCI) |
| `Starting` | Workload launched; awaiting the health check |
| `Healthy` | Passed the health gate; routing promoted to it |
| `Failed` | Build or health check failed; previous deployment retained |
| `Stopped` / `Inactive` | No longer the promoted deployment |

## Health-gated promotion

Denia starts the new deployment, polls the configured HTTP health-check path,
and only **atomically promotes routing** once it passes. The previous deployment
is retained for **rollback**. A failed deployment never takes traffic.

## Sources

A `DeploymentRequest` is one of:

- **Git** — `{ service_id, repo_url, git_ref }`
- **External image** — `{ service_id, image }`
- **Upload** — `{ service_id, upload_id, dockerfile_path, context_path }`
  (from a `POST /v1/services/{id}/uploads`, used by `denia push`)

## Logs

Each deployment has its own streamed build + deploy log
(`GET /v1/deployments/{id}/logs/stream`, Server-Sent Events). `denia push` tails
it for you. See [Observability](../guides/observability.md).
