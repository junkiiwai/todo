import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { Task, TaskMemo, CreateMemoRequest } from '../types';
import { taskApi, memoApi } from '../utils/api';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TaskMemoModalProps {
  task: Task;
  onClose: () => void;
  onMemoCreated: () => void;
}

const TaskMemoModal: React.FC<TaskMemoModalProps> = ({ task, onClose, onMemoCreated }) => {
  const [memos, setMemos] = useState<TaskMemo[]>([]);
  const [newMemo, setNewMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [memosLoading, setMemosLoading] = useState(true);

  useEffect(() => {
    loadMemos();
  }, [task.id]);

  const loadMemos = async () => {
    try {
      setMemosLoading(true);
      const response = await memoApi.getMemos(task.id);
      const memosData = response.data;
      setMemos(memosData);
    } catch (error) {
      console.error('メモ読み込みエラー:', error);
    } finally {
      setMemosLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMemo.trim()) {
      return;
    }

    setLoading(true);
    try {
      const memoData: CreateMemoRequest = {
        content: newMemo.trim()
      };
      
      await memoApi.createMemo(task.id, memoData);
      setNewMemo('');
      await loadMemos();
      onMemoCreated();
    } catch (error) {
      console.error('メモ作成エラー:', error);
      alert('メモの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatMemoDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'M/d（E）HH:mm', { locale: ja });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            メモ - {task.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* メモ一覧 */}
          <div className="max-h-96 overflow-y-auto">
            {memosLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
            ) : memos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>メモはまだありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {memos.map((memo) => (
                  <div key={memo.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {memo.user_name || '不明'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatMemoDate(memo.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 新規メモ作成 */}
          <div className="border-t pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  新しいメモ
                </label>
                <textarea
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  rows={3}
                  placeholder="現状・課題を記載してください..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !newMemo.trim()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Send size={16} className="mr-2" />
                  {loading ? '送信中...' : '更新'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskMemoModal; 