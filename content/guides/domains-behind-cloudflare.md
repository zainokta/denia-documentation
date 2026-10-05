---
title: Domains behind Cloudflare
description: Keep HTTP-01 certificates and domain verification working when a hostname is proxied by Cloudflare, with no Cloudflare API token.
---

# Domains behind Cloudflare

You can put a Denia hostname behind a proxied ("orange cloud") Cloudflare record
and still get Let's Encrypt certificates from Denia. You do not need a Cloudflare
API token, and Denia holds no DNS credentials. The work is a few settings in the
Cloudflare dashboard.

## Why it works

Denia proves domain ownership twice, and both checks use plain HTTP on `:80`:

- **Domain verification** ([step 3 of the domains guide](custom-domains-tls.md#3-verify-ownership))
  fetches `http://<host>/.well-known/denia-challenge/<token>`.
- **ACME HTTP-01** has Let's Encrypt fetch
  `http://<host>/.well-known/acme-challenge/<token>`.

In the **Full** and **Full (strict)** encryption modes, Cloudflare forwards a
plain-HTTP request to your origin's port 80. Denia's `:80` listener answers both
challenge paths before it does anything else, including its own HTTPS redirect.
So the challenges reach Denia as long as Cloudflare passes them through without
redirecting or blocking them.

This is the token-free path other proxies use behind Cloudflare too: Traefik's
`httpChallenge`, Caddy's default issuer, and certbot's nginx plugin are all
HTTP-01. Their other option is DNS-01, which needs a DNS provider API token.

## Cloudflare settings

Set these on the zone before you attach the domain to a service.

### 1. Encryption mode: Full (strict)

**SSL/TLS > Overview > Configure**: choose **Full (strict)**. Cloudflare then
validates the Let's Encrypt certificate Denia serves on `:443`.

Do not use these modes:

- **Flexible.** Cloudflare always talks to the origin over HTTP, Denia answers
  with a 308 redirect to HTTPS, and the browser loops forever
  (`ERR_TOO_MANY_REDIRECTS`).
- **Strict (SSL-Only Origin Pull).** Cloudflare sends every request to the origin
  over HTTPS, including the challenges. Before the first certificate exists,
  Denia has nothing to serve for that hostname, so issuance can never start.

Until the first certificate is issued, HTTPS visitors get a Cloudflare 5xx error
page (525 or 526). The HTTP challenges are not affected.

### 2. Always Use HTTPS: off

**SSL/TLS > Edge Certificates > Always Use HTTPS**: turn it off.

Denia's domain verifier does not follow redirects. If Cloudflare answers the
verification request with a 301, verification fails with `http 301`. You don't
lose HTTPS for visitors: for every `tls_enabled` service and a TLS control
domain, Denia itself redirects HTTP to HTTPS with a 308.

If you want Cloudflare to do the redirect anyway, keep Always Use HTTPS off and
create a **Redirect Rule** that skips the challenge paths:

```txt
(not ssl
  and not starts_with(http.request.uri.path, "/.well-known/acme-challenge/")
  and not starts_with(http.request.uri.path, "/.well-known/denia-challenge/"))
```

Set the action to a dynamic redirect to
`concat("https://", http.host, http.request.uri.path)` with status 308, and turn
on **Preserve query string**.

### 3. Bot Fight Mode: off

**Security > Bots**: turn off **Bot Fight Mode**. It challenges automated
clients, which includes Let's Encrypt's validators, Denia's verifier, and the
`denia` CLI. A request it blocks gets a 403.

On the Free plan you can't make an exception: Cloudflare runs Bot Fight Mode
outside the rules engine, so Skip rules have no effect on it. On Pro and higher,
Super Bot Fight Mode can be skipped with the rule in the next step.

### 4. Skip rule for challenges (and the API)

If you use WAF custom rules, managed challenges, rate limiting, or Cloudflare
Access on this hostname, add a **WAF custom rule** with the action **Skip** and
place it first:

```txt
(starts_with(http.request.uri.path, "/.well-known/acme-challenge/")
  or starts_with(http.request.uri.path, "/.well-known/denia-challenge/"))
```

If the hostname is your [control domain](custom-domains-tls.md#serving-the-control-plane-over-a-domain),
the `denia` CLI and API clients need to get through too. Add these paths to the
same rule:

```txt
  or starts_with(http.request.uri.path, "/v1/")
  or http.request.uri.path eq "/healthz"
```

The management API stays protected by its bearer token. The rule only stops
Cloudflare from showing a browser challenge to a CLI that cannot solve it.

## Bring the domain online

With the settings above in place, the normal flow works unchanged:

1. Create a proxied `A`/`AAAA` record pointing at the node's public IP.
2. [Attach the domain](custom-domains-tls.md#2-attach-the-domain) to the service.
3. [Verify it](custom-domains-tls.md#3-verify-ownership).
4. Enable `tls_enabled` on the service. Denia requests the certificate over
   HTTP-01 and renews it on its background scan.

If something on the zone still interferes and you can't find it, switch the
record to **DNS only** (grey cloud), finish steps 2 to 4, and switch it back to
**Proxied** once the certificate is served. Renewals also use HTTP-01, so you
still have to fix the setting before the certificate expires.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| Verification fails with `http 301` or `http 308` | Always Use HTTPS, or a redirect rule that does not skip `/.well-known/denia-challenge/` |
| Verification fails with `http 403`, or ACME reports unauthorized | Bot Fight Mode, a WAF rule, or Cloudflare Access is blocking the challenge |
| `denia` CLI gets 403 from the control domain | Bot Fight Mode or a WAF challenge on `/v1/` |
| Browser shows `ERR_TOO_MANY_REDIRECTS` | Encryption mode is Flexible |
| HTTPS shows Cloudflare 525/526 after issuance should have finished | The certificate was not issued; check the steps above and the daemon log |

## Limits

- Denia issues one certificate per hostname. HTTP-01 cannot issue wildcard
  certificates (`*.example.com`).
- Every renewal goes through the same path, so changing these Cloudflare
  settings later can break renewal without any change on the node.
