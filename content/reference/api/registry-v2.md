---
title: /v2 registry API
description: The hosted OCI Distribution endpoints, mounted at /v2 on the same origin.
---

# `/v2` registry API

Denia's [hosted registry](../../guides/hosted-registry.md) follows the **OCI
Distribution** route shape, mounted at `/v2` on the same origin as the management
API, outside `/v1` ([ADR-031](../../architecture/design-decisions.md)).

## Auth

`/v2` reuses the same `Authorization: Bearer <token>` resolution as `/v1`, with
per-repository role checks:

| Operation | Methods | Required role |
| --- | --- | --- |
| Pull | `GET`, `HEAD` | Viewer |
| Push | `PUT`, `POST`, `PATCH` | Operator |

Repository names map to `<project>/<service>` and must resolve to an existing
project and service.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/v2/` | API version check (Distribution base) |
| `GET` / `HEAD` | `/v2/{project}/{service}/manifests/{ref}` | Fetch / check a manifest by tag or digest |
| `PUT` | `/v2/{project}/{service}/manifests/{ref}` | Push a manifest |
| `GET` / `HEAD` | `/v2/{project}/{service}/blobs/{digest}` | Fetch / check a blob |
| `POST` | `/v2/{project}/{service}/blobs/uploads/` | Begin an upload session |
| `PATCH` | `/v2/{project}/{service}/blobs/uploads/{uuid}` | Append a chunk |
| `PUT` | `/v2/{project}/{service}/blobs/uploads/{uuid}?digest=...` | Commit the upload (digest-verified) |

## Storage notes

Blobs and manifests are content-addressed under `data_dir/registry`
(`blobs/sha256/<hex>`); upload sessions live under `registry/uploads/<uuidv7>/`.
Uploaded blobs are SHA-256-verified against the requested digest before being
committed. Size guards: `DENIA_REGISTRY_MAX_BLOB_BYTES` (10 GiB) and
`DENIA_REGISTRY_MAX_MANIFEST_BYTES` (16 MiB). Conservative
[garbage collection](../../guides/hosted-registry.md#garbage-collection) reclaims
unreferenced blobs.

:::note
Docker-compatible `docker login` is a future amendment; today, authenticate with a
Denia bearer token directly.
:::
