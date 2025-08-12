package main

import (
	"4-babys/todo-backend/config"
	"4-babys/todo-backend/routes"
)

func main() {

	// Connect to db
	config.ConnectDB()
	// Set up API routes
	r := routes.SetupRouter()
	// Expose API
	r.Run(":8080")
}
