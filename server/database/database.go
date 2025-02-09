package database

import (
	"device-management/models"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
)

var DB *gorm.DB

func InitDB() {
	dbConfig := viper.GetStringMapString("database")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=true&loc=%s&collation=utf8mb4_unicode_ci",
		dbConfig["username"],
		dbConfig["password"],
		dbConfig["host"],
		dbConfig["port"],
		dbConfig["dbname"],
		dbConfig["charset"],
		dbConfig["loc"],
	)

	db, err := gorm.Open(dbConfig["driver"], dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB = db

	// 设置连接池参数
	DB.DB().SetMaxIdleConns(10)
	DB.DB().SetMaxOpenConns(100)

	// 自动迁移数据库表结构
	DB.AutoMigrate(&models.Device{}, &models.Department{})

	log.Println("Database connected successfully")
}
