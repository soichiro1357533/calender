package repository

import (
	"context"
	"database/sql"
	"time"

	"github.com/google/uuid"

	"todo-backend/internal/domain"
	"todo-backend/internal/usecase"
)

// SQLiteTodoRepository は SQLite にTodoを永続化する
type SQLiteTodoRepository struct {
	db *sql.DB
}

// NewSQLiteTodoRepository はリポジトリを生成する
func NewSQLiteTodoRepository(db *sql.DB) *SQLiteTodoRepository {
	return &SQLiteTodoRepository{db: db}
}

// InitDB は必要なテーブルを作成する
func (r *SQLiteTodoRepository) InitDB(ctx context.Context) error {
	const query = `
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            completed BOOLEAN NOT NULL,
            date TEXT NOT NULL,
            profile_id TEXT NOT NULL
        );`
	_, err := r.db.ExecContext(ctx, query)
	return err
}

// Store は新規Todoを保存する
func (r *SQLiteTodoRepository) Store(ctx context.Context, todo *domain.Todo) error {
	if todo.ID == "" {
		todo.ID = uuid.NewString()
	}

	_, err := r.db.ExecContext(ctx,
		"INSERT INTO todos (id, text, completed, date, profile_id) VALUES (?, ?, ?, ?, ?)",
		todo.ID, todo.Text, todo.Completed, todo.Date.Format("2006-01-02"), todo.ProfileID,
	)
	return err
}

// FindByDate は日付とプロフィールIDで絞って取得する
func (r *SQLiteTodoRepository) FindByDate(ctx context.Context, date time.Time, profileID string) ([]*domain.Todo, error) {
	rows, err := r.db.QueryContext(ctx,
		"SELECT id, text, completed, date, profile_id FROM todos WHERE date = ? AND profile_id = ?",
		date.Format("2006-01-02"), profileID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var todos []*domain.Todo
	for rows.Next() {
		var todo domain.Todo
		var dateStr string
		if err := rows.Scan(&todo.ID, &todo.Text, &todo.Completed, &dateStr, &todo.ProfileID); err != nil {
			return nil, err
		}
		todo.Date, err = time.Parse("2006-01-02", dateStr)
		if err != nil {
			return nil, err
		}
		todos = append(todos, &todo)
	}
	return todos, rows.Err()
}

// FindByID はIDをキーに1件取得する
func (r *SQLiteTodoRepository) FindByID(ctx context.Context, id string) (*domain.Todo, error) {
	row := r.db.QueryRowContext(ctx,
		"SELECT id, text, completed, date, profile_id FROM todos WHERE id = ?",
		id,
	)

	var todo domain.Todo
	var dateStr string
	if err := row.Scan(&todo.ID, &todo.Text, &todo.Completed, &dateStr, &todo.ProfileID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		return nil, err
	}
	todo.Date = date
	return &todo, nil
}

// Update は既存Todoを更新する（プロフィールIDは変更しない想定）
func (r *SQLiteTodoRepository) Update(ctx context.Context, todo *domain.Todo) error {
	_, err := r.db.ExecContext(ctx,
		"UPDATE todos SET text = ?, completed = ? WHERE id = ?",
		todo.Text, todo.Completed, todo.ID,
	)
	return err
}

// Delete はIDを指定して削除する
func (r *SQLiteTodoRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, "DELETE FROM todos WHERE id = ?", id)
	return err
}

// インターフェース実装のコンパイル時検証
var _ usecase.TodoRepository = (*SQLiteTodoRepository)(nil)
