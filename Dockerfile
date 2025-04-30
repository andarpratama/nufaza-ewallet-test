# 1. Build stage
FROM node:20.9.0-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only what's needed
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# If you need raw Prisma schema in prod for migrations:
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the compiled server
CMD ["node", "dist/main.js"]
