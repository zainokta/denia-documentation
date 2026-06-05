---
title: Deploy your first service
description: A complete deploy from a fresh install using the denia push client flow.
---

# Deploy your first service

A complete deploy from a fresh install, using the `denia push` client flow — no
local Docker, no git remote, no pre-deploy commit. Assumes you have run
`sudo denia setup` and created an admin account via `/v1/bootstrap` (see
[Installation](installation.md)).

## 1. Create the service

Services are created in the web console (recommended) or with `POST /v1/services`.
In the console: pick a project (a `default` project exists on a fresh install),
choose **Upload** as the source, set the listen port and health-check path, and
save. Note the service name.

## 2. Authenticate the client

On your dev machine:

```bash
denia auth --url https://your-node.example.com
# prompts for username + password; mints and stores a long-lived API token (0600)
```

## 3. Add a `.denia` manifest

Commit a `.denia` file to your project root so you don't repeat flags:

```toml
project    = "default"
service    = "api"
dockerfile = "Dockerfile"
context    = "."
```

## 4. Push

From the project directory:

```bash
denia push
```

Denia packs your working tree (honoring `.gitignore`/`.dockerignore`), uploads it,
builds the Dockerfile with BuildKit on the node, runs the health-gated deploy, and
tails the build + deploy logs until the service reports `Healthy`.

## 5. Expose it

Attach a hostname and enable TLS — see
[Custom domains & TLS](../guides/custom-domains-tls.md). Once the domain is
verified and a cert is issued, the service is live on `:443`.

## 6. Inspect it

From the console, or over the API:

```bash
TOKEN=...   # an API token, e.g. from `denia auth`
SID=...     # the service id

# recent logs
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/logs

# live runtime metrics (cgroup v2 + procfs)
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/metrics
```

For an interactive shell inside a running replica, use
[`denia console <service>`](../guides/service-console.md).
