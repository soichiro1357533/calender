package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	_ "github.com/mattn/go-sqlite3"
	handler "todo-backend/internal/adapter/http"
	"todo-backend/internal/adapter/repository"
	"todo-backend/internal/usecase"
)

func main() {
	// 1. データベースへ接続する
	db, err := sql.Open("sqlite3", "./todo.db")
	if err != nil {
		log.Fatalf("could not connect to database: %v", err)
	}
	defer db.Close()

	// 2. リポジトリを用意し、テーブルを初期化する
	todoRepo := repository.NewSQLiteTodoRepository(db)
	if err := todoRepo.InitDB(context.Background()); err != nil {
		log.Fatalf("could not initialize database: %v", err)
	}

	// 3. リポジトリを渡してユースケースを生成する
	todoUsecase := usecase.NewTodoInteractor(todoRepo)

	// 4. ユースケースを注入した HTTP ハンドラを生成する
	todoHandler := handler.NewTodoHandler(todoUsecase)

	// ルーターを初期化
	r := chi.NewRouter()

	// ロギングミドルウェア
	r.Use(middleware.Logger)

	// CORS ミドルウェア
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	// ヘルスチェック用エンドポイント
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// 5. ハンドラのルーティングを登録
	todoHandler.RegisterRoutes(r)

	log.Println("Starting server on :8081")
	if err := http.ListenAndServe(":8081", r); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}
