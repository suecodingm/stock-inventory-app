FROM node:20-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL=http://44.198.56.147:5000

# Copy package files
COPY package*.json ./

# Install dependencies with npm install and legacy-peer-deps for AWS compatibility
RUN npm install --legacy-peer-deps

# Copy source code
COPY src ./src
COPY public ./public

# Build the app with CI=false to suppress warnings and pass API URL
RUN REACT_APP_API_URL=${REACT_APP_API_URL} npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the static build
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start application
CMD ["serve", "-s", "build", "-l", "3000"]
