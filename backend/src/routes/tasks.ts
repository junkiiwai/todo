import express from 'express';
import { db } from '../models/database';
import { Task, CreateTaskRequest, UpdateTaskRequest, CreateMemoRequest } from '../types';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 全タスク取得（プロジェクト単位でグループ化）
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      t.*,
      u.display_name as assignee_name,
      p.name as parent_task_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    LEFT JOIN tasks p ON t.parent_task_id = p.id
    WHERE t.status = 'active'
    ORDER BY t.parent_task_id IS NULL DESC, t.created_at ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'データベースエラー' });
    }

    // プロジェクト（最上位タスク）とその子タスクをグループ化
    const projects = rows.filter((row: any) => !row.parent_task_id);
    const childTasks = rows.filter((row: any) => row.parent_task_id);

    const result = projects.map((project: any) => {
      const children = childTasks.filter((child: any) => 
        child.parent_task_id === project.id
      );
      return {
        ...project,
        child_tasks: children
      };
    });

    res.json(result);
  });
});

// 完了済みタスク取得
router.get('/completed', authenticateToken, (req, res) => {
  const query = `
    SELECT 
      t.*,
      u.display_name as assignee_name,
      p.name as parent_task_name
    FROM tasks t
    LEFT JOIN users u ON t.assignee_id = u.id
    LEFT JOIN tasks p ON t.parent_task_id = p.id
    WHERE t.status = 'completed'
    ORDER BY t.updated_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'データベースエラー' });
    }

    // プロジェクト（最上位タスク）とその子タスクをグループ化
    const projects = rows.filter((row: any) => !row.parent_task_id);
    const childTasks = rows.filter((row: any) => row.parent_task_id);

    const result = projects.map((project: any) => {
      const children = childTasks.filter((child: any) => 
        child.parent_task_id === project.id
      );
      return {
        ...project,
        child_tasks: children
      };
    });

    res.json(result);
  });
});

// タスク作成
router.post('/', authenticateToken, (req, res) => {
  const taskData: CreateTaskRequest = req.body;
  
  const query = `
    INSERT INTO tasks (
      name, description, assignee_id, priority, estimated_hours,
      deadline, remaining_days, progress, parent_task_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    taskData.name,
    taskData.description || null,
    taskData.assignee_id || null,
    taskData.priority,
    taskData.estimated_hours || 0,
    taskData.deadline || null,
    taskData.remaining_days || null,
    taskData.progress || 0,
    taskData.parent_task_id || null
  ];

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: 'タスク作成エラー' });
    }

    // 作成されたタスクを取得
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'タスク取得エラー' });
      }
      res.status(201).json(row);
    });
  });
});

// タスク更新
router.put('/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const updateData: UpdateTaskRequest = req.body;

  // 更新フィールドを動的に構築
  const updateFields: string[] = [];
  const values: any[] = [];

  Object.entries(updateData).forEach(([key, value]) => {
    if (value !== undefined) {
      updateFields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({ error: '更新データがありません' });
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(taskId);

  const query = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = ?`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: 'タスク更新エラー' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'タスクが見つかりません' });
    }

    // 更新されたタスクを取得
    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'タスク取得エラー' });
      }
      res.json(row);
    });
  });
});

// タスク削除
router.delete('/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);

  db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'タスク削除エラー' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'タスクが見つかりません' });
    }

    res.json({ message: 'タスクが削除されました' });
  });
});

// タスクのメモ取得
router.get('/:id/memos', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);

  const query = `
    SELECT 
      tm.*,
      u.display_name as user_name
    FROM task_memos tm
    LEFT JOIN users u ON tm.user_id = u.id
    WHERE tm.task_id = ?
    ORDER BY tm.created_at DESC
  `;

  db.all(query, [taskId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'メモ取得エラー' });
    }
    res.json(rows);
  });
});

// タスクにメモ追加
router.post('/:id/memos', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const memoData: CreateMemoRequest = req.body;
  const userId = (req as any).user.id;

  const query = `
    INSERT INTO task_memos (task_id, user_id, content)
    VALUES (?, ?, ?)
  `;

  db.run(query, [taskId, userId, memoData.content], function(err) {
    if (err) {
      return res.status(500).json({ error: 'メモ作成エラー' });
    }

    // 作成されたメモを取得
    db.get(`
      SELECT 
        tm.*,
        u.display_name as user_name
      FROM task_memos tm
      LEFT JOIN users u ON tm.user_id = u.id
      WHERE tm.id = ?
    `, [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'メモ取得エラー' });
      }
      res.status(201).json(row);
    });
  });
});

// 進捗度と所要時間の自動計算
router.get('/:id/calculated-progress', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);

  // 子タスクの進捗度と所要時間を取得
  const query = `
    SELECT 
      estimated_hours,
      progress
    FROM tasks 
    WHERE parent_task_id = ?
  `;

  db.all(query, [taskId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '計算エラー' });
    }

    if (rows.length === 0) {
      return res.json({ estimated_hours: 0, progress: 0 });
    }

    const totalHours = rows.reduce((sum, row) => sum + (row.estimated_hours || 0), 0);
    const weightedProgress = rows.reduce((sum, row) => 
      sum + ((row.estimated_hours || 0) * (row.progress || 0)), 0
    );
    const calculatedProgress = totalHours > 0 ? Math.round(weightedProgress / totalHours) : 0;

    res.json({
      estimated_hours: totalHours,
      progress: calculatedProgress
    });
  });
});

export default router; 