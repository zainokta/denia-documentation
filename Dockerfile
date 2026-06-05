# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-slim AS build

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

# Install deps first for better layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the static site
COPY . .
RUN pnpm build

# ---- Serve stage ----
# Unprivileged image runs as a non-root user (uid 101) — required for read-only rootfs.
FROM nginxinc/nginx-unprivileged:1.27 AS serve

# Full main config: writable paths -> /tmp, logs -> stdout/stderr, listen 8080.
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /usr/share/nginx/html

# nginx needs a writable spot for its pid + temp dirs. The rootfs is read-only,
# so expose /tmp as a volume (writable even under `docker run --read-only`) and
# pre-create the temp dirs owned by the unprivileged user.
USER root
RUN mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp \
             /tmp/uwsgi_temp /tmp/scgi_temp \
    && chown -R 101:101 /tmp
USER 101
VOLUME ["/tmp"]

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
