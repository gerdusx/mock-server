FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Pre-generated test keys (no openssl/apk needed; avoids TLS issues on corporate networks)
COPY keys/ ./keys/

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start
CMD ["pnpm", "start:prod"]