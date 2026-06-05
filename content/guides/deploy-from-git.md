---
title: Deploy from a Git repository
description: Build and deploy a service from a Git repo over SSH using BuildKit.
---

# Deploy from a Git repository

Denia builds Git sources with **BuildKit** on the node. You supply a repo URL, a
ref, a Dockerfile path, and a context path; Denia clones over SSH using a
project-scoped deploy key and builds the image in-process.

## 1. Add a Git deploy key

Store an SSH deploy key on the project (Operator):

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"private_key":"-----BEGIN OPENSSH PRIVATE KEY-----\n..."}' \
  https://your-node.example.com/v1/projects/$PID/credentials/git
```

The control plane SOPS-encrypts the key; SQLite stores only a reference. Add the
matching public key as a deploy key on your Git host.

## 2. Create a service with a Git source

Set the source to **Git** with the repo URL, ref, `dockerfile_path`, and
`context_path` (web console or `POST /v1/services`).

## 3. Deploy

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"service_id":"'"$SID"'","repo_url":"git@github.com:you/app.git","git_ref":"main"}' \
  https://your-node.example.com/v1/deployments
```

Denia clones the ref, builds the Dockerfile with BuildKit into an OCI layout,
bundles the rootfs, and runs the [health-gated deploy](../concepts/deployments.md).
Tail the build with `GET /v1/deployments/{id}/logs/stream`.

:::tip Prefer pushing your working tree?
If you don't want a Git remote or a deploy key, use
[`denia push`](deploy-from-your-machine.md) to upload your working tree directly.
:::

## Requirements

BuildKit (`buildctl`) must be available — `denia setup` provisions it. Builds are
**Dockerfile-only** in v1 (no buildpacks/Nixpacks).
