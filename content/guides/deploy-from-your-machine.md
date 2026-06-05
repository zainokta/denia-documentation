---
title: Deploy from your machine (denia push)
description: Push your working tree to a remote node — no local Docker, no git remote.
---

# Deploy from your machine (`denia push`)

`denia push` deploys the current working tree to a remote Denia node — no local
Docker, no git remote, no pre-deploy commit. See
[ADR-034](../architecture/design-decisions.md).

## Authenticate once

```bash
denia auth [--url <URL>] [--username <user>] [--profile <name>]
```

`denia auth` prompts for the remote URL, username, and password (hidden input). It
logs in via `/v1/auth/login`, mints a long-lived named API token via
`/v1/api-tokens`, and saves only `{url, token}` to `~/.config/denia/client.toml`
(mode `0600`). The password and the session token are **never stored or logged**.
The minted token is verified with `GET /v1/me` before saving. Flags: `--url`,
`--username`, `--profile`, `--token-name`, `--password-stdin`.

## The `.denia` manifest

Commit a `.denia` file in the project root to record the target:

```toml
project    = "default"
service    = "api"
dockerfile = "Dockerfile"   # optional, default
context    = "."            # optional, default
```

An optional `[create]` block supplies defaults for `denia push --create`:

```toml
[create]
port        = 8080
health_path = "/healthz"    # optional, default "/"
```

## Push a deploy

```bash
denia push [--project <name>] [--service <name>] [--dockerfile <path>] \
           [--context <dir>] [--path <dir>] [--profile <name>] [--no-follow] \
           [--create]
```

`denia push` resolves the target from `.denia` (flags override), then:

1. Verifies the Dockerfile exists on disk.
2. Packs the working tree into a `tar.zst` build context — tracked and untracked
   files honoring `.gitignore` and `.dockerignore`; the Dockerfile is always
   included.
3. Streams the archive to `POST /v1/services/{id}/uploads`.
4. Creates a deployment with the returned `upload_id`
   (`POST /v1/deployments`, source `upload`).
5. Tails the SSE deploy-log stream and polls for `Healthy`/`Failed`
   (suppressed with `--no-follow`).

The node builds the uploaded context with BuildKit and runs the existing
[health-gated deploy](../concepts/deployments.md). The staged upload is deleted
after the build.

`--create` creates the service first, but only when the node has a
`control_domain` configured; otherwise it is refused — create the service in the
console instead. A `[create]` block is required when using `--create`.

## v1 constraints

- Builds are **Dockerfile-only** — no buildpacks or Nixpacks.
- Each push uploads a **full** context (no incremental upload).
- Build contexts may **not** contain symlinks/hardlinks that escape the root (the
  server rejects them for host-root safety).
