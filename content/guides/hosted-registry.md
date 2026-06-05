---
title: Using the hosted registry
description: Push and pull images to Denia's own /v2 OCI registry.
---

# Using the hosted registry

Denia hosts its own OCI registry at `/v2`, on the same origin as the management
API ([ADR-031](../architecture/design-decisions.md)). It follows the OCI
Distribution route shape, so standard OCI tooling can talk to it once
authenticated with a Denia bearer token.

## Naming

Repositories map to `<project>/<service>`, e.g.
`https://your-node.example.com/v2/default/api/manifests/latest`. Path segments are
validated and must resolve to an existing project and service.

## Auth & roles

`/v2` reuses the same `Authorization: Bearer <token>` resolution as `/v1`, with
per-repository role checks:

| Operation | HTTP | Required role |
| --- | --- | --- |
| Pull | `GET` / `HEAD` | Viewer |
| Push | `PUT` / `POST` / `PATCH` | Operator |

Docker-compatible `docker login` is a future amendment; today you authenticate
with a bearer token directly.

## Storage & limits

Blob and manifest bytes are content-addressed under `data_dir/registry`
(`blobs/sha256/<hex>`); upload sessions live under `registry/uploads/<uuidv7>/`.
Uploaded blobs are SHA-256-verified against the requested digest before being
committed. Size guards: `DENIA_REGISTRY_MAX_BLOB_BYTES` (default 10 GiB) and
`DENIA_REGISTRY_MAX_MANIFEST_BYTES` (default 16 MiB).

## Garbage collection

Conservative GC reclaims unreferenced blobs older than a grace period and never
removes a blob referenced by a manifest or an active upload. It runs both on a
periodic background task and on demand:

```bash
# status (Viewer)
curl -fsS -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/registry/status

# trigger GC now (super-admin)
curl -fsS -X POST -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/registry/gc
```

Tune with `DENIA_REGISTRY_GC_INTERVAL_SECS` (default 24h) and
`DENIA_REGISTRY_GC_GRACE_SECS` (default 1h). Status is also visible in the console
under Settings → Hosted registry. Full route shape:
[`/v2` API reference](../reference/api/registry-v2.md).
