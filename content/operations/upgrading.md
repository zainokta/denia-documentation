---
title: Upgrading
description: Self-update from signed GitHub release binaries.
---

# Upgrading

```bash
sudo denia update                 # update to the latest signed release and restart
denia update --check              # report whether a newer release exists (no root)
sudo denia update --tag v0.2.0    # pin a specific release tag
sudo denia update --force         # reinstall even if not newer
```

`denia update` downloads the prebuilt binary for your architecture from the GitHub
release, verifies it against a **pinned minisign signature** over `SHA256SUMS`
(fail-closed), atomically swaps `/usr/local/bin/denia`, and restarts
`denia.service`. See [ADR-029](../architecture/design-decisions.md).

:::caution glibc floor
Release binaries are built on Ubuntu 24.04, so they require **glibc ≥ 2.39**. On
older hosts `denia update` cannot run a fetched binary — rebuild from source
instead (see [Quick Start](../getting-started/quick-start.md)).
:::

Releases are produced by the project's GitHub release workflow; the signature
chain is what makes the unattended self-update safe.
