package config

import (
	"log"
	"os"
)

var JWTSecret string

func LoadConfig() {

	// Load JWT secret
	JWTSecret = os.Getenv("JWT_SECRET")
	if JWTSecret == "" {
		log.Fatal("JWT_SECRET is not set in .env or system")
	}
}
