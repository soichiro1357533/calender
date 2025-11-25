-- schema.sql
DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  dueDate TEXT NOT NULL,
  completed INTEGER NOT NULL CHECK(completed IN (0, 1))
);