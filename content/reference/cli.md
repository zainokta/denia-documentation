---
title: CLI reference
description: Every denia subcommand — server provisioning and the cross-platform client.
---

# CLI reference

The `denia` binary is multi-call. Running `denia` with **no subcommand** starts
the control-plane daemon. Subcommands split into **server** commands (Linux,
manage the node) and **client** commands (cross-platform, talk to a remote node).

A global flag applies to all commands:

| Flag | Purpose |
| --- | --- |
| `-c, --config <PATH>` | Override the TOML config path (sets `DENIA_CONFIG_FILE`) |

## Server commands (Linux)

### `denia setup`
Provision the host: create the `denia`/`buildkit` users and group, lay out
`/var/lib/denia`, generate `~/.config/denia/{config.toml,admin.token,age.key}`,
write and enable the systemd unit, and start the service. See
[Installation](../getting-started/installation.md).

### `denia uninstall [--purge]`
Stop and disable the service and remove the unit. `--purge` **also wipes**
`/var/lib/denia` and `~/.config/denia` (destructive and irreversible). See
[Uninstalling](../operations/uninstalling.md).

### `denia status`
Print service state — `systemctl status` plus recent journal lines.

### `denia doctor`
Diagnose host requirements and install health (glibc, cgroup v2, user namespaces,
free `:80`/`:443`). No privilege required. Run it before installing or when
debugging.

### `denia rotate-token`
Rotate the admin token and restart the service.

### `denia update [--check | --tag <tag> | --force | -y]`
Self-update to the latest signed GitHub release binary and restart. `--check`
only reports whether a newer release exists (no root). `--tag` pins a release;
`--force` reinstalls even if not newer. See
[Upgrading](../operations/upgrading.md) and
[ADR-029](../architecture/design-decisions.md).

## Client commands (cross-platform)

These run on macOS, Windows, and Linux and talk to a remote node over `/v1`.

### `denia auth [--url <URL>] [--username <user>] [--profile <name>] [--token-name <name>] [--password-stdin]`
Log in to a remote Denia, mint a long-lived API token, and store `{url, token}` in
`~/.config/denia/client.toml` (mode `0600`). The password and session token are
never stored or logged; the minted token is verified with `GET /v1/me` before
saving.

### `denia push [--project <name>] [--service <name>] [--dockerfile <path>] [--context <dir>] [--path <dir>] [--profile <name>] [--no-follow] [--create]`
Pack the working tree (honoring `.gitignore`/`.dockerignore`), upload it, and
deploy to a remote service. Resolves the target from a `.denia` manifest (flags
override). `--no-follow` skips log tailing; `--create` creates the service first
(only when the node has a `control_domain`). See
[Deploy from your machine](../guides/deploy-from-your-machine.md).

### `denia console [service] [--project <name>] [--replica <index>]`
Open an interactive `/bin/sh` inside a running replica via a single-use ticket +
websocket. See [Service console](../guides/service-console.md).

## The daemon

```bash
denia            # no subcommand → run the control-plane daemon
```

In production the daemon runs under systemd (installed by `denia setup`); you
rarely invoke it directly outside development.
