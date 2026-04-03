# ── Build stage ──────────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json bun.lock* ./

# Install all dependencies (including devDeps needed for the build)
RUN bun install --frozen-lockfile

# Copy the rest of the source
COPY . .

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy installed deps and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src          ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose the port Hono/Bun listens on
EXPOSE 3000

# Run the server directly with Bun (no build step needed – Bun transpiles on the fly)
CMD ["bun", "run", "src/index.ts"]
