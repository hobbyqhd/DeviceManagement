package main

import (
	"bytes"
	"device-management/database"
	"device-management/models"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/stretchr/testify/assert"
)

var router *gin.Engine

func init() {
	// 设置测试环境
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("config")
	viper.ReadInConfig()

	// 初始化数据库连接
	database.InitDB()

	// 设置gin为测试模式
	gin.SetMode(gin.TestMode)

	// 初始化路由
	router = setupRouter()

	// 初始化测试数据
	initTestData()
}

// 初始化测试数据
func initTestData() {
	// 清理可能存在的旧数据
	if err := database.DB.Exec("DELETE FROM devices").Error; err != nil {
		log.Printf("Error cleaning devices table: %v", err)
	}
	if err := database.DB.Exec("DELETE FROM departments").Error; err != nil {
		log.Printf("Error cleaning departments table: %v", err)
	}

	// 插入测试部门数据
	department := models.Department{
		Code:        "TEST_DEPT",
		Name:        "测试部门",
		Description: "用于测试的部门",
	}
	if err := database.DB.Create(&department).Error; err != nil {
		log.Printf("Error creating test department: %v", err)
	}

	// 插入测试设备数据
	device := models.Device{
		Code:           "TEST001",
		Name:           "测试设备",
		Type:           "测试类型",
		Status:         "正常",
		DepartmentCode: "TEST_DEPT",
		Location:       "测试位置",
		Owner:          "测试负责人",
	}
	if err := database.DB.Create(&device).Error; err != nil {
		log.Printf("Error creating test device: %v", err)
	}
}

// TestGetDevices 测试获取设备列表接口
func TestGetDevices(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/devices", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response []map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
}

// TestCreateAndDeleteDevice 测试创建和删除设备的完整流程
func TestCreateAndDeleteDevice(t *testing.T) {
	// 创建新的测试部门
	departmentData := map[string]interface{}{
		"code":        "NEW_TEST_DEPT",
		"name":        "Test Department",
		"description": "Test Department Description",
	}

	jsonDeptData, _ := json.Marshal(departmentData)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/departments", bytes.NewBuffer(jsonDeptData))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// 创建新的测试设备
	deviceData := map[string]interface{}{
		"code":            "NEW_TEST001",
		"name":            "Test Device",
		"type":            "Test Type",
		"status":          "Normal",
		"department_code": "NEW_TEST_DEPT",
		"location":        "Test Location",
		"owner":           "Test Owner",
	}

	jsonData, _ := json.Marshal(deviceData)
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/api/devices", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// 删除测试设备
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("DELETE", "/api/devices/NEW_TEST001", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

// TestGetDeviceStats 测试获取设备统计信息
func TestGetDeviceStats(t *testing.T) {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/stats", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.NotNil(t, response["total"])
	assert.NotNil(t, response["by_type"])
	assert.NotNil(t, response["by_status"])
	assert.NotNil(t, response["by_department"])
}
