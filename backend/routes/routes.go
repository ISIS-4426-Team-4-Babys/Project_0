package routes

import (
	"4-babys/todo-backend/controllers"
	"4-babys/todo-backend/middlewares"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures all application routes and middleware
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Public user routes
	r.POST("/users", controllers.CreateUser)
	r.POST("/users/login", controllers.Login)

	// Protected routes with JWT authentication
	protected := r.Group("/", middlewares.JWTAuthMiddleware())

	// Category routes
	protected.POST("/categories", controllers.CreateCategory)
	protected.DELETE("/categories/:id", controllers.DeleteCategory)
	protected.GET("/categories", controllers.GetAllCategories)

	// Task routes
	protected.POST("/tasks", controllers.CreateTask)
	protected.PUT("/tasks/:id", controllers.UpdateTask)
	protected.DELETE("/tasks/:id", controllers.DeleteTask)
	protected.GET("/tasks/user", controllers.GetTasksByUser)
	protected.GET("/tasks/:id", controllers.GetTaskByID)

	return r
}
