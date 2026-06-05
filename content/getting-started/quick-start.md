---
title: Quick Start (development)
description: Run the Denia control plane locally for development.
---

# Quick Start (development)

For local development on a Linux host, you can run the control plane directly from
the source tree without the production `install.sh` flow.

```bash
# 1. Build the web console (embedded into release builds)
cd web && pnpm install && pnpm build && cd ..

# 2. Set the bootstrap admin token (required)
export DENIA_ADMIN_TOKEN="$(openssl rand -hex 32)"

# 3. Run the control plane
cargo run --release
```

The server binds `127.0.0.1:7180` by default, serving the API under `/v1` with the
console as the fallback for non-API routes.

:::caution Release builds need the web build first
A release `cargo build` embeds `web/dist/client` via `rust-embed`, and that
directory is gitignored. Build the web console (`cd web && pnpm build`) before
`cargo build --release`, or the embed will be empty.
:::

## Build targets

The `Makefile` wraps the build:

```bash
make web      # build the SPA only (pnpm install --frozen-lockfile && pnpm build)
make rust     # cargo build --release --locked
make build    # web + rust
sudo make install   # build, then install the binary to /usr/local/bin/denia
make clean    # cargo clean + remove web/dist and web/node_modules
```

## Verify the build

```bash
cargo build
cargo test
cargo fmt --all
cargo clippy --all-targets --all-features
```

Privileged runtime tests mutate namespaces, mounts, and cgroups, so they are
opt-in:

```bash
DENIA_RUN_PRIVILEGED_TESTS=1 cargo test --test linux_runtime_privileged -- --ignored
```

See [Configuration](../reference/configuration.md) for every `DENIA_*` setting,
and [Contributing](../project/contributing.md) for the workflow.
