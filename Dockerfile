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
FROM nginx:1.27 AS serve

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
