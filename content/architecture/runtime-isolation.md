---
title: Runtime isolation
description: How Denia sandboxes workloads with namespaces, cgroup v2, overlay rootfs, and dropped capabilities.
---

# Runtime isolation

Denia runs workloads under its **own** Linux runtime — not Docker, containerd, or
runc. The mechanics live in `src/runtime/` (the `LinuxRuntime`) and `src/syscall/`
(thin `rustix` wrappers). See [ADR-003](design-decisions.md),
[ADR-005](design-decisions.md), [ADR-019](design-decisions.md), and
[ADR-026](design-decisions.md).

## Namespaces

Each replica is launched via `unshare` into private namespaces:

| Namespace | Effect |
| --- | --- |
| `user` | Workload uid 0 maps to host `userns_base` (default `100000`), an unprivileged uid |
| `pid` | Workload sees only its own process tree |
| `mount` | Private rootfs; no host filesystem bleed |
| `uts` | Own hostname |
| `ipc` | Private SysV IPC |

The **network namespace is intentionally not unshared** in v1 — workloads share
the host network and are reached over a private Unix socket, not a port.

## Overlay rootfs (per replica)

Each replica boots a private OverlayFS rootfs:

- **lower** — the immutable base image rootfs (from an OCI pull or a BuildKit
  build).
- **upper** — a per-replica mutable layer (writes stay isolated per replica).
- **work** / **merged** — overlay scratch + the guest-visible unified root.

The child `pivot_root`s into the merged root. Because mounting overlay inside an
unprivileged userns is fragile, the privileged overlay mount is performed
**before** the user-namespace unshare ([ADR-026](design-decisions.md)). The
rootfs is `chown`-mapped to `userns_base` so uid 0 inside maps correctly.

## Capabilities & no_new_privs

- The daemon runs as the unprivileged `denia` user with a tight set:
  `CAP_NET_BIND_SERVICE`, `CAP_SYS_ADMIN`, `CAP_SETUID`, `CAP_SETGID`.
- `CAP_SYS_ADMIN` is needed for `unshare`/`mount`/cgroup delegation during setup,
  then the capability **bounding set is dropped** in the child.
- `PR_SET_NO_NEW_PRIVS` is set before `exec`, preventing setuid/file-capability
  escalation.

## Cgroup v2 limits

Each replica gets a cgroup under `DENIA_CGROUP_ROOT`
(`/sys/fs/cgroup/denia/<service_id>/<replica_index>`) with controllers driven from
the service's resource limits:

- `cpu.max` from `cpu_millis`
- `memory.max` from `memory_bytes` (hard limit; OOM-kill on breach)
- `pids.max` / `io` as applicable

These same controllers feed [metrics](../guides/observability.md).

## Lifecycle

Workload lifecycle is bound to the daemon ([ADR-027](design-decisions.md)): the
daemon stops all workloads on shutdown and autostarts the promoted deployments on
boot. The parent reaps children (SIGTERM, then SIGKILL after a timeout).

:::danger Not a multi-tenant adversarial sandbox
v1 isolation is process + filesystem isolation, not raw-syscall hardening. Treat
`CAP_SYS_ADMIN` as host-root-equivalent — a daemon RCE escalates to host root, the
same class as `dockerd`/`containerd`/`kubelet`. Run untrusted code on its own host
or VM. See [Security](../operations/security.md).
:::
