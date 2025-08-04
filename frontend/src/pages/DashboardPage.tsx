import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types';
import { taskAPI } from '../utils/api';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import { Plus } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'completed'>('projects');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const [active, completed] = await Promise.all([
        taskAPI.getTasks(),
        taskAPI.getCompletedTasks()
      ]);
      setActiveTasks(active);
      setCompletedTasks(completed);
    } catch (error) {
      console.error('タスク読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = async () => {
    await loadTasks();
    setShowCreateModal(false);
  };

  const handleTaskUpdated = async () => {
    await loadTasks();
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">タスク管理ツール</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                ようこそ、{user?.display_name}さん
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* タブ */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              プロジェクト
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              完了
            </button>
          </nav>
        </div>

        {/* 新規作成ボタン */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            新規作成
          </button>
        </div>

        {/* タスクリスト */}
        {activeTab === 'projects' ? (
          <TaskList
            tasks={activeTasks}
            onTaskUpdated={handleTaskUpdated}
            title="プロジェクト"
          />
        ) : (
          <TaskList
            tasks={completedTasks}
            onTaskUpdated={handleTaskUpdated}
            title="完了済みタスク"
            readonly
          />
        )}
      </main>

      {/* 新規作成モーダル */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default DashboardPage; 