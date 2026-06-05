---
title: Registries
description: Project registries for pulling external images, and Denia's own hosted OCI registry.
---

# Registries

Denia deals with two distinct registry concepts.

## Project (external) registries

A **project registry** stores credentials for pulling **private external OCI
images** ([ADR-014](../architecture/design-decisions.md)). It has an `endpoint`,
an `auth_kind` (`Basic` or `Anonymous`), and an encrypted credential reference.
Services reference it by `registry_id` + `image_ref` when their source is an
external image. The control plane SOPS-encrypts the credential on the CRUD path —
see [Secrets](secrets.md).

Pulls are performed **in-process** with `oci-client` (no `skopeo`/`umoci`), and
layers are cached on disk with periodic GC
([ADR-011](../architecture/design-decisions.md),
[ADR-015](../architecture/design-decisions.md),
[ADR-022](../architecture/design-decisions.md)).

## Hosted registry (`/v2`)

Denia also **hosts its own OCI registry** as a separate subsystem
([ADR-031](../architecture/design-decisions.md)):

- **Same-origin `/v2`** — follows the OCI Distribution route shape, mounted at
  `/v2` on the same origin as the management API, outside `/v1`. No dedicated
  registry hostname is needed for a single-node install.
- **Bearer auth** — reuses `/v1` token resolution with per-repository role checks:
  push (`PUT`/`POST`/`PATCH`) requires project **Operator**, pull (`GET`/`HEAD`)
  requires **Viewer**.
- **`<project>/<service>` naming** — e.g. `/v2/default/api/manifests/latest`. Path
  segments are validated and must resolve to an existing project/service.
- **Local storage** — content-addressed blobs under `data_dir/registry`
  (`blobs/sha256/<hex>`); SQLite holds repository, manifest, tag, blob, upload, and
  GC-run metadata. Uploaded blobs are SHA-256-verified against the requested digest
  before being committed.
- **Garbage collection** — conservative; never removes a blob referenced by a
  manifest or active upload. Runs periodically and on demand via
  `POST /v1/registry/gc`.

See the [Hosted registry guide](../guides/hosted-registry.md) and the
[`/v2` API reference](../reference/api/registry-v2.md).
