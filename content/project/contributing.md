---
title: Contributing
description: How to build, verify, and submit changes to Denia.
---

# Contributing

Read [`CLAUDE.md`](https://github.com/zainokta/denia/blob/main/CLAUDE.md) /
[`AGENTS.md`](https://github.com/zainokta/denia/blob/main/AGENTS.md) and the
[ADR index](architecture/design-decisions.md) before changing anything.
Architecture changes (runtime isolation, ingress, secrets, persistence, API,
dependencies) need a **new or updated ADR**.

## Verification

```bash
cargo build
cargo test
cargo fmt --all
cargo clippy --all-targets --all-features
```

Privileged runtime tests mutate namespaces, mounts, and cgroups, so they are
gated and opt-in:

```bash
DENIA_RUN_PRIVILEGED_TESTS=1 cargo test --test linux_runtime_privileged -- --ignored
```

The test suite under `tests/` covers API contracts, CLI flows (`assert_cmd` +
`httpmock`), deployment orchestration, domain verification, hosted-registry
contract + GC, ingress end-to-end, repository persistence, autoscaling lifecycle,
and the privileged Linux runtime.

## Conventions

- **Commit format:** `<type>(<scope>): concise message`, where type is `feat`,
  `fix`, `docs`, `test`, or `refactor`.
- All persisted IDs are **UUIDv7** (`uuid::Uuid::now_v7()`); never use v4/v1.
- Use `axum` for HTTP, explicit domain types at boundaries, typed errors over
  panics, and keep blocking filesystem/SQLite work off the async path.
- **Never commit** secrets, local keys, tokens, or generated private config.

## Project facts

- **Language:** Rust 2024 edition. **Version:** 1.1.1. **License:** Apache 2.0.
- **Repository:** [github.com/zainokta/denia](https://github.com/zainokta/denia).
- Key dependencies: `axum` + `tokio`, `pingora`, `instant-acme`, `oci-client`,
  `rustix`, `rusqlite`, SOPS + age, BuildKit.
