---
title: Concepts overview
description: The small, stable vocabulary that maps onto Denia's API and console.
---

# Concepts overview

Denia has a small, stable vocabulary. Each term maps directly onto the `/v1` API
and the web console.

| Term | One line |
| --- | --- |
| [Project](projects-and-rbac.md) | Top-level grouping and the unit of access control. Holds shared env/limits, members with roles, and registry credentials. |
| [Role](projects-and-rbac.md#roles) | A member's permission level within a project: Viewer, Operator, Admin. |
| [Service](services.md) | A long-running workload: an image source, a listen port, env, optional domains/TLS, and an optional autoscaling policy. |
| [Deployment](deployments.md) | One immutable build + release of a service. Health-gated before routing is promoted to it. |
| [Replica](replicas-and-autoscaling.md) | A single running instance of a service's promoted deployment, isolated in its own namespaces + cgroup + overlay rootfs. |
| [Route / Domain](routes-and-domains.md) | A hostname mapped to a service. Ingress resolves the `Host` header to a service. |
| [Job](jobs.md) | A run-to-completion workload, triggered manually or on a cron schedule. |
| [Registry](registries.md) | A project registry (creds for pulling external OCI images) or Denia's own hosted registry (`/v2`). |
| [Secret](secrets.md) | A sensitive value stored in a SOPS-encrypted file and referenced (never stored raw) by SQLite. |

Every persisted entity is keyed by a **UUIDv7** — time-sortable, so deployments,
artifacts, and events order deterministically.
