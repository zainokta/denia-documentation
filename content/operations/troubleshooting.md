---
title: Troubleshooting & FAQ
description: Common failure modes and how to resolve them.
---

# Troubleshooting & FAQ

Run [`denia doctor`](../reference/cli.md#denia-doctor) first — it checks host
requirements (glibc, cgroup v2, user namespaces, free ports) and install health
without needing root, and prints what is wrong.

### `:80` / `:443` already in use

Denia owns these ports for ingress; do not run a separate Traefik/nginx/Apache.
Stop the other listener (`sudo ss -ltnp 'sport = :80'`) or change
`DENIA_HTTP_PORT` / `DENIA_HTTPS_PORT`.

### TLS / ACME fails

Confirm DNS resolves to this node, the domain is **verified**, `DENIA_ACME_EMAIL`
is set, and `:80` is reachable from the public internet (HTTP-01). While testing,
use the Let's Encrypt **staging** directory (`DENIA_ACME_DIRECTORY_URL`), then
switch to production. See [Custom domains & TLS](../guides/custom-domains-tls.md).

### User-namespace / overlay errors at runtime

You need kernel ≥ 5.11, cgroup v2, and unprivileged user namespaces enabled (on
some distros: `sysctl kernel.unprivileged_userns_clone=1`). `denia doctor` flags
these.

### Secrets won't decrypt after a restore

The age key (`~/.config/denia/age.key`) must be the same one that encrypted them,
readable by the `denia` group. See [Backup & restore](backup-and-restore.md).

### `denia push` rejects my context

Build contexts may not contain symlinks or hardlinks that escape the root
(host-root safety), and a Dockerfile must exist. See
[Deploy from your machine](../guides/deploy-from-your-machine.md).

### Distroless image won't open a console

The [service console](../guides/service-console.md) is `/bin/sh`-only in v1; images
without a shell return a clear error.

### Can I run untrusted code?

Not safely. Denia v1 is **not** a multi-tenant adversarial sandbox — treat a
daemon RCE as host-root. Isolate untrusted workloads on their own host or VM. See
[Security](security.md).
