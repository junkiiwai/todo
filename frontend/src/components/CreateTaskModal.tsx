import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { CreateTaskRequest, User, Task } from '../types';
import { taskAPI, userAPI } from '../utils/api';

interface CreateTaskModalProps {
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    name: '',
    description: '',
    assignee_id: undefined,
    priority: 3,
    estimated_hours: 0,
    deadline: '',
    remaining_days: undefined,
    progress: 0,
    parent_task_id: undefined,
  });

  const [users, setUsers] = useState<User[]>([]);
  const [parentTasks, setParentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUsers();
    loadParentTasks();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await userAPI.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('ユーザー読み込みエラー:', error);
    }
  };

  const loadParentTasks = async () => {
    try {
      const tasks = await taskAPI.getTasks();
      setParentTasks(tasks);
    } catch (error) {
      console.error('親タスク読み込みエラー:', error);
    }
  };

  const handleInputChange = (field: keyof CreateTaskRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'タスク名は必須です';
    }

    if (formData.priority < 1 || formData.priority > 5) {
      newErrors.priority = '優先度は1-5の範囲で入力してください';
    }

    if ((formData.estimated_hours ?? 0) < 0) {
      newErrors.estimated_hours = '所要時間は0以上で入力してください';
    }

    if ((formData.progress ?? 0) < 0 || (formData.progress ?? 0) > 100) {
      newErrors.progress = '進捗度は0-100の範囲で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await taskAPI.createTask(formData);
      onTaskCreated();
    } catch (error) {
      console.error('タスク作成エラー:', error);
      alert('タスクの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>新規タスク作成</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* タスク名 */}
          <div className="form-group">
            <label>タスク名 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={{ borderColor: errors.name ? '#ef4444' : '#d1d5db' }}
            />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.name}</p>}
          </div>

          {/* タスク内容 */}
          <div className="form-group">
            <label>タスク内容</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* 担当者 */}
          <div className="form-group">
            <label>担当者</label>
            <select
              value={formData.assignee_id || ''}
              onChange={(e) => handleInputChange('assignee_id', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">選択してください</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* 優先度 */}
          <div className="form-group">
            <label>優先度 *</label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
              style={{ borderColor: errors.priority ? '#ef4444' : '#d1d5db' }}
            >
              <option value={1}>1 (最高)</option>
              <option value={2}>2 (高)</option>
              <option value={3}>3 (中)</option>
              <option value={4}>4 (低)</option>
              <option value={5}>5 (最低)</option>
            </select>
            {errors.priority && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.priority}</p>}
          </div>

          {/* 所要時間 */}
          <div className="form-group">
            <label>所要時間（時間）</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.estimated_hours}
              onChange={(e) => handleInputChange('estimated_hours', parseFloat(e.target.value) || 0)}
              style={{ borderColor: errors.estimated_hours ? '#ef4444' : '#d1d5db' }}
            />
            {errors.estimated_hours && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.estimated_hours}</p>}
          </div>

          {/* 期限 */}
          <div className="form-group">
            <label>期限</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          </div>

          {/* 残日数 */}
          <div className="form-group">
            <label>残日数</label>
            <input
              type="number"
              min="0"
              value={formData.remaining_days || ''}
              onChange={(e) => handleInputChange('remaining_days', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          {/* 進捗度 */}
          <div className="form-group">
            <label>進捗度（%）</label>
            <input
              type="number"
              min="0"
              max="100"
              step="10"
              value={formData.progress}
              onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
              style={{ borderColor: errors.progress ? '#ef4444' : '#d1d5db' }}
            />
            {errors.progress && <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>{errors.progress}</p>}
          </div>

          {/* 親タスク */}
          <div className="form-group">
            <label>親タスク</label>
            <select
              value={formData.parent_task_id || ''}
              onChange={(e) => handleInputChange('parent_task_id', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">無し（最上位タスク）</option>
              {parentTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal; 