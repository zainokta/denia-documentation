---
title: Projects & RBAC
description: Projects are the unit of access control; roles are scoped per project.
---

# Projects & RBAC

A **Project** is the top-level grouping and the unit of access control. It holds
shared environment/limits, members (with roles), and registry credentials. Every
service belongs to exactly one project. A `default` project exists on a fresh
install. See [ADR-006](../architecture/design-decisions.md) and
[ADR-008](../architecture/design-decisions.md).

## Roles

A member's permission level is scoped **within a project** and ordered:

| Role | Level | Capabilities |
| --- | --- | --- |
| **Viewer** | 0 | Read services, deployments, jobs, logs, metrics. Env values are **redacted**. |
| **Operator** | 1 | Viewer + create/update services & jobs, deploy, manage routes/secrets/registries, open consoles, trigger runs. |
| **Admin** | 2 | Operator + manage project members and their roles. |

The bootstrap admin token is a **super-admin** across all projects: it bypasses
membership checks and can create/delete projects and manage users.

Role enforcement happens per route: each handler requires a minimum role for the
target project, returning `403 Forbidden` (or a `404`-style message where
disclosure would leak existence) when the caller's membership is missing or too
low. See [API authentication](../reference/api/authentication.md) for the full
matrix.

## Shared environment & limits

A project carries a `shared_env` map and `default_resource_limits` that apply to
its services unless a service overrides them. Viewers see shared env values
redacted, the same as service env.
