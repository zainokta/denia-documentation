---
title: Security model
description: The trust boundary, daemon hardening, and operational hygiene.
---

# Security model

:::danger Treat `CAP_SYS_ADMIN` as host-root-equivalent
Any RCE in the daemon escalates to host root — the same class as `dockerd`,
`containerd`, `kubelet`, and rootful `podman`. Denia v1 is **not** a multi-tenant
adversarial sandbox.
:::

## Trust model

- The daemon runs as the unprivileged `denia` user with a tightly-scoped
  capability set: `CAP_NET_BIND_SERVICE`, `CAP_SYS_ADMIN`, `CAP_SETUID`,
  `CAP_SETGID`.
- Workloads run in unprivileged user namespaces with `uid 0` mapped to
  `userns_base` (default `100000`). See
  [Runtime isolation](../architecture/runtime-isolation.md).
- v1 isolation is process + filesystem isolation, not raw-syscall hardening — run
  untrusted code on its own host or VM.

## Daemon hardening

The shipped systemd unit applies:

- `ProtectSystem=strict`
- `ProtectHome=read-only` + `BindReadOnlyPaths=~/.config/denia`
- `PrivateTmp=true`
- a locked `CapabilityBoundingSet=`

## Operational hygiene

- **Bind the management API to loopback** (default `127.0.0.1:7180`), or front it
  with a reverse proxy + mTLS/VPN.
- **Rotate the admin token** (`denia rotate-token`) periodically and after any
  exposure.
- **Patch the host kernel aggressively** — the realistic escape vector is a
  userns/cgroup CVE.
- Run `cargo audit` per release; **never log secrets**.

See the security audit `docs/security-audit-pingora-2026-05-28.md` and the
[ADRs](../architecture/design-decisions.md) for the full analysis. Secret handling
is covered in [Secrets](../concepts/secrets.md) and
[Managing secrets](../guides/managing-secrets.md).
