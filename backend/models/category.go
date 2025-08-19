package models

// Category represents a task category in the system
type Category struct {
	ID          uint64 `gorm:"primaryKey;autoIncrement;type:bigint" json:"id"`
	Name        string `gorm:"size:100;not null" json:"name"`
	Description string `gorm:"type:text" json:"description,omitempty"`
	IDUser      uint64 `gorm:"not null" json:"id_user"`
	User        User   `gorm:"foreignKey:IDUser;references:ID" json:"user,omitempty"`
}
