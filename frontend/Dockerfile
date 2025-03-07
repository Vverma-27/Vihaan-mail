# Use official Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package files for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the Next.js project
RUN pnpm build

# ==========================
# Production Image
# ==========================
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm globally again
RUN npm install -g pnpm

# Copy only required files from the builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Run Next.js app in production mode
CMD ["pnpm", "start"]
