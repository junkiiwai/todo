import express from 'express';
import { db } from '../models/database';
import { CreateUserRequest } from '../types';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 全ユーザー取得
router.get('/', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM users ORDER BY display_name ASC';

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'ユーザー取得エラー' });
    }
    res.json(rows);
  });
});

// ユーザー作成
router.post('/', authenticateToken, (req, res) => {
  const userData: CreateUserRequest = req.body;

  const query = 'INSERT INTO users (github_username, display_name) VALUES (?, ?)';

  db.run(query, [userData.github_username, userData.display_name], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'このGitHubユーザー名は既に登録されています' });
      }
      return res.status(500).json({ error: 'ユーザー作成エラー' });
    }

    // 作成されたユーザーを取得
    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'ユーザー取得エラー' });
      }
      res.status(201).json(row);
    });
  });
});

// ユーザー更新
router.put('/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const { display_name } = req.body;

  const query = 'UPDATE users SET display_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

  db.run(query, [display_name, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'ユーザー更新エラー' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    // 更新されたユーザーを取得
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'ユーザー取得エラー' });
      }
      res.json(row);
    });
  });
});

// ユーザー削除
router.delete('/:id', authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);

  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'ユーザー削除エラー' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json({ message: 'ユーザーが削除されました' });
  });
});

export default router; 