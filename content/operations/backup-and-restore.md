---
title: Backup & restore
description: What to back up — age key first — and how to restore on a new host.
---

# Backup & restore

State lives in two places: the **operator config** at `~/.config/denia/` and the
**data directory** at `$DENIA_DATA_DIR` (default `/var/lib/denia`).

## What to back up (priority order)

| Path | Why it matters | Replaceable? |
| --- | --- | --- |
| `~/.config/denia/age.key` | Decrypts **all** SOPS secrets | **No — back this up first** |
| `<data_dir>/secrets/` | SOPS-encrypted secrets + registry creds | No (needs `age.key`) |
| `<data_dir>/sqlite/denia.sqlite3` | Control-plane state (services, deployments, users, routes, jobs) | No |
| `~/.config/denia/{config.toml,admin.token}` | Node config + bootstrap token | Regenerable, but easier to keep |
| `<tls_dir>` (`DENIA_TLS_DIR`) | Issued certs + ACME account key | Yes — re-issued via ACME (back up to dodge rate limits) |
| `<data_dir>/registry/` | Hosted-registry image blobs | Only if Denia is the sole copy of those images |

:::danger The age key is irreplaceable
Lose `~/.config/denia/age.key` and every SOPS-encrypted secret and registry
credential becomes unrecoverable. Back it up first, off-host.
:::

## Restore on a new host

1. Install the binary and run `sudo denia setup`.
2. **Stop the service.**
3. Restore the files above to the same paths, preserving ownership/modes —
   `age.key` is `0640 <operator>:denia`.
4. Start the service.

Copy the SQLite file while the daemon is stopped, or use SQLite's online `.backup`
for a consistent snapshot.
