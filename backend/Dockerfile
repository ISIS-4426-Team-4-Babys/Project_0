# Use official Golang image as build stage
FROM golang:1.24.6 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first to leverage Docker cache
COPY go.mod go.sum ./

# Download Go modules (dependencies)
RUN go mod download

# Copy the rest of the source code into the container
COPY . .

# Copy environment variables file
COPY .env .env

# Build the Go application binary and make it executable
RUN go build -o backend . && chmod +x backend

# Use lightweight Debian image to run the compiled binary
FROM debian:bookworm-slim

# Install SSL certificates needed for HTTPS communication
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory for runtime image
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /app/backend .

# Expose port 8080 for the app
EXPOSE 8080

# Run the compiled binary on container start
CMD ["./backend"]
