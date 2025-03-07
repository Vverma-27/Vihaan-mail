# Use Node 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package files to optimize caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 4000

# Run the app
CMD ["pnpm", "dev"]
