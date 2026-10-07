FROM node:20-alpine

# Pin pnpm so dependency build policy does not change between deploys.
RUN npm install -g pnpm@10.32.1

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# This image serves TGP mocks only. Leave local Auth0 keys out of the image.
ENV TGP_ONLY=true
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src/ ./src/
COPY fixtures/ ./fixtures/

# Build
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start
CMD ["pnpm", "start:prod"]
