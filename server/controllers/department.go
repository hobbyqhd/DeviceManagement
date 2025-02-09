package controllers

import (
	"device-management/database"
	"device-management/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetDepartments 获取部门列表
func GetDepartments(c *gin.Context) {
	var departments []models.Department
	result := database.DB.Where("deleted_at IS NULL").Find(&departments)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, departments)
}

// CreateDepartment 创建新部门
func CreateDepartment(c *gin.Context) {
	var department models.Department
	if err := c.ShouldBindJSON(&department); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := database.DB.Create(&department)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusCreated, department)
}
