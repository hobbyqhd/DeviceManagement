package controllers

import (
	"device-management/database"
	"device-management/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetDevices 获取设备列表
func GetDevices(c *gin.Context) {
	var devices []models.Device
	result := database.DB.Preload("Department").Where("deleted_at IS NULL").Order("created_at asc").Find(&devices)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, devices)
}

// GetDevice 获取单个设备信息
func GetDevice(c *gin.Context) {
	code := c.Param("code")
	var device models.Device
	result := database.DB.Preload("Department").Where("code = ?", code).First(&device)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	c.JSON(http.StatusOK, device)
}

// CreateDevice 创建新设备
func CreateDevice(c *gin.Context) {
	var device models.Device
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	result := database.DB.Create(&device)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// 重新加载设备信息，包括部门信息
	database.DB.Preload("Department").First(&device, "code = ?", device.Code)
	c.JSON(http.StatusCreated, device)
}

// UpdateDevice 更新设备信息
func UpdateDevice(c *gin.Context) {
	code := c.Param("code")
	var device models.Device
	if err := database.DB.Where("code = ?", code).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Save(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 重新加载设备信息，包括部门信息
	database.DB.Preload("Department").First(&device, "code = ?", device.Code)
	c.JSON(http.StatusOK, device)
}

// DeleteDevice 删除设备
func DeleteDevice(c *gin.Context) {
	code := c.Param("code")
	var device models.Device
	if err := database.DB.Where("code = ?", code).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	result := database.DB.Delete(&device)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Device deleted successfully"})
}

// GetDeviceTypes 获取所有设备类型
func GetDeviceTypes(c *gin.Context) {
	var types []string
	result := database.DB.Raw("SELECT DISTINCT type FROM devices WHERE type IS NOT NULL AND type != '' ORDER BY type").Pluck("type", &types)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, types)
}

// GetDeviceStats 获取设备统计信息
func GetDeviceStats(c *gin.Context) {
	// 从数据库获取各类设备统计数据
	var stats struct {
		Total       int64 `json:"total"`
		Online      int64 `json:"online"`
		Maintenance int64 `json:"maintenance"`
		Purchasing  int64 `json:"purchasing"`
	}

	// 获取设备总数
	database.DB.Model(&models.Device{}).Count(&stats.Total)

	// 获取在线设备数（使用中和闲置状态）
	database.DB.Model(&models.Device{}).Where("status IN (?)", []string{"使用中", "闲置"}).Count(&stats.Online)

	// 获取维修中设备数
	database.DB.Model(&models.Device{}).Where("status = ?", "维修中").Count(&stats.Maintenance)

	// 获取待采购设备数
	database.DB.Model(&models.Device{}).Where("status = ?", "待采购").Count(&stats.Purchasing)

	// 获取设备状态分布
	var statusStats []struct {
		Status string `json:"status"`
		Count  int    `json:"count"`
	}
	database.DB.Model(&models.Device{}).Select("status, count(*) as count").Group("status").Scan(&statusStats)

	// 获取设备类型分布
	var typeStats []struct {
		Type  string `json:"type"`
		Count int    `json:"count"`
	}
	database.DB.Model(&models.Device{}).Select("type, count(*) as count").Group("type").Scan(&typeStats)

	c.JSON(http.StatusOK, gin.H{
		"total_devices":       stats.Total,
		"online_devices":      stats.Online,
		"maintenance_devices": stats.Maintenance,
		"purchasing_devices":  stats.Purchasing,
		"status_stats":        statusStats,
		"type_stats":          typeStats,
	})
}
