---
title: Roadmap
description: What v1 deliberately defers.
---

# Roadmap

Denia v1 is deliberately single-node and scoped. The following are **intentionally
deferred** (see the [ADRs](../architecture/design-decisions.md) and `TODO.md`):

- **Multi-node scheduling** — the control plane and node agent are already
  separated internally so they can split when a multi-node ADR is accepted
  (the current plan: workload hosts + a witness for safe failover, Raft-ready).
- **Rootless operation** — the daemon currently needs `CAP_SYS_ADMIN`.
- **Joined PID namespace** for workloads/console — a known v1 hardening gap.
- **Docker-compatible registry login** and richer registry auth.
- **More build sources** — buildpacks/Nixpacks beyond Dockerfile-only, and
  incremental uploads.
- **Wired `start`/`restart` lifecycle actions** and non-HTTP protocols (gRPC, TCP,
  UDP, WebSocket passthrough — see
  [ADR-036](../architecture/design-decisions.md)).

:::note Not a commitment
Roadmap items are not commitments. The
[ADR index](../architecture/design-decisions.md) is the source of truth for
accepted decisions.
:::
