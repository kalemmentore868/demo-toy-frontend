# ─── Builder ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build your Vite app
COPY . .
RUN npm run build    # outputs into /app/dist

# ─── Runner ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Install 'serve' globally for static hosting
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose port 3000 and serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
