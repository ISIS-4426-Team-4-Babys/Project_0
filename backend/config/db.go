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

func ConnectDB() {

	// Get and set importante variables
	host := os.Getenv("DB_HOST")
	log.Println(host)
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	// Create DSN string
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, name, port,
	)

	// Connect to DB
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalln("Error connecting to the database:", err)
	}

	// Automatic migrations
	err = DB.AutoMigrate(&models.User{}, &models.Task{}, &models.Category{})
	if err != nil {
		log.Fatalln("Error running migrations:", err)
	}

	fmt.Println("Database connected and migrated")
}
