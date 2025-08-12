# Golang image tagged as builder
FROM golang:1.24.6 AS builder

# Set working directory
WORKDIR /app

# Copy only go.mod and go.sum first for caching dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Copy .env file 
COPY .env .env

# Compile statically for performance and give permits
RUN go build -o backend . && chmod +x backend

# Ligthweight Debian image to run compiled code
FROM debian:bookworm-slim

# Install SSL certificates for HTTPS requests
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy compiled binary from builder stage
COPY --from=builder /app/backend .

# Expose application port
EXPOSE 8080

# Run the binary application
CMD ["./backend"]
