---
title: Ingress & TLS
description: In-process Pingora L7 proxy and in-process ACME — no Traefik, no certbot.
---

# Ingress & TLS

Denia **is** its own L7 ingress and ACME client. There is no separate Traefik,
nginx, or certbot — the proxy runs in-process on a dedicated thread. See
[ADR-020](design-decisions.md) (which supersedes the earlier managed-Traefik
[ADR-016](design-decisions.md)), plus [ADR-032](design-decisions.md) and
[ADR-035](design-decisions.md).

## In-process Pingora proxy

- An embedded **Pingora** (0.8, boringssl) proxy binds `:80` and `:443` (ports
  configurable via `DENIA_HTTP_PORT` / `DENIA_HTTPS_PORT`).
- On each request it resolves the `Host` header to a `service_id`, then dials one
  of that service's replicas **directly over its Unix socket** (`HttpPeer` over
  UDS) — there is no loopback bridge port.
- Routing state (`IngressState`: the route table + replica pools) is held in an
  `ArcSwap` for lock-free reads; deploys and autoscale events swap a new table in
  atomically.
- The ingress also records the per-request [access log](../guides/observability.md).
- HTTP/2 is hardened per [ADR-032](design-decisions.md).

## In-process ACME / TLS

- TLS certificates are issued and renewed in-process via `instant-acme` using the
  **HTTP-01** challenge — no certbot, no sidecar.
- Certificates are served **per-SNI** and persisted `0600` under
  `DENIA_TLS_DIR`; a background scan renews them before expiry, and certs are
  boot-loaded before `:443` accepts connections.
- ACME is gated to services with `tls_enabled` and **verified** domains. Set
  `DENIA_ACME_EMAIL`, and use the Let's Encrypt **staging**
  `DENIA_ACME_DIRECTORY_URL` while testing.

## Domain verification gate

Only **verified** domains enter the route table. Verification serves a token at
`GET /.well-known/denia-challenge/{token}` that is returned only when the request
`Host` matches — proving DNS points here before any cert is requested
([ADR-013](design-decisions.md)). Every hostname passes `validate_domain` before
becoming a route, SNI, or ACME identifier.

## Control-plane domain

The management API can be served on the same ingress under
`DENIA_CONTROL_DOMAIN` (+ `DENIA_CONTROL_TLS`); a workload service may not claim
that hostname ([ADR-035](design-decisions.md)). See the
[Custom domains & TLS guide](../guides/custom-domains-tls.md).
