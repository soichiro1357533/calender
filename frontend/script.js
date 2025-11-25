// script.js

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const todoList = document.getElementById('todo-list');
    const addTodoForm = document.getElementById('add-todo-form');
    const newTodoTitleInput = document.getElementById('new-todo-title');
    const newTodoDueDateInput = document.getElementById('new-todo-due-date');

    const API_URL = 'http://127.0.0.1:5000'; // バックエンドAPIのURL

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [], // ここにタスクをロードします
        locale: 'ja',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }
    });
    calendar.render();

    // バックエンドからタスクを読み込む関数
    async function fetchTodos() {
        try {
            const response = await fetch(`${API_URL}/todos`);
            if (!response.ok) {
                throw new Error('タスクの読み込みに失敗しました。');
            }
            const todos = await response.json();
            renderTodos(todos);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // タスクを画面に描画する関数
    function renderTodos(todos) {
        todoList.innerHTML = '';
        const calendarEvents = [];

        todos.forEach(todo => {
            // 未完了のタスクのみリストに表示
            if (!todo.completed) {
                const li = document.createElement('li');
                li.dataset.id = todo.id;

                // チェックボックス
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                // 未完了タスクなので checked は常に false
                checkbox.checked = todo.completed; 
                checkbox.addEventListener('change', () => toggleComplete(todo.id, !todo.completed));


                // タスク名
                const span = document.createElement('span');
                span.classList.add('todo-title');
                span.textContent = ` ${todo.title} (期限: ${todo.dueDate})`;

                // 編集ボタン
                const editButton = document.createElement('button');
                editButton.textContent = '編集';
                editButton.classList.add('secondary');
                editButton.addEventListener('click', () => toggleEditMode(li, todo));

                // 削除ボタン
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.classList.add('danger');
                deleteButton.addEventListener('click', () => deleteTask(todo.id));

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(editButton);
                li.appendChild(deleteButton);

                
                todoList.appendChild(li);
            

            }
            // カレンダー用のイベントデータを作成
            calendarEvents.push({
                id: todo.id,
                title: todo.title,
                start: todo.dueDate,
                allDay: true,
                backgroundColor: todo.completed ? 'gray' : '#007bff',
                borderColor: todo.completed ? 'gray' : '#007bff'
            });
        });

        calendar.removeAllEvents();
        calendar.addEventSource(calendarEvents);
    }

    // 新しいタスクを追加する関数
    async function addTodo(event) {
        event.preventDefault();
        const title = newTodoTitleInput.value;
        const dueDate = newTodoDueDateInput.value;

        if (!title || !dueDate) {
            alert('タスク名と期限を入力してください。');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, dueDate }),
            });

            if (!response.ok) {
                throw new Error('タスクの追加に失敗しました。');
            }
            
            // フォームをリセットしてタスクを再読み込み
            addTodoForm.reset();
            fetchTodos();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // タスクの完了状態を切り替える関数
    async function toggleComplete(id, isCompleted) {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: isCompleted })
            });
            if (!response.ok) {
                throw new Error('タスクの更新に失敗しました。');
            }
            fetchTodos(); // リストとカレンダーを再描画
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // タスクを削除する関数
    async function deleteTask(id) {
        if (!confirm('本当にこのタスクを削除しますか？')) {
            return;
        }
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('タスクの削除に失敗しました。');
            }
            fetchTodos(); // リストとカレンダーを再描画
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // 編集モードに切り替える関数
    function toggleEditMode(li, todo) {
        // 既存のタスク表示をクリア
        const span = li.querySelector('span');
        const editButton = li.querySelector('button'); // 最初のボタンが編集ボタン
        li.innerHTML = ''; // チェックボックスなども含めて一旦クリア

        // 編集用の入力フォームを作成
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.value = todo.title;

        const dueDateInput = document.createElement('input');
        dueDateInput.type = 'date';
        dueDateInput.value = todo.dueDate;

        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.classList.add('primary');

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'キャンセル';
        cancelButton.classList.add('secondary');

        li.appendChild(titleInput);
        li.appendChild(dueDateInput);
        li.appendChild(saveButton);
        li.appendChild(cancelButton);

        // 保存ボタンのクリックイベント
        saveButton.addEventListener('click', async () => {
            const newTitle = titleInput.value;
            const newDueDate = dueDateInput.value;

            if (!newTitle || !newDueDate) {
                alert('タスク名と期限は必須です。');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/todos/${todo.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle, dueDate: newDueDate })
                });
                if (!response.ok) {
                    throw new Error('タスクの更新に失敗しました。');
                }
                fetchTodos(); // 成功したらリストを再描画
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        });

        // キャンセルボタンのクリックイベント
        cancelButton.addEventListener('click', () => {
            fetchTodos(); // リストを再描画して編集をキャンセル
        });
    }

    // イベントリスナーを設定
    addTodoForm.addEventListener('submit', addTodo);

    // 初期表示時にタスクを読み込む
    fetchTodos();
});
