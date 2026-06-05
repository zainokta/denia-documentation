---
title: Managing secrets
description: Store environment, SOPS-encrypted secrets, and registry credentials.
---

# Managing secrets

Denia keeps sensitive values out of the database in clear. Conceptually there are
[three kinds of config data](../concepts/secrets.md); this guide is the practical
how-to.

## Plain environment variables

Set `KEY=value` pairs on a service (or shared on the project) through the console
or the service config API. They are stored in SQLite as part of the config and
injected into the workload. Viewers see them **redacted**.

## SOPS-encrypted secrets

Secret values are written to **SOPS-encrypted files** under
`<data_dir>/secrets/<project_id>/`, encrypted to the host-local **age** identity;
SQLite stores only a reference. Decryption happens at deploy time via `sops` with
`SOPS_AGE_KEY_FILE`.

The age key file is `~/.config/denia/age.key` by default
(`DENIA_AGE_KEY_FILE`). The encryption recipient is taken from
`DENIA_AGE_RECIPIENT`, or auto-derived from the `# public key:` comment that
`age-keygen` writes into the key file.

## Registry credentials

Do **not** set these via env. `POST` the raw payload to the project registry
endpoint and the control plane encrypts it for you:

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"ghcr","endpoint":"ghcr.io","auth_kind":"Basic","username":"you","password":"<token>"}' \
  https://your-node.example.com/v1/projects/$PID/registries
```

Git deploy keys are managed the same way under `.../credentials/git`.

:::danger Back up the age key first
Losing `~/.config/denia/age.key` makes **every** SOPS secret and registry
credential unrecoverable. See
[Backup & restore](../operations/backup-and-restore.md) for the priority order.
:::
