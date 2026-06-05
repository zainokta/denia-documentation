# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20-alpine AS build

# Enable pnpm via corepack
RUN corepack enable

WORKDIR /app

# Install deps first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build the static site
COPY . .
RUN pnpm build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
