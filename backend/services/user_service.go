package services

import (
	"errors"
	"time"

	"4-babys/todo-backend/config"
	"4-babys/todo-backend/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(username, password, profileImage string) error {
	// Hash the password
	hashedPass, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := models.User{
		Username:     username,
		Password:     string(hashedPass),
		ProfileImage: profileImage,
	}

	// Save to DB
	result := config.DB.Create(&user)
	return result.Error
}

func Login(username, password string) (string, error) {
	var user models.User

	// Find user by username
	if err := config.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return "", errors.New("invalid username or password")
	}

	// Check password
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return "", errors.New("invalid username or password")
	}

	// Create JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	// Sign token using secret key from config
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
