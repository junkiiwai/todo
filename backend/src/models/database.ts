import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../data/tasks.db');

// データベース接続
export const db = new sqlite3.Database(dbPath);

// データベース初期化
export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    // データディレクトリを作成
    const fs = require('fs');
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db.serialize(() => {
      // ユーザーテーブル
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          github_username TEXT UNIQUE NOT NULL,
          display_name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // タスクテーブル
      db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          assignee_id INTEGER,
          priority INTEGER DEFAULT 3,
          estimated_hours REAL DEFAULT 0,
          deadline DATETIME,
          remaining_days INTEGER,
          progress INTEGER DEFAULT 0,
          parent_task_id INTEGER,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (assignee_id) REFERENCES users (id),
          FOREIGN KEY (parent_task_id) REFERENCES tasks (id)
        )
      `);

      // メモテーブル
      db.run(`
        CREATE TABLE IF NOT EXISTS task_memos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (task_id) REFERENCES tasks (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // インデックス作成
      db.run('CREATE INDEX IF NOT EXISTS idx_tasks_parent_id ON tasks(parent_task_id)');
      db.run('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)');
      db.run('CREATE INDEX IF NOT EXISTS idx_task_memos_task_id ON task_memos(task_id)');

      resolve();
    });
  });
}

// データベース接続を閉じる
export function closeDatabase(): void {
  db.close();
} 