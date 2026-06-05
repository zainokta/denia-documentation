---
title: Deploy an external OCI image
description: Pull and run a prebuilt OCI image, optionally from a private registry.
---

# Deploy an external OCI image

If you already have a prebuilt image, point a service at it. Denia pulls the image
**in-process** with `oci-client` (no `skopeo`/`umoci`), streams and stages layers,
unpacks the rootfs, and runs the workload. Public images need no credentials;
private images use a [project registry](../concepts/registries.md).

## Public image

Create a service whose source is **External image** with an `image` reference,
then deploy:

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"service_id":"'"$SID"'","image":"ghcr.io/you/app:1.2.3"}' \
  https://your-node.example.com/v1/deployments
```

## Private image

1. Register the external registry on the project (Operator). The control plane
   SOPS-encrypts the credential:

   ```bash
   curl -fsS -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' \
     -d '{"name":"ghcr","endpoint":"ghcr.io","auth_kind":"Basic","username":"you","password":"<token>"}' \
     https://your-node.example.com/v1/projects/$PID/registries
   ```

2. Set the service source to that `registry_id` + `image_ref`.
3. Deploy as above; the pull authenticates against the stored credential.

## Layer cache

Pulled layers are cached under `DENIA_OCI_CACHE_DIR` and reclaimed by a periodic
GC. Tune cache verification and retention with `DENIA_OCI_CACHE_VERIFY_ON_HIT`,
`DENIA_OCI_GC_INTERVAL_SECS`, and `DENIA_OCI_GC_RETENTION_SECS` — see
[Configuration](../reference/configuration.md).
