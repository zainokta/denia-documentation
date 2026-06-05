---
title: Secrets & environment
description: Three kinds of config data — plain env, SOPS-encrypted secrets, and registry credentials.
---

# Secrets & environment

Denia separates three kinds of configuration data.

## 1. Environment variables

Plain `KEY=value` pairs on a service, with shared defaults on its project. Stored
in SQLite as part of the service config and injected into the workload. **Viewers
see env values redacted**; only Operators and above see raw values over the API
and console.

## 2. Secrets

Sensitive values that must not sit in the database in clear. They are written to
**SOPS-encrypted files** under `<data_dir>/secrets/<project_id>/`, encrypted to a
host-local **age** identity; SQLite stores only a **reference**, never the value.
Decryption happens at deploy time via `sops` with `SOPS_AGE_KEY_FILE`. See
[ADR-021](../architecture/design-decisions.md) and
[ADR-023](../architecture/design-decisions.md).

## 3. Registry credentials

Credentials for pulling private external OCI images. You `POST` the raw payload to
`/v1/projects/{project_id}/registries`; the **control plane SOPS-encrypts it for
you** (no operator-managed `secret_ref`). A service then references the registry
by `registry_id` + `image_ref`. Git deploy keys are managed the same way under
`.../credentials/git`.

:::danger The age key is the root of trust
The age private key (`~/.config/denia/age.key` by default) decrypts **every** SOPS
secret. Lose it and all encrypted secrets and registry credentials become
unrecoverable. **Back it up first** — see
[Backup & restore](../operations/backup-and-restore.md).
:::

Practical walkthrough: [Managing secrets](../guides/managing-secrets.md).
