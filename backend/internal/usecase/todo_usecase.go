package usecase

import (
	"context"
	"errors"
	"time"

	"todo-backend/internal/domain"
)

// ErrTodoNotFound は該当するTodoが見つからない場合に返る
var ErrTodoNotFound = errors.New("todo not found")

// TodoRepository はTodo永続化のためのインターフェース
type TodoRepository interface {
	Store(ctx context.Context, todo *domain.Todo) error
	FindByDate(ctx context.Context, date time.Time, profileID string) ([]*domain.Todo, error)
	FindByID(ctx context.Context, id string) (*domain.Todo, error)
	Update(ctx context.Context, todo *domain.Todo) error
	Delete(ctx context.Context, id string) error
}

// UpdateTodoInput は更新可能な項目をまとめた構造体
type UpdateTodoInput struct {
	Text      *string `json:"text"`
	Completed *bool   `json:"completed"`
}

// TodoUsecase はTodoに関するユースケース
type TodoUsecase interface {
	Create(ctx context.Context, text string, date time.Time, profileID string) (*domain.Todo, error)
	ListByDate(ctx context.Context, date time.Time, profileID string) ([]*domain.Todo, error)
	Update(ctx context.Context, id string, input UpdateTodoInput) (*domain.Todo, error)
	Delete(ctx context.Context, id string) error
}
