# Use Node 20 Alpine for a minimal production image
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package files to optimize caching
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN pnpm build

# ------------------ Production Stage ------------------
FROM node:20-alpine as runner

# Set working directory
WORKDIR /app

# Copy built files and dependencies from builder stage
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production

# Expose the application's port
EXPOSE 4000

# Run the app in production mode
CMD ["node", "dist/server.js"]
