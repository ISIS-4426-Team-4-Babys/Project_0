package config

import (
	"fmt"
	"log"
	"os"

	"4-babys/todo-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB initializes the database connection and runs migrations
func ConnectDB() {
	// Load database configuration from environment variables
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	// Build the DSN (Data Source Name) string
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, name, port,
	)

	// Establish connection to the PostgreSQL database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln("Failed to connect to database:", err)
	}

	// Run automatic schema migrations for User, Task, and Category models
	if err = DB.AutoMigrate(&models.User{}, &models.Task{}, &models.Category{}); err != nil {
		log.Fatalln("Migration error:", err)
	}

	log.Println("Database connected and migrated successfully")
}
