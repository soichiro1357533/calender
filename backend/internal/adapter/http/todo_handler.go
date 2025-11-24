package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"todo-backend/internal/usecase"

	"github.com/go-chi/chi/v5"
)

// TodoHandler は Todo の HTTP エンドポイントをまとめたハンドラ
type TodoHandler struct {
	usecase usecase.TodoUsecase
}

// NewTodoHandler はユースケースを受け取りハンドラを生成する
func NewTodoHandler(uc usecase.TodoUsecase) *TodoHandler {
	return &TodoHandler{usecase: uc}
}

// RegisterRoutes でルーティングにハンドラを紐づける
func (h *TodoHandler) RegisterRoutes(router chi.Router) {
	router.Get("/api/todos", h.ListTodos)
	router.Post("/api/todos", h.CreateTodo)
	router.Patch("/api/todos/{id}", h.UpdateTodo)
	router.Delete("/api/todos/{id}", h.DeleteTodo)
}

func (h *TodoHandler) respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(response)
}

func (h *TodoHandler) respondError(w http.ResponseWriter, code int, message string) {
	h.respondJSON(w, code, map[string]string{"error": message})
}

// CreateTodo は POST /api/todos を処理する
type CreateTodoRequest struct {
	Text      string `json:"text"`
	Date      string `json:"date"`       // YYYY-MM-DD
	ProfileID string `json:"profileId"`
}

func (h *TodoHandler) CreateTodo(w http.ResponseWriter, r *http.Request) {
	var req CreateTodoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.ProfileID == "" {
		h.respondError(w, http.StatusBadRequest, "profileId is required")
		return
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "invalid date format, please use YYYY-MM-DD")
		return
	}

	todo, err := h.usecase.Create(r.Context(), req.Text, date, req.ProfileID)
	if err != nil {
		h.respondError(w, http.StatusInternalServerError, "could not create todo")
		return
	}

	h.respondJSON(w, http.StatusCreated, todo)
}

// ListTodos は GET /api/todos を処理する
func (h *TodoHandler) ListTodos(w http.ResponseWriter, r *http.Request) {
	dateStr := r.URL.Query().Get("date")
	if dateStr == "" {
		dateStr = time.Now().Format("2006-01-02")
	}
	profileID := r.URL.Query().Get("profileId")
	if profileID == "" {
		h.respondError(w, http.StatusBadRequest, "profileId query parameter is required")
		return
	}

	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		h.respondError(w, http.StatusBadRequest, "invalid date format in query parameter, please use YYYY-MM-DD")
		return
	}

	todos, err := h.usecase.ListByDate(r.Context(), date, profileID)
	if err != nil {
		h.respondError(w, http.StatusInternalServerError, "could not retrieve todos")
		return
	}

	h.respondJSON(w, http.StatusOK, todos)
}

// UpdateTodo は PATCH /api/todos/{id} を処理する
func (h *TodoHandler) UpdateTodo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var input usecase.UpdateTodoInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		h.respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	todo, err := h.usecase.Update(r.Context(), id, input)
	if err != nil {
		if err == usecase.ErrTodoNotFound {
			h.respondError(w, http.StatusNotFound, "todo not found")
			return
		}
		h.respondError(w, http.StatusInternalServerError, "could not update todo")
		return
	}

	h.respondJSON(w, http.StatusOK, todo)
}

// DeleteTodo は DELETE /api/todos/{id} を処理する
func (h *TodoHandler) DeleteTodo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.usecase.Delete(r.Context(), id); err != nil {
		h.respondError(w, http.StatusInternalServerError, "could not delete todo")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
