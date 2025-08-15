# Use official lightweight Node.js 20 Alpine image
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy dependency definition files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (only production dependencies will be copied later)
RUN npm install

# Copy the entire frontend source code into the container
COPY . .

# Build the Next.js application for production
RUN npm run build

# -----------------------------
# Second stage: run optimized app
# -----------------------------
FROM node:20-alpine AS runner

# Set working directory inside container
WORKDIR /app

# Copy package files to runner stage
COPY --from=builder /app/package*.json ./

# Copy installed dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled Next.js build output
COPY --from=builder /app/.next ./.next

# Copy public assets
COPY --from=builder /app/public ./public

# Set environment to production for optimized performance
ENV NODE_ENV=production

# Default port for Next.js in production mode
ENV PORT=3000

# Expose port so it can be mapped outside the container
EXPOSE 3000

# Run the Next.js production server
CMD ["npm", "start"]
