package services

import (
	"errors"
	"time"

	"4-babys/todo-backend/config"
	"4-babys/todo-backend/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// CreateUser hashes the password and creates a new user
func CreateUser(username, password, profileImage string) (models.User, error) {
	hashedPass, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := models.User{
		Username:     username,
		Password:     string(hashedPass),
		ProfileImage: profileImage,
	}

	// Insert user into DB
	result := config.DB.Create(&user)
	return user, result.Error
}

// Login authenticates user and returns a JWT token if successful
func Login(username, password string) (string, models.User, error) {
	var user models.User

	// Find user by username
	if err := config.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return "", models.User{}, errors.New("invalid username or password")
	}

	// Verify password
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return "", models.User{}, errors.New("invalid username or password")
	}

	// Generate JWT token with 24h expiry
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	})

	// Sign token with secret
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return "", models.User{}, err
	}

	user.Password = ""

	return tokenString, user, nil
}
