package services

import (
	"fmt"

	"4-babys/todo-backend/config"
	"4-babys/todo-backend/models"
)

// CreateCategory creates and saves a new category
func CreateCategory(name, description string, idUser uint64) (models.Category, error) {
	category := models.Category{
		Name:        name,
		Description: description,
		IDUser:      idUser,
	}

	// Insert category into DB
	result := config.DB.Create(&category)
	if result.Error != nil {
		return models.Category{}, result.Error
	}

	// Load User relation
	err := config.DB.Preload("User").First(&category, category.ID).Error
	if err != nil {
		return models.Category{}, err
	}

	return category, nil
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

// GetCategoriesByUser fetches all categories for a user
func GetCategoriesByUser(userID uint64) ([]models.Category, error) {
	var categories []models.Category
	err := config.DB.
		Where("id_user = ?", userID).
		Preload("User").
		Find(&categories).Error
	return categories, err
}

// UpdateCategory updates fields of an existing category, then loads relations
func UpdateCategory(id uint64, name *string, description *string) (models.Category, error) {
	var category models.Category

	// Find category by ID
	if err := config.DB.First(&category, id).Error; err != nil {
		return models.Category{}, err
	}

	// Update non-nil fields
	if name != nil {
		category.Name = *name
	}
	if description != nil {
		category.Description = *description
	}

	// Save updates
	result := config.DB.Save(&category)
	if result.Error != nil {
		return models.Category{}, result.Error
	}

	// Load User relation
	err := config.DB.Preload("User").First(&category, category.ID).Error
	if err != nil {
		return models.Category{}, err
	}

	return category, nil
}
