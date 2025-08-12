package routes

import (
	"4-babys/todo-backend/controllers"
	"4-babys/todo-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// User routes (public)
	r.POST("/users", controllers.CreateUser)
	r.POST("/users/login", controllers.Login)

	// Routes protectec (JWT)
	protected := r.Group("/", middlewares.JWTAuthMiddleware())

	protected.POST("/categories", controllers.CreateCategory)
	protected.DELETE("/categories/:id", controllers.DeleteCategory)
	protected.GET("/categories", controllers.GetAllCategories)

	return r
}
