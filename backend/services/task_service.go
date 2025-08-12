package services

import (
	"errors"
	"fmt"
	"time"

	"4-babys/todo-backend/config"
	"4-babys/todo-backend/models"
)

type UpdateTaskRequest struct {
	Text    *string `json:"text,omitempty"`
	EndDate *string `json:"end_date,omitempty"`
	Status  *string `json:"status,omitempty"`
}

// CreateTask creates a new task and saves it to the DB, then loads relations
func CreateTask(text string, endDate *time.Time, idCategory uint64, idUser uint64) (models.Task, error) {
	if text == "" {
		return models.Task{}, errors.New("text is required")
	}

	task := models.Task{
		Text:         text,
		CreationDate: time.Now(),
		EndDate:      endDate,
		Status:       "Sin Empezar",
		IDCategory:   idCategory,
		IDUser:       idUser,
	}

	// Insert task into DB
	result := config.DB.Create(&task)
	if result.Error != nil {
		return models.Task{}, result.Error
	}

	// Load Category and User relations
	err := config.DB.Preload("Category").Preload("User").First(&task, task.ID).Error
	if err != nil {
		return models.Task{}, err
	}

	return task, nil
}

// UpdateTask updates fields of an existing task, then loads relations
func UpdateTask(id uint64, text *string, endDate *time.Time, status *string) (models.Task, error) {
	var task models.Task

	// Find task by ID
	if err := config.DB.First(&task, id).Error; err != nil {
		return models.Task{}, err
	}

	// Update non-nil fields
	if text != nil {
		task.Text = *text
	}
	if endDate != nil {
		task.EndDate = endDate
	}
	if status != nil {
		task.Status = *status
	}

	// Save updates
	result := config.DB.Save(&task)
	if result.Error != nil {
		return models.Task{}, result.Error
	}

	// Load Category and User relations
	err := config.DB.Preload("Category").Preload("User").First(&task, task.ID).Error
	if err != nil {
		return models.Task{}, err
	}

	return task, nil
}

// DeleteTask removes a task by ID
func DeleteTask(id uint64) error {
	result := config.DB.Delete(&models.Task{}, id)
	if result.RowsAffected == 0 {
		return fmt.Errorf("task with id %d not found", id)
	}
	return result.Error
}

// GetTasksByUser fetches all tasks for a user including Category and User relations
func GetTasksByUser(userID uint64) ([]models.Task, error) {
	var tasks []models.Task
	err := config.DB.
		Where("id_user = ?", userID).
		Preload("Category").
		Preload("User").
		Find(&tasks).Error
	return tasks, err
}

// GetTaskByID retrieves a task by ID including Category and User relations
func GetTaskByID(id uint64) (models.Task, error) {
	var task models.Task
	err := config.DB.
		Preload("Category").
		Preload("User").
		First(&task, id).Error
	return task, err
}
