CREATE TABLE todos (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_todos_created_at ON todos (created_at);
