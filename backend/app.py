# app.py
import sqlite3
import click
from flask import Flask, request, jsonify, g, current_app
from flask_cors import CORS

DATABASE = 'todo.db'

app = Flask(__name__)
# フロントエンドからのAPIリクエストを許可するためにCORSを設定します
CORS(app)

def get_db():
    """リクエストごとにデータベース接続を管理する"""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        # クエリ結果を辞書形式で取得できるようにする
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    """リクエスト終了時にデータベース接続を閉じる"""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db_func():
    """データベースを初期化する内部関数"""
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@app.cli.command('init-db')
def init_db_command():
    """既存のデータをクリアし、新しいテーブルを作成します。"""
    init_db_func()
    click.echo('Initialized the database.')


# ToDoリストを取得するAPI
@app.route('/todos', methods=['GET'])
def get_todos():
    db = get_db()
    cur = db.execute('SELECT id, title, dueDate, completed FROM todos ORDER BY id')
    todos = [dict(row) for row in cur.fetchall()]
    # completed は 0 or 1 で保存されているので bool に変換
    for todo in todos:
        todo['completed'] = bool(todo['completed'])
    return jsonify(todos)

# 新しいToDoを追加するAPI
@app.route('/todos', methods=['POST'])
def add_todo():
    if not request.json or not 'title' in request.json or not 'dueDate' in request.json:
        return jsonify({'error': 'Bad Request'}), 400
    
    db = get_db()
    cur = db.execute('INSERT INTO todos (title, dueDate, completed) VALUES (?, ?, ?)',
                 [request.json['title'], request.json['dueDate'], False])
    db.commit()

    new_todo = {
        'id': cur.lastrowid,
        'title': request.json['title'],
        'dueDate': request.json['dueDate'],
        'completed': False
    }
    return jsonify(new_todo), 201

# 特定のToDoを更新するAPI (完了状態の切り替えなど)
@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    if not request.json:
        return jsonify({'error': 'Bad Request'}), 400

    db = get_db()

    # まず現在のタスクを取得
    cur = db.execute('SELECT title, dueDate, completed FROM todos WHERE id = ?', [todo_id])
    current_todo = cur.fetchone()
    if current_todo is None:
        return jsonify({'error': 'Not Found'}), 404

    # リクエストから値を取得。なければ現在の値を維持
    title = request.json.get('title', current_todo['title'])
    due_date = request.json.get('dueDate', current_todo['dueDate'])
    # 'completed' がリクエストに含まれているかチェック
    if 'completed' in request.json:
        completed = bool(request.json.get('completed'))
    else:
        completed = bool(current_todo['completed'])

    # データベースを更新
    db.execute(
        'UPDATE todos SET title = ?, dueDate = ?, completed = ? WHERE id = ?',
        [title, due_date, completed, todo_id]
    )
    db.commit()

    todo = { 'id': todo_id, 'title': title, 'dueDate': due_date, 'completed': completed }
    return jsonify(todo)

# 特定のToDoを削除するAPI
@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    db = get_db()
    cur = db.execute('DELETE FROM todos WHERE id = ?', [todo_id])
    db.commit()

    if cur.rowcount == 0:
        return jsonify({'error': 'Not Found'}), 404

    return '', 204 # 成功したが返すコンテンツがないことを示す

if __name__ == '__main__':
    # デバッグモードでアプリケーションを起動します
    # ポート番号はフロントエンドと競合しないように5000番に設定します
    app.run(debug=True, port=5000)
