package controllers

import (
	"net/http"

	"4-babys/todo-backend/services"

	"github.com/gin-gonic/gin"
)

// CreateUserRequest defines JSON body for user registration
type CreateUserRequest struct {
	Username     string `json:"username" binding:"required"`
	Password     string `json:"password" binding:"required"`
	ProfileImage string `json:"profileImage"`
}

// LoginRequest defines JSON body for user login
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// CreateUser handles POST /users to register a new user
func CreateUser(c *gin.Context) {
	var req CreateUserRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Create user via service layer
	user, err := services.CreateUser(req.Username, req.Password, req.ProfileImage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
		return
	}

	// Clear password before sending response
	user.Password = ""

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
		"user":    user,
	})
}

// Login handles POST /users/login to authenticate a user and return JWT token
func Login(c *gin.Context) {
	var req LoginRequest

	// Bind and validate JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Authenticate user and get token
	token, user, err := services.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}
