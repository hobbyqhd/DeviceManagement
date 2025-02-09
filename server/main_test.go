package main

import (
	"bytes"
	"device-management/database"
	"encoding/json"
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
	assert.NotEmpty(t, response)
}

// TestCreateAndDeleteDevice 测试创建和删除设备的完整流程
func TestCreateAndDeleteDevice(t *testing.T) {
	// 先创建测试部门
	departmentData := map[string]interface{}{
		"code": "TEST_DEPT",
		"name": "测试部门",
	}

	jsonDeptData, _ := json.Marshal(departmentData)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/departments", bytes.NewBuffer(jsonDeptData))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// 创建设备
	deviceData := map[string]interface{}{
		"code":            "TEST001",
		"name":            "测试设备",
		"type":            "测试类型",
		"status":          "正常",
		"department_code": "TEST_DEPT",
		"location":        "测试位置",
		"owner":           "测试负责人",
	}

	jsonData, _ := json.Marshal(deviceData)
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/api/devices", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	// 删除设备
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("DELETE", "/api/devices/TEST001", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	// 清理测试部门
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("DELETE", "/api/departments/TEST_DEPT", nil)
	router.ServeHTTP(w, req)
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
	assert.Contains(t, response, "total_devices")
}
