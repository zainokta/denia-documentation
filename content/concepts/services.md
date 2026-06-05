---
title: Services
description: A service is a long-running workload with a source, port, health check, and limits.
---

# Services

A **Service** is a long-running workload. It is defined by:

- **Source** (`ServiceSource`) — where the image comes from:
  - **Git** — a repo URL, ref, Dockerfile path, and context path, built with
    BuildKit. Uses a project Git deploy key.
  - **External image** — an OCI image reference pulled in-process, optionally
    against a project [registry](registries.md) for private images.
  - **Upload** — a working-tree build context streamed up by
    [`denia push`](../guides/deploy-from-your-machine.md).
- **Internal port** — the port the workload listens on inside its namespace.
- **Health check** — an HTTP `path` and `timeout_seconds`; deployments are gated
  on it (see [Deployments](deployments.md)).
- **Resource limits** — `cpu_millis` and `memory_bytes`, applied as cgroup v2
  `cpu.max` and `memory.max`.
- **Environment** — `KEY=value` pairs (plus project shared env). Redacted for
  Viewers.
- **TLS** — `tls_enabled`; combined with verified [domains](routes-and-domains.md).
- **Autoscale policy** — optional; see
  [Replicas & autoscaling](replicas-and-autoscaling.md).

Services are created in the web console or via `POST /v1/services` (Operator). The
CRUD surface is documented in [ADR-017](../architecture/design-decisions.md) and
the [API reference](../reference/api/v1.md#services).

## Lifecycle

Creating a service only records its configuration. A workload starts running once
you create a [deployment](deployments.md) for it (the source must resolve to a
buildable/pullable artifact). The autoscaler then manages how many
[replicas](replicas-and-autoscaling.md) run.
