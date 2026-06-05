---
title: Requirements
description: Host, kernel, and toolchain requirements for running a Denia node.
---

# Requirements

Denia is **Linux-only** — it talks to the kernel directly (namespaces, cgroup v2,
overlayfs) through `rustix`, so there is no macOS or Windows server build. The
[client CLI](../reference/cli.md#client-commands-cross-platform) (`denia auth`, `denia push`,
`denia console`) is cross-platform.

## Host

| Requirement | Minimum | Why |
| --- | --- | --- |
| OS | Linux (Ubuntu 24.04+ baseline) | Direct kernel syscalls; WSL is rejected |
| glibc | 2.39+ | Release binaries are built on Ubuntu 24.04; older hosts cannot run `denia update` |
| Kernel | 5.11+ | Overlayfs mounts inside the workload user namespace (per-replica isolation, [ADR-019](../architecture/design-decisions.md)) |
| cgroup | v2 unified hierarchy | Resource limits + metrics; v1/hybrid is rejected |
| systemd | modern | The daemon runs as a systemd service with cgroup delegation |
| User namespaces | enabled | Unprivileged userns; on some distros: `sysctl kernel.unprivileged_userns_clone=1` |
| Ports | `:80` and `:443` free | Pingora owns ingress; do not run Traefik/nginx alongside |

## Toolchain (build / operate)

- **Rust 2024 edition** (stable toolchain) — to build from source.
- **`sops`** — secret encryption/decryption.
- **BuildKit** (`buildctl`) — only for Git artifact sources. External OCI image
  pulls happen in-process (no `skopeo`/`umoci`).
- **`pnpm` + Node** — only to build the embedded web console (see `web/`).

:::tip Verify before you install
Run [`denia doctor`](../reference/cli.md#denia-doctor) on the target host. It
checks glibc, cgroup v2, user namespaces, and free ports without needing root,
and prints exactly what is wrong.
:::
