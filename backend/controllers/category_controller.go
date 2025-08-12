package controllers

import (
	"net/http"
	"strconv"

	"4-babys/todo-backend/services"

	"github.com/gin-gonic/gin"
)

// Request boydy for creating a category
type CreateCategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

// POST /categories
func CreateCategory(c *gin.Context) {
	var req CreateCategoryRequest

	// Format error
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Service error
	err := services.CreateCategory(req.Name, req.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create category"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Category created successfully"})
}

// DELETE /categories/:id
func DeleteCategory(c *gin.Context) {
	// Get parameter
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)

	// Format error
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	// Service error
	err = services.DeleteCategory(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}

// GET /categroies
func GetAllCategories(c *gin.Context) {
	categories, err := services.GetAllCategories()

	// Service error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get categories"})
		return
	}

	c.JSON(http.StatusOK, categories)
}
