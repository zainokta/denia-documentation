---
title: Replicas & autoscaling
description: Replicas are isolated instances; the autoscaler scales them on CPU/memory, down to zero.
---

# Replicas & autoscaling

A **Replica** is a single running instance of a service's **promoted**
deployment. Each replica is isolated in its own namespaces + cgroup + overlay
rootfs and is reachable on a private Unix socket. See
[Runtime isolation](../architecture/runtime-isolation.md) for the mechanics.

## Autoscaling

The autoscaler ([ADR-018](../architecture/design-decisions.md)) runs a periodic
control loop that reads each service's cgroup CPU/memory usage and decides whether
to add or drain replicas. It supports **scale-to-zero** with a single-flight
cold start (only one replica is birthed at a time), bounded by a host resource
**ledger** that reserves headroom so the node is never over-committed.

An `AutoscalePolicy` on a service carries:

| Field | Meaning |
| --- | --- |
| `min_replicas` / `max_replicas` | Bounds; `min_replicas: 0` enables scale-to-zero |
| `target_cpu_pct` / `target_mem_pct` | Utilization targets that drive scale-up |
| `scale_down_cooldown_s` | Wait before draining after load drops |
| `idle_timeout_s` | Idle time before scaling to zero |

## Tuning the node ledger

Host-wide headroom is configured with environment variables (see
[Configuration](../reference/configuration.md)):

- `DENIA_AUTOSCALE_INTERVAL_S` (default `15`) — control-loop tick.
- `DENIA_AUTOSCALE_HEADROOM_CPU_MILLIS` (default `1000`) — reserved CPU.
- `DENIA_AUTOSCALE_HEADROOM_MEM_BYTES` (default `512 MiB`) — reserved memory.

Deploy → autoscale ownership of replicas is handed off explicitly so a new
deployment and the autoscaler never fight over the same replica
([ADR-028](../architecture/design-decisions.md)).
