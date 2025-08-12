package models

// User represents an application user with credentials and profile info
type User struct {
	ID           uint64 `gorm:"primaryKey;autoIncrement;type:bigint" json:"id"`
	Username     string `gorm:"size:50;unique;not null" json:"username"`
	Password     string `gorm:"not null" json:"-"`
	ProfileImage string `gorm:"type:text" json:"profile_image,omitempty"`
}
