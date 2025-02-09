package main

import (
	"device-management/controllers"
	"device-management/database"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func init() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("config")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}
}

func main() {
	// 初始化数据库连接
	database.InitDB()

	// 设置gin模式
	gin.SetMode(viper.GetString("server.mode"))

	// 创建路由
	r := gin.Default()

	// 设置CORS中间件
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API路由
	api := r.Group("/api")
	{
		// 设备相关路由
		api.GET("/devices", controllers.GetDevices)
		api.GET("/devices/:code", controllers.GetDevice)
		api.POST("/devices", controllers.CreateDevice)
		api.PUT("/devices/:code", controllers.UpdateDevice)
		api.DELETE("/devices/:code", controllers.DeleteDevice)

		// 部门相关路由
		api.GET("/departments", controllers.GetDepartments)
		api.POST("/departments", controllers.CreateDepartment)

		// 其他路由
		api.GET("/stats", controllers.GetDeviceStats)
		api.GET("/device-types", controllers.GetDeviceTypes)
	}

	// 启动服务器
	port := viper.GetString("server.port")
	if err := r.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
