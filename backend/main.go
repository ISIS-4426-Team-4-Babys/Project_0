package main

import (
	"4-babys/todo-backend/config"
	"4-babys/todo-backend/routes"
)

func main() {
	// Initialize database connection
	config.ConnectDB()

	// Setup API routes
	r := routes.SetupRouter()

	// Start server on port 8080
	r.Run(":8080")
}
