package controllers

import (
	"net/http"

	"4-babys/todo-backend/services"

	"github.com/gin-gonic/gin"
)

// Request body for creating a user
type CreateUserRequest struct {
	Username     string `json:"username" binding:"required"`
	Password     string `json:"password" binding:"required"`
	ProfileImage string `json:"profileImage"`
}

// Request body for login
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// POST /users
func CreateUser(c *gin.Context) {
	var req CreateUserRequest

	// Format error
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Service error
	if err := services.CreateUser(req.Username, req.Password, req.ProfileImage); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

// POST /users/login
func Login(c *gin.Context) {
	var req LoginRequest

	// Format error
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	token, err := services.Login(req.Username, req.Password)
	// Service error
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
