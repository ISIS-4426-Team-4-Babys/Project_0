package config

import (
	"log"
	"os"
)

var JWTSecret string

// LoadConfig loads environment variables needed for the app
func LoadConfig() {
	// Retrieve JWT secret from environment variables
	JWTSecret = os.Getenv("JWT_SECRET")
	if JWTSecret == "" {
		log.Fatal("JWT_SECRET is not set in environment")
	}
}
