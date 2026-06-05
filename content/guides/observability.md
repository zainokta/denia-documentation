---
title: Observability
description: Logs, metrics, access logs, and deploy logs — straight from the kernel.
---

# Observability

Denia surfaces real runtime state straight from the kernel — no metrics sidecar
([ADR-009](../architecture/design-decisions.md)). Everything below is also
rendered in the web console.

## Service logs

```bash
# recent lines
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/logs

# live tail (Server-Sent Events; bounded concurrent streams)
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/logs/stream
```

Logs are keyed by service id.

## Service metrics

```bash
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/metrics
```

CPU and memory come from the replica's **cgroup v2** controllers, plus process
stats from procfs.

## Node metrics

```bash
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/node
```

Reports host-level state and exposes the configured `control_domain`; disk usage
comes from `statvfs` on `DENIA_NODE_DISK_PATH`.

## Access log

The ingress records a per-request entry; recent requests for a service are at:

```bash
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/requests
```

## Deploy logs

Each deployment has its own streamed build + deploy log
(`GET /v1/deployments/{id}/logs/stream`,
[ADR-024](../architecture/design-decisions.md)); `denia push` tails it for you.
