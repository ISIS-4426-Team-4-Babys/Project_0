package controllers

import (
	"net/http"
	"strconv"

	"4-babys/todo-backend/services"

	"github.com/gin-gonic/gin"
)

// CreateCategoryRequest defines the expected JSON body for creating a category
type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
}

// CreateCategory handles POST /categories to create a new category
func CreateCategory(c *gin.Context) {
	var req CreateCategoryRequest

	// Bind and validate JSON request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Create category via service layer
	category, err := services.CreateCategory(req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Category created successfully",
		"category": category,
	})
}

// DeleteCategory handles DELETE /categories/:id to remove a category by ID
func DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")

	// Convert id param to uint64
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Delete category using service
	if err := services.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}

// GetAllCategories handles GET /categories to list all categories
func GetAllCategories(c *gin.Context) {
	// Fetch categories from service
	categories, err := services.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}
