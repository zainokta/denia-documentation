---
title: Custom domains & TLS
description: Bring a domain online with verify-then-issue and automatic per-SNI TLS.
---

# Custom domains & TLS

Denia is its own L7 ingress and ACME client — there is no separate Traefik/nginx
or certbot. Bringing a domain online is a **verify-then-issue** flow
([ADR-013](../architecture/design-decisions.md),
[ADR-020](../architecture/design-decisions.md)).

## 1. Point DNS

Create an `A`/`AAAA` record for the hostname pointing at the node's public IP.

## 2. Attach the domain

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"hostname":"app.example.com"}' \
  https://your-node.example.com/v1/services/$SID/domains
```

It starts **unverified** and is not yet in the ingress route table.

## 3. Verify ownership

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  https://your-node.example.com/v1/services/$SID/domains/$DID/verify
```

Denia serves a token at `GET /.well-known/denia-challenge/{token}` that is only
returned when the request `Host` matches, so verification passes only once DNS
resolves to this node.

## 4. TLS is automatic

Enable `tls_enabled` on the service (requires `DENIA_ACME_EMAIL`). For each
**verified** domain Denia issues a certificate over ACME **HTTP-01** via
`instant-acme`, serves it per-SNI, persists it `0600` under `<tls_dir>`, and renews
it on a background scan.

:::caution Use staging while testing
Set `DENIA_ACME_DIRECTORY_URL` to the Let's Encrypt **staging** endpoint for
non-production to avoid burning production rate limits, then switch back.
:::

## Serving the control plane over a domain

The control plane itself can be served on the same ingress by setting
`DENIA_CONTROL_DOMAIN` (+ `DENIA_CONTROL_TLS`); a workload service may not claim
that hostname. See [ADR-035](../architecture/design-decisions.md).

## Troubleshooting

If TLS fails: confirm DNS resolves here, the domain is **verified**,
`DENIA_ACME_EMAIL` is set, and `:80` is reachable from the public internet
(HTTP-01 requirement). More in [Troubleshooting](../operations/troubleshooting.md).
