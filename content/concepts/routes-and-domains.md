---
title: Routes & domains
description: Hostnames map to services; Denia verifies ownership before issuing TLS.
---

# Routes & domains

A **Route / Domain** is a hostname mapped to a service. Denia is its own L7
ingress: the in-process Pingora proxy resolves the request `Host` header to a
service and dials one of its replicas over a Unix socket. There is no separate
Traefik/nginx. See [Ingress & TLS](../architecture/ingress-and-tls.md).

## First-class domain entities

Domains are first-class SQLite entities with a verification state
([ADR-013](../architecture/design-decisions.md)):

| Status | Meaning |
| --- | --- |
| `Pending` | Attached but ownership not yet proven; not in the ingress route table |
| `Verified` | Ownership proven; eligible for routing and ACME TLS |
| `Failed` | Verification attempt failed; see `last_error` |

Only **verified** domains appear in the ingress configuration, so an unverified
hostname can never receive traffic or a certificate.

## Verify-then-issue

1. **Point DNS** at the node (`A`/`AAAA`).
2. **Attach** the domain to a service (`POST /v1/services/{id}/domains`). It starts
   `Pending`.
3. **Verify** (`POST /v1/services/{id}/domains/{domain_id}/verify`). Denia serves a
   token at `GET /.well-known/denia-challenge/{token}` that is only returned when
   the request `Host` matches — so verification passes only once DNS resolves to
   this node.
4. **TLS is automatic** for verified domains when the service has `tls_enabled`
   (requires `DENIA_ACME_EMAIL`).

Every hostname is run through `validate_domain` before it becomes a route, SNI, or
ACME identifier, and a service may not claim the node's own `control_domain`.

The control plane itself can be served over a domain on the same ingress by
setting `DENIA_CONTROL_DOMAIN` (+ `DENIA_CONTROL_TLS`);
[ADR-035](../architecture/design-decisions.md). Full walkthrough:
[Custom domains & TLS](../guides/custom-domains-tls.md).
