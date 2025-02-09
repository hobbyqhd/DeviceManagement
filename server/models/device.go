package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Device struct {
	Code           string     `gorm:"primary_key;size:50;not null" json:"code"`
	Name           string     `gorm:"size:100;not null" json:"name"`
	Type           string     `gorm:"size:50;not null" json:"type"`
	Status         string     `gorm:"size:20;not null" json:"status"`
	Location       string     `gorm:"size:100" json:"location"`
	Owner          string     `gorm:"size:50" json:"owner"`
	Department     Department `json:"department" gorm:"foreignKey:DepartmentCode;references:Code"`
	DepartmentCode string     `json:"department_code" gorm:"size:50"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `sql:"index" json:"deleted_at"`
}

func (d *Device) BeforeCreate(scope *gorm.Scope) error {
	scope.SetColumn("CreatedAt", time.Now())
	scope.SetColumn("UpdatedAt", time.Now())
	return nil
}

func (d *Device) BeforeUpdate(scope *gorm.Scope) error {
	scope.SetColumn("UpdatedAt", time.Now())
	return nil
}
