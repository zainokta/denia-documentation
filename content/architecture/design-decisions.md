---
title: Design decisions (ADRs)
description: Curated index of all 37 Architecture Decision Records, linked to source.
---

# Design decisions (ADRs)

Denia records architecture decisions as ADRs in
[`docs/adr/`](https://github.com/zainokta/denia/tree/main/docs/adr). They are the
**source of truth** for accepted decisions — this page indexes all 37 and links
each to its source. Architecture changes (runtime isolation, ingress, secrets,
persistence, API, dependencies) require a new or updated ADR.

Status legend: **Accepted** — in force; **Proposed** — drafted, not yet ratified;
**Superseded** — replaced by a later ADR.

| ADR | Title | Status |
| --- | --- | --- |
| [001](https://github.com/zainokta/denia/blob/main/docs/adr/001-initial-backend-architecture.md) | Initial Backend Architecture | Accepted |
| [002](https://github.com/zainokta/denia/blob/main/docs/adr/002-frontend-effect-logic-layer.md) | Frontend Effect Logic Layer | Proposed |
| [003](https://github.com/zainokta/denia/blob/main/docs/adr/003-linux-runtime-process-runner.md) | Linux Runtime Process Runner | Accepted |
| [004](https://github.com/zainokta/denia/blob/main/docs/adr/004-embed-web-console.md) | Embed Web Console in Service Binary | Proposed |
| [005](https://github.com/zainokta/denia/blob/main/docs/adr/005-runtime-security-hardening.md) | Runtime Security Hardening | Accepted |
| [006](https://github.com/zainokta/denia/blob/main/docs/adr/006-projects-and-migrations.md) | Projects And Versioned Migrations | Proposed |
| [007](https://github.com/zainokta/denia/blob/main/docs/adr/007-ingress-tls.md) | Ingress + TLS | Proposed |
| [008](https://github.com/zainokta/denia/blob/main/docs/adr/008-rbac.md) | Project-Scoped RBAC | Proposed |
| [009](https://github.com/zainokta/denia/blob/main/docs/adr/009-observability.md) | Observability (Node, Workloads, Access Log) | Proposed |
| [010](https://github.com/zainokta/denia/blob/main/docs/adr/010-jobs-scheduler.md) | Jobs and Scheduler | Proposed |
| [011](https://github.com/zainokta/denia/blob/main/docs/adr/011-inprocess-oci-acquisition.md) | In-Process OCI Image Acquisition | Proposed |
| [012](https://github.com/zainokta/denia/blob/main/docs/adr/012-src-modularization.md) | src/ Modularization and Per-Aggregate Repositories | Proposed |
| [013](https://github.com/zainokta/denia/blob/main/docs/adr/013-domain-verification.md) | Domain Support With HTTP File Verification | Accepted |
| [014](https://github.com/zainokta/denia/blob/main/docs/adr/014-per-service-registry.md) | Per-Service OCI Registry Configuration | Proposed |
| [015](https://github.com/zainokta/denia/blob/main/docs/adr/015-streaming-oci-layer-staging.md) | Streaming OCI Layer Staging | Proposed |
| [016](https://github.com/zainokta/denia/blob/main/docs/adr/016-managed-traefik.md) | Denia-Managed Traefik | Superseded by 020 |
| [017](https://github.com/zainokta/denia/blob/main/docs/adr/017-service-crud-api.md) | Service CRUD API | Proposed |
| [018](https://github.com/zainokta/denia/blob/main/docs/adr/018-autoscaling.md) | Autoscaling | Accepted |
| [019](https://github.com/zainokta/denia/blob/main/docs/adr/019-runtime-filesystem-isolation.md) | Per-Replica Runtime Filesystem Isolation | Accepted (amended by 026) |
| [020](https://github.com/zainokta/denia/blob/main/docs/adr/020-pingora-ingress.md) | In-Process Pingora Ingress | Accepted |
| [021](https://github.com/zainokta/denia/blob/main/docs/adr/021-control-plane-secret-encryption.md) | Control-Plane SOPS Secret Encryption | Accepted |
| [022](https://github.com/zainokta/denia/blob/main/docs/adr/022-oci-layer-cache.md) | Persistent OCI Layer Cache With Weekly GC | Accepted |
| [023](https://github.com/zainokta/denia/blob/main/docs/adr/023-toml-config-file.md) | TOML Config File With Env Override | Accepted |
| [024](https://github.com/zainokta/denia/blob/main/docs/adr/024-async-deployments.md) | Async Deployments With Per-Deployment Log Stream | Accepted |
| [025](https://github.com/zainokta/denia/blob/main/docs/adr/025-cli-driven-host-provisioning.md) | CLI-Driven Host Provisioning | Accepted |
| [026](https://github.com/zainokta/denia/blob/main/docs/adr/026-privileged-overlay-mount-pre-userns.md) | Privileged Overlay Mount Before the User-Namespace Unshare | Accepted |
| [027](https://github.com/zainokta/denia/blob/main/docs/adr/027-daemon-lifecycle-stop-all-and-autostart.md) | Workload Lifecycle Bound to the Daemon | Accepted |
| [028](https://github.com/zainokta/denia/blob/main/docs/adr/028-deploy-autoscale-ownership-handoff.md) | Deploy→Autoscale Replica Ownership Handoff | Accepted |
| [029](https://github.com/zainokta/denia/blob/main/docs/adr/029-self-update-from-github-release.md) | Self-Update From Signed GitHub Release Binaries | Accepted |
| [030](https://github.com/zainokta/denia/blob/main/docs/adr/030-cross-platform-client-cli.md) | Cross-Platform Client CLI | Superseded by 034 |
| [031](https://github.com/zainokta/denia/blob/main/docs/adr/031-hosted-oci-registry.md) | Hosted OCI Registry | Accepted |
| [032](https://github.com/zainokta/denia/blob/main/docs/adr/032-http2-ingress-hardening.md) | HTTP/2 Ingress Hardening | Accepted |
| [033](https://github.com/zainokta/denia/blob/main/docs/adr/033-service-console.md) | Service Console | Accepted |
| [034](https://github.com/zainokta/denia/blob/main/docs/adr/034-client-driven-deploy-upload.md) | Client-Driven Deploy via Working-Tree Upload | Accepted |
| [035](https://github.com/zainokta/denia/blob/main/docs/adr/035-control-domain-ingress.md) | Control Domain Over Ingress | Accepted |
| [036](https://github.com/zainokta/denia/blob/main/docs/adr/036-general-purpose-protocol-ingress.md) | General-Purpose Protocol Ingress | Proposed |
| [037](https://github.com/zainokta/denia/blob/main/docs/adr/037-cross-platform-client-cfg-gated-crate.md) | Cross-Platform Client via cfg-Gated Single Crate + crates.io | Proposed |

## The decisions that shape the product

- **No container runtime** ([001](https://github.com/zainokta/denia/blob/main/docs/adr/001-initial-backend-architecture.md), [003](https://github.com/zainokta/denia/blob/main/docs/adr/003-linux-runtime-process-runner.md), [005](https://github.com/zainokta/denia/blob/main/docs/adr/005-runtime-security-hardening.md)) — workloads run under Denia-owned namespaces + cgroup v2 + dropped caps, not Docker/containerd/runc.
- **Per-replica overlay rootfs** ([019](https://github.com/zainokta/denia/blob/main/docs/adr/019-runtime-filesystem-isolation.md), amended by [026](https://github.com/zainokta/denia/blob/main/docs/adr/026-privileged-overlay-mount-pre-userns.md)) — each replica gets an isolated mutable layer; the privileged overlay mount happens before the userns unshare.
- **In-process ingress + TLS** ([020](https://github.com/zainokta/denia/blob/main/docs/adr/020-pingora-ingress.md), supersedes [016](https://github.com/zainokta/denia/blob/main/docs/adr/016-managed-traefik.md); [032](https://github.com/zainokta/denia/blob/main/docs/adr/032-http2-ingress-hardening.md), [035](https://github.com/zainokta/denia/blob/main/docs/adr/035-control-domain-ingress.md)) — Pingora + `instant-acme`, no Traefik/certbot.
- **Secrets out of the database** ([021](https://github.com/zainokta/denia/blob/main/docs/adr/021-control-plane-secret-encryption.md), [023](https://github.com/zainokta/denia/blob/main/docs/adr/023-toml-config-file.md)) — SOPS-encrypted files to a host-local age identity; SQLite stores references only.
- **Health-gated async deploys** ([024](https://github.com/zainokta/denia/blob/main/docs/adr/024-async-deployments.md), [028](https://github.com/zainokta/denia/blob/main/docs/adr/028-deploy-autoscale-ownership-handoff.md)) — promote only on a passing health check; clean deploy→autoscale handoff.
- **Client-driven deploy** ([034](https://github.com/zainokta/denia/blob/main/docs/adr/034-client-driven-deploy-upload.md), supersedes [030](https://github.com/zainokta/denia/blob/main/docs/adr/030-cross-platform-client-cli.md)) — `denia push` uploads the working tree; no local Docker.
- **Signed self-update** ([029](https://github.com/zainokta/denia/blob/main/docs/adr/029-self-update-from-github-release.md)) — minisign-verified GitHub release binaries, atomic swap.
- **Hosted registry** ([031](https://github.com/zainokta/denia/blob/main/docs/adr/031-hosted-oci-registry.md)) — same-origin `/v2` OCI Distribution with conservative GC.
