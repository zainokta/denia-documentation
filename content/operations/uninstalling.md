---
title: Uninstalling
description: Remove the service, and optionally wipe all state.
---

# Uninstalling

```bash
sudo denia uninstall              # stop + disable the service, remove the unit
sudo denia uninstall --purge      # also wipe /var/lib/denia and ~/.config/denia
```

Plain `uninstall` stops and disables `denia.service` and removes the systemd unit,
leaving your state and secrets intact on disk.

:::danger `--purge` is destructive and irreversible
`--purge` deletes all state, secrets, and the **age key**. Once the age key is
gone, no SOPS-encrypted secret can ever be recovered. Take a
[backup](backup-and-restore.md) first if you might want the data again.
:::

`make uninstall` (root) removes the installed binary at `/usr/local/bin/denia`
without touching state.
