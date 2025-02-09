package models

import (
	"time"
)

// Department 部门模型
type Department struct {
	ID          uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Code        string     `json:"code" gorm:"unique;not null"`
	Name        string     `json:"name" gorm:"not null"`
	Description string     `json:"description"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at" gorm:"index"`
}
