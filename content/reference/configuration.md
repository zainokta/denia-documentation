---
title: Configuration reference
description: Every DENIA_* environment variable and TOML key, with defaults.
---

# Configuration reference

Configuration is read from a TOML file (`FileConfig` in `src/config.rs`); the
daemon writes a fully-populated default template on first boot. **Every field can
be overridden by a `DENIA_*` environment variable — env wins.** See
[ADR-023](../architecture/design-decisions.md).

## Resolution order

Value precedence (first match wins):

1. `DENIA_*` environment variable
2. TOML file value
3. Hardcoded default

Config file path (first match wins): `$DENIA_CONFIG_FILE` (or the CLI `--config`
flag) → operator home via `$SUDO_USER` → `$XDG_CONFIG_HOME/denia/config.toml` →
`$HOME/.config/denia/config.toml` → `/root/.config/denia/config.toml`.

## Core

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_ADMIN_TOKEN` | `admin_token` | auto-generated 64 hex | Bootstrap bearer for `/v1` (min 64 chars) |
| `DENIA_BIND_ADDR` | `bind_addr` | `127.0.0.1:7180` | Management API listen address |
| `DENIA_DATA_DIR` | `data_dir` | `/var/lib/denia` | Root for state, artifacts, runtime, logs |
| `DENIA_DATABASE_PATH` | `database_path` | `<data_dir>/sqlite/denia.sqlite3` | SQLite database path |
| `DENIA_CONFIG_FILE` | — | resolved (see above) | Explicit config file path (CLI `--config`) |

## External binaries

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_BUILDKIT_BINARY` | `buildkit_binary` | `buildctl` | BuildKit client for Git/Upload builds |
| `DENIA_GIT_BINARY` | `git_binary` | `git` | Git client |
| `DENIA_SOPS_BINARY` | `sops_binary` | `sops` | SOPS for secret decryption |
| `DENIA_SOCKET_PROXY_BINARY` | `socket_proxy_binary` | current exe / `/usr/local/bin/denia` | Stage-1 socket-proxy helper |

## Runtime & cgroups

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_CGROUP_ROOT` | `cgroup_root` | `/sys/fs/cgroup/denia` | Cgroup v2 root for workloads |
| `DENIA_USERNS_BASE` | `userns_base` | `100000` | Host uid that workload uid 0 maps to |
| `DENIA_USERNS_SIZE` | `userns_size` | `65536` | User-namespace mapping range size |

## Ingress, TLS & ports

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_HTTP_PORT` | `http_port` | `80` | Pingora HTTP listen port |
| `DENIA_HTTPS_PORT` | `https_port` | `443` | Pingora HTTPS listen port |
| `DENIA_TCP_PORT_RANGE` | `tcp_port_range` | `20000-29999` | Reserved TCP port range |
| `DENIA_UDP_PORT_RANGE` | `udp_port_range` | `30000-39999` | Reserved UDP port range |
| `DENIA_ACME_EMAIL` | `acme_email` | — | ACME account email (required when any service uses TLS) |
| `DENIA_ACME_DIRECTORY_URL` | `acme_directory_url` | Let's Encrypt prod | Use the LE **staging** URL for non-prod |
| `DENIA_TLS_DIR` | `tls_dir` | `<data_dir>/tls` | ACME account key + per-domain certs |
| `DENIA_CONTROL_DOMAIN` | `control_domain` | — | Optional custom domain for the control plane ([ADR-035](../architecture/design-decisions.md)) |
| `DENIA_CONTROL_TLS` | `control_tls` | `false` | Enable TLS on the control domain |

## Secrets (age / SOPS)

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_AGE_KEY_FILE` | `age_key_file` | `~/.config/denia/age.key` | Age private key; passed to `sops` as `SOPS_AGE_KEY_FILE` |
| `DENIA_AGE_RECIPIENT` | `age_recipient` | auto-derived from key file | Age public key for encryption (from the `# public key:` comment if unset) |
| `SOPS_AGE_KEY_FILE` | — | set by daemon | Decryption key path used by `sops` at deploy time |

## Autoscaling

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_AUTOSCALE_INTERVAL_S` | `autoscale_interval_s` | `15` | Control-loop tick (seconds) |
| `DENIA_AUTOSCALE_HEADROOM_CPU_MILLIS` | `autoscale_headroom_cpu_millis` | `1000` | Reserved CPU headroom |
| `DENIA_AUTOSCALE_HEADROOM_MEM_BYTES` | `autoscale_headroom_mem_bytes` | `536870912` (512 MiB) | Reserved memory headroom |

## OCI layer cache (external pulls)

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_OCI_CACHE_DIR` | `oci_cache_dir` | `<data_dir>/oci-cache` | Persistent layer cache root |
| `DENIA_OCI_CACHE_VERIFY_ON_HIT` | `oci_cache_verify_on_hit` | `size` | Hit verification: `none` / `size` / `full` |
| `DENIA_OCI_GC_INTERVAL_SECS` | `oci_gc_interval_secs` | `604800` (7d) | Cache GC scan interval |
| `DENIA_OCI_GC_RETENTION_SECS` | `oci_gc_retention_secs` | `604800` (7d) | Blob retention threshold |

## Hosted registry

| Env override | Default | Purpose |
| --- | --- | --- |
| `DENIA_REGISTRY_GC_INTERVAL_SECS` | `86400` (24h) | Hosted registry GC scan interval |
| `DENIA_REGISTRY_GC_GRACE_SECS` | `3600` (1h) | Grace period guarding in-flight pushes |
| `DENIA_REGISTRY_MAX_BLOB_BYTES` | `10737418240` (10 GiB) | Max size per blob upload |
| `DENIA_REGISTRY_MAX_MANIFEST_BYTES` | `16777216` (16 MiB) | Max manifest size |

## Uploads (`denia push`)

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_UPLOADS_DIR` | `uploads_dir` | `<data_dir>/uploads` | Staging area for push tarballs |
| `DENIA_UPLOAD_MAX_BYTES` | `upload_max_bytes` | `536870912` (512 MiB) | Max compressed (on-the-wire) body |
| `DENIA_UPLOAD_MAX_UNCOMPRESSED_BYTES` | `upload_max_uncompressed_bytes` | `2147483648` (2 GiB) | Max extracted size |
| `DENIA_UPLOAD_MAX_ENTRIES` | `upload_max_entries` | `200000` | Max tar entries per archive |
| `DENIA_UPLOAD_TTL_SECS` | `upload_ttl_secs` | `3600` (1h) | TTL before a staged upload is GC-eligible |

## Observability

| Env override | TOML key | Default | Purpose |
| --- | --- | --- | --- |
| `DENIA_NODE_DISK_PATH` | `node_disk_path` | `<data_dir>` | Path used for disk-usage metrics (`statvfs`) |

:::note Source of truth
The authoritative list lives in `src/config.rs`. Defaults shown here track that
file; if you build from a newer revision, the first-boot `config.toml` template is
always the ground truth for your version.
:::
