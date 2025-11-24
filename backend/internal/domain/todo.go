package domain

import "time"

// Todo はタスクのドメインモデル
type Todo struct {
	ID        string    `json:"id"`
	Text      string    `json:"text"`
	Completed bool      `json:"completed"`
	Date      time.Time `json:"date"`
	ProfileID string    `json:"profileId"`
}

// NewTodo はテキスト・日付・プロフィールIDからTodoを生成する
func NewTodo(text string, date time.Time, profileID string) *Todo {
	return &Todo{
		Text:      text,
		Completed: false,
		Date:      date,
		ProfileID: profileID,
	}
}
