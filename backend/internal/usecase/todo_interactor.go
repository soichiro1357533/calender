package usecase

import (
	"context"
	"time"

	"todo-backend/internal/domain"
)

type todoInteractor struct {
	repo TodoRepository
}

// NewTodoInteractor はリポジトリを受け取りユースケース実装を返す
func NewTodoInteractor(repo TodoRepository) TodoUsecase {
	return &todoInteractor{repo: repo}
}

func (i *todoInteractor) Create(ctx context.Context, text string, date time.Time, profileID string) (*domain.Todo, error) {
	todo := domain.NewTodo(text, date, profileID)
	if err := i.repo.Store(ctx, todo); err != nil {
		return nil, err
	}
	return todo, nil
}

func (i *todoInteractor) ListByDate(ctx context.Context, date time.Time, profileID string) ([]*domain.Todo, error) {
	return i.repo.FindByDate(ctx, date, profileID)
}

func (i *todoInteractor) Update(ctx context.Context, id string, input UpdateTodoInput) (*domain.Todo, error) {
	todo, err := i.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if todo == nil {
		return nil, ErrTodoNotFound
	}

	if input.Text != nil {
		todo.Text = *input.Text
	}
	if input.Completed != nil {
		todo.Completed = *input.Completed
	}

	if err := i.repo.Update(ctx, todo); err != nil {
		return nil, err
	}
	return todo, nil
}

func (i *todoInteractor) Delete(ctx context.Context, id string) error {
	return i.repo.Delete(ctx, id)
}
