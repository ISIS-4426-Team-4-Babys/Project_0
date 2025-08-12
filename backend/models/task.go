package models

import "time"

// Task scheme
type Task struct {
	ID           uint64     `gorm:"primaryKey;autoIncrement;type:bigint" json:"id"`
	Text         string     `gorm:"type:text;not null" json:"text"`
	CreationDate time.Time  `gorm:"type:date;not null" json:"creation_date"`
	EndDate      *time.Time `gorm:"type:date" json:"end_date,omitempty"`
	Status       string     `gorm:"type:varchar(20);not null;check:status IN ('Sin Empezar','Empezada','Finalizada')" json:"status"`
	IDCategory   uint64     `gorm:"not null" json:"id_category"`
	IDUser       uint64     `gorm:"not null" json:"id_user"`
	Category     Category   `gorm:"foreignKey:IDCategory;references:ID" json:"category,omitempty"`
	User         User       `gorm:"foreignKey:IDUser;references:ID" json:"user,omitempty"`
}
