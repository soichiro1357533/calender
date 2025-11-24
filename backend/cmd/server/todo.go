package main

import "time"

// Todo は単一のTODOアイテムを表すドメインエンティティです。
type Todo struct {
	ID        string    `json:"id"`
	Text      string    `json:"text"`
	Completed bool      `json:"completed"`
	Date      time.Time `json:"date"`
}

// NewTodo は新しいTodoエンティティを作成するためのファクトリ関数です。
// IDの生成などはリポジトリ層やユースケース層で行うため、ここでは基本的な値のみ設定します。
func NewTodo(text string, date time.Time) *Todo {
	return &Todo{
		Text:      text,
		Completed: false, // 新しいTodoは常に未完了
		Date:      date,
	}
}
