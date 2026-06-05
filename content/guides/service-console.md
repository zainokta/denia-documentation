---
title: Service console
description: Open an interactive shell inside a running replica via PTY-backed setns.
---

# Service console

An interactive shell into a live service replica — `kubectl exec`-style, but
through Denia's own runtime isolation rather than a Docker/containerd exec
([ADR-033](../architecture/design-decisions.md)). Open it from the web console's
terminal or the CLI:

```bash
denia console <service> [--project <name>] [--replica <index>]
```

## How it works

- **Live replica attach** — attaches to a running replica of the service's
  **promoted** deployment. The runtime launches `/bin/sh` through a PTY-backed
  `setns` path that joins the replica's namespaces and cgroup; the existing
  service/job launcher is untouched.
- **Ticket + websocket auth** — the browser/CLI first mints a short-lived (30s)
  single-use console ticket over bearer-authenticated HTTP
  (`POST /v1/services/{id}/console/tickets`, Operator), then opens the websocket
  (`GET /v1/services/{id}/console/ws`) with that ticket. Bearer tokens never appear
  in a websocket URL. Binary frames carry terminal I/O; JSON text frames carry
  readiness, resize, exit, and error control messages.
- **Bounded sessions** — at most 16 concurrent console sessions process-wide and 2
  per service.
- **No transcript persistence** — terminal input/output is never stored. Denia
  records metadata-only audit events (principal, service/deployment id, replica
  index, session id, start/end, exit reason).

## Limits (v1)

- **`/bin/sh` only** — images without a shell (e.g. distroless) return a clear
  console error until an explicit command mode is added.
- Workloads and the console do not share a joined PID namespace yet — a known v1
  hardening gap on the [roadmap](../project/roadmap.md).

List attachable replicas with
`GET /v1/services/{id}/console/replicas` (Operator).
