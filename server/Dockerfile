# ── Backend Dockerfile (TODO 10) ────────────────────────────
# Multi-stage build for production-ready CampusConnect API

# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: Production runtime
FROM node:18-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY config/     ./config/
COPY controllers/ ./controllers/
COPY middleware/  ./middleware/
COPY models/     ./models/
COPY routes/     ./routes/
COPY utils/      ./utils/
COPY index.js    ./
COPY package.json ./

# Set environment defaults
ENV NODE_ENV=production
ENV PORT=5000

# Expose API port
EXPOSE 5000

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the application
CMD ["node", "index.js"]
