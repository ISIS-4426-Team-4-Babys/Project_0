package services

import (
	"fmt"

	"4-babys/todo-backend/config"
	"4-babys/todo-backend/models"
)

func CreateCategory(name, description string) error {
	// Create category struct
	category := models.Category{
		Name:        name,
		Description: description,
	}

	// Save to DB
	result := config.DB.Create(&category)
	return result.Error
}

func DeleteCategory(id uint) error {
	// Try to delete the category by ID
	result := config.DB.Delete(&models.Category{}, id)

	// If category doesnt exist
	if result.RowsAffected == 0 {
		return fmt.Errorf("category with id %d not found", id)
	}

	return result.Error
}

func GetAllCategories() ([]models.Category, error) {
	// Declare variable
	var categories []models.Category

	// Find all the categories in DB
	result := config.DB.Find(&categories)

	return categories, result.Error
}
