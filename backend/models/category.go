package models

// Category represents a task category in the system
type Category struct {
	ID          uint64 `gorm:"primaryKey;autoIncrement;type:bigint" json:"id"`
	Name        string `gorm:"size:100;not null" json:"name"`
	Description string `gorm:"type:text" json:"description,omitempty"`
}
