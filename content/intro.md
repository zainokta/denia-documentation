---
id: intro
title: What is Denia?
description: A Docker-free, single-node PaaS that runs your services on a Denia-owned Linux runtime — namespaces and cgroup v2 instead of Docker, containerd, or runc.
slug: /
---

# What is Denia?

Denia is a **Docker-free, single-node PaaS**. It deploys and runs your workloads
under its own Linux runtime isolation (namespaces + cgroup v2) and exposes a
versioned `/v1` management API behind a bearer admin token. It is its own L7
ingress (in-process Pingora + ACME TLS), autoscales services down to zero, and
ships an embedded web console — all as a **single Rust binary**, with no external
proxy and no container runtime.

It is built for **solo operators and homelab users** running self-hosted
workloads on a single node: deploy services, manage routes and secrets, and read
real cgroup/procfs runtime metrics. The goal is a tool you trust enough to forget
about, opening it only to do a thing and leave.

:::info Status: v1, single-node
Multi-node scheduling, hosted-registry Docker login, and rootless operation are
intentionally deferred. See the [Roadmap](project/roadmap.md) and the
[Design Decisions](architecture/design-decisions.md) index.
:::

## Why Denia?

Most self-hosted PaaS tools are a thin layer over Docker or Kubernetes: you still
run a container daemon, a separate reverse proxy, a cert companion, and a
registry, then wire them together. Denia collapses that stack into **one Rust
binary** that owns the whole path — runtime isolation, ingress, TLS, autoscaling,
registry, and an operator console — talking to the Linux kernel directly
(namespaces + cgroup v2) instead of going through a container runtime.

|                              | Denia                       | Docker / Compose | Dokku / CapRover  | Kubernetes          |
| ---------------------------- | --------------------------- | ---------------- | ----------------- | ------------------- |
| Container runtime            | **None** (kernel namespaces) | `dockerd`        | `dockerd`         | containerd / CRI    |
| Reverse proxy                | **Built-in** (Pingora)      | Manual           | Bundled (nginx)   | Ingress controller  |
| TLS / ACME                   | **Built-in**                | Manual / companion | Bundled (LE)    | cert-manager        |
| Autoscale + scale-to-zero    | **Built-in**                | No               | No                | HPA + Knative       |
| OCI registry                 | **Built-in**                | External         | External          | External            |
| Moving parts                 | One binary + `systemd`      | Daemon + add-ons | Daemon + plugins  | Many components     |
| Scope                        | Single node                 | Single node      | Single node       | Cluster             |

## Is Denia for you?

**Denia is for you if** you run your own apps on one Linux box, are comfortable
with the terminal and Linux primitives, and want a tool that handles the boring
plumbing without hiding what the machine is doing.

**Denia is not for you if** you need multi-node clustering, a managed control
plane, or a hardened multi-tenant sandbox for running untrusted third-party code.
See [Security](operations/security.md) for the trust model.

## Where to next

- [Requirements](getting-started/requirements.md) then
  [Installation](getting-started/installation.md) to stand up a node.
- [Deploy your first service](getting-started/first-service.md) end-to-end with
  `denia push`.
- [Concepts](concepts/overview.md) for the vocabulary that maps onto the API and
  console.
- [Architecture](architecture/overview.md) for how the single binary fits
  together.
