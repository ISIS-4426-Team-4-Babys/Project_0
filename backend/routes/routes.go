package routes

import (
	"4-babys/todo-backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// User routes
	r.POST("/users", controllers.CreateUser)
	r.POST("/users/login", controllers.Login)

	return r
}
