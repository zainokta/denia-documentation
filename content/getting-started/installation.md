---
title: Installation
description: Install Denia with the two-step build + provision flow.
---

# Installation

Production installs use a **two-step flow**: build and install the binary, then
provision the host. See [ADR-025](../architecture/design-decisions.md) for the
full layout and privilege model.

## Step 1 — Build and install the binary

`install.sh` must be run via **sudo from a regular user account** (not directly
as root). It runs preflight checks (OS/arch, glibc ≥ 2.39, cgroup v2, user
namespaces, free `:80`/`:443`), installs OS dependencies, sets up Rust, Node,
SOPS, and BuildKit, builds the release binary with the embedded SPA, and installs
it to `/usr/local/bin/denia`.

```bash
sudo \
  DENIA_RUSTUP_SHA256=<known-good sha256 for https://sh.rustup.rs> \
  DENIA_NODESOURCE_SETUP_SHA256=<known-good sha256 for https://deb.nodesource.com/setup_22.x> \
  ./install.sh
```

The installer verifies both downloaded setup scripts before running them. Get the
current hashes from a trusted network path:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://sh.rustup.rs -o rustup-init.sh
sha256sum rustup-init.sh
curl --proto '=https' --tlsv1.2 -fsSL https://deb.nodesource.com/setup_22.x -o nodesource-setup_22.x
sha256sum nodesource-setup_22.x
```

### Installer flags & env

| Flag / env | Effect |
| --- | --- |
| `--dry-run` | Preview every command without changing anything |
| `--skip-build` | Reuse an existing `target/release/denia` |
| `DENIA_SOPS_VERSION` / `DENIA_BUILDKIT_VERSION` | Pin the SOPS / BuildKit release versions |
| `DENIA_SOPS_SHA256` / `DENIA_BUILDKIT_SHA256` | Verify the downloaded SOPS / BuildKit binaries |

## Step 2 — Provision the host

```bash
sudo denia setup
```

`denia setup`:

1. Creates the `buildkit` group, adds the `denia` service user to it, renders
   `/etc/systemd/system/buildkit.service`, starts BuildKit with an OCI worker, and
   grants Denia access to `/run/buildkit/buildkitd.sock`.
2. Creates the `denia` system user and group.
3. Lays out `/var/lib/denia` (state, artifacts, runtime, logs, registry,
   oci-cache, secrets, tls, uploads, sqlite).
4. Generates `~/.config/denia/{config.toml,admin.token,age.key}`, owned
   `<operator>:denia 0640` so the operator can edit them without sudo.
5. Writes and enables the systemd unit, then starts the service.

The server binds `127.0.0.1:7180` by default, serving the API under `/v1` with the
web console as the fallback for non-API routes.

## Step 3 — Bootstrap an admin account

The token in `~/.config/denia/admin.token` is a super-admin bearer. Exchange it
once for a real admin account (or use the console's `/setup` page):

```bash
TOKEN="$(sed -n 's/^DENIA_ADMIN_TOKEN=//p' ~/.config/denia/admin.token)"
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"<strong-password>"}' \
  http://127.0.0.1:7180/v1/bootstrap
```

Next: [deploy your first service](first-service.md). To upgrade or remove a node
later, see [Operations](../operations/upgrading.md).

:::note Building from source / development
For local development you can skip `install.sh` and run the control plane
directly — see [Quick Start](quick-start.md).
:::
