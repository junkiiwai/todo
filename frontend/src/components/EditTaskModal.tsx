import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { UpdateTaskRequest, User, Task } from '../types';
import { taskAPI, userAPI } from '../utils/api';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onTaskUpdated }) => {
  const [formData, setFormData] = useState<UpdateTaskRequest>({
    name: task.name,
    description: task.description,
    assignee_id: task.assignee_id,
    priority: task.priority,
    estimated_hours: task.estimated_hours,
    deadline: task.deadline,
    remaining_days: task.remaining_days,
    progress: task.progress,
    parent_task_id: task.parent_task_id,
    status: task.status,
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
      // 自分自身を除外
      const filteredTasks = tasks.filter(t => t.id !== task.id);
      setParentTasks(filteredTasks);
    } catch (error) {
      console.error('親タスク読み込みエラー:', error);
    }
  };

  const handleInputChange = (field: keyof UpdateTaskRequest, value: any) => {
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

    if (!formData.name?.trim()) {
      newErrors.name = 'タスク名は必須です';
    }

    if (formData.priority && (formData.priority < 1 || formData.priority > 5)) {
      newErrors.priority = '優先度は1-5の範囲で入力してください';
    }

    if (formData.estimated_hours && formData.estimated_hours < 0) {
      newErrors.estimated_hours = '所要時間は0以上で入力してください';
    }

    if (formData.progress && (formData.progress < 0 || formData.progress > 100)) {
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
      await taskAPI.updateTask(task.id, formData);
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('タスク更新エラー:', error);
      alert('タスクの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('このタスクを削除しますか？')) {
      return;
    }

    setLoading(true);
    try {
      await taskAPI.deleteTask(task.id);
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('タスク削除エラー:', error);
      alert('タスクの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">タスク編集</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* タスク名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タスク名 *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* タスク内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タスク内容
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 担当者 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              担当者
            </label>
            <select
              value={formData.assignee_id || ''}
              onChange={(e) => handleInputChange('assignee_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              優先度 *
            </label>
            <select
              value={formData.priority || 3}
              onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.priority ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={1}>1 (最高)</option>
              <option value={2}>2 (高)</option>
              <option value={3}>3 (中)</option>
              <option value={4}>4 (低)</option>
              <option value={5}>5 (最低)</option>
            </select>
            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
          </div>

          {/* 所要時間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所要時間（時間）
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.estimated_hours || 0}
              onChange={(e) => handleInputChange('estimated_hours', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.estimated_hours ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.estimated_hours && <p className="text-red-500 text-sm mt-1">{errors.estimated_hours}</p>}
          </div>

          {/* 期限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              期限
            </label>
            <input
              type="datetime-local"
              value={formData.deadline || ''}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 残日数 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              残日数
            </label>
            <input
              type="number"
              min="0"
              value={formData.remaining_days || ''}
              onChange={(e) => handleInputChange('remaining_days', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 進捗度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              進捗度（%）
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="10"
              value={formData.progress || 0}
              onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.progress ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.progress && <p className="text-red-500 text-sm mt-1">{errors.progress}</p>}
          </div>

          {/* 親タスク */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              親タスク
            </label>
            <select
              value={formData.parent_task_id || ''}
              onChange={(e) => handleInputChange('parent_task_id', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">無し（最上位タスク）</option>
              {parentTasks.map((parentTask) => (
                <option key={parentTask.id} value={parentTask.id}>
                  {parentTask.name}
                </option>
              ))}
            </select>
          </div>

          {/* ステータス */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'completed')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">進行中</option>
              <option value="completed">完了</option>
            </select>
          </div>

          {/* ボタン */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              削除
            </button>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '更新中...' : '更新'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal; 