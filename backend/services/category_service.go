package services

import (
	"fmt"

	"4-babys/todo-backend/config"
	"4-babys/todo-backend/models"
)

// CreateCategory creates and saves a new category
func CreateCategory(name, description string) (models.Category, error) {
	category := models.Category{
		Name:        name,
		Description: description,
	}

	// Insert category into DB
	result := config.DB.Create(&category)
	return category, result.Error
}

// DeleteCategory removes a category by ID
func DeleteCategory(id uint) error {
	result := config.DB.Delete(&models.Category{}, id)

	// Return error if no rows were affected
	if result.RowsAffected == 0 {
		return fmt.Errorf("category with id %d not found", id)
	}

	return result.Error
}

// GetAllCategories retrieves all categories from DB
func GetAllCategories() ([]models.Category, error) {
	var categories []models.Category

	result := config.DB.Find(&categories)
	return categories, result.Error
}
