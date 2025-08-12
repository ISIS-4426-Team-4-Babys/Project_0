package controllers

import (
	"net/http"
	"strconv"
	"time"

	"4-babys/todo-backend/services"

	"github.com/gin-gonic/gin"
)

// CreateTaskRequest defines JSON body for creating a task
type CreateTaskRequest struct {
	Text       string     `json:"text" binding:"required"`
	EndDate    *time.Time `json:"end_date"` // optional
	IDCategory uint64     `json:"id_category" binding:"required"`
}

// UpdateTaskRequest defines JSON body for updating a task
type UpdateTaskRequest struct {
	Text    *string    `json:"text,omitempty"`
	EndDate *time.Time `json:"end_date,omitempty"`
	Status  *string    `json:"status,omitempty"`
}

// CreateTask handles POST /tasks to create a new task
func CreateTask(c *gin.Context) {
	var req CreateTaskRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Extract user ID from context (set by JWT middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Assert userID type
	uid, ok := userID.(uint64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	// Create task via service layer
	task, err := services.CreateTask(req.Text, req.EndDate, req.IDCategory, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create task"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Task created successfully",
		"task":    task,
	})
}

// UpdateTask handles PUT /tasks/:id to update task fields
func UpdateTask(c *gin.Context) {
	idStr := c.Param("id")

	// Parse task ID param
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var req UpdateTaskRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update task via service layer
	task, err := services.UpdateTask(uint64(id64), req.Text, req.EndDate, req.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Task updated successfully",
		"task":    task,
	})
}

// DeleteTask handles DELETE /tasks/:id to remove a task
func DeleteTask(c *gin.Context) {
	idStr := c.Param("id")

	// Parse task ID param
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	// Delete task via service
	if err := services.DeleteTask(uint64(id64)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

// GetTasksByUser handles GET /tasks/user to fetch tasks for authenticated user
func GetTasksByUser(c *gin.Context) {
	// Extract user ID from context (set by JWT middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Assert userID type
	uid, ok := userID.(uint64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	// Retrieve tasks from service
	tasks, err := services.GetTasksByUser(uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GetTaskByID handles GET /tasks/:id to retrieve a task by ID
func GetTaskByID(c *gin.Context) {
	idStr := c.Param("id")

	// Parse task ID param
	id64, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	// Get task from service
	task, err := services.GetTaskByID(uint64(id64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}
