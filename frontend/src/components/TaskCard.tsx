import React, { useState } from 'react';
import { Task } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronDown, ChevronRight, MessageSquare, Edit, Trash2 } from 'lucide-react';
import TaskMemoModal from './TaskMemoModal';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
  onTaskUpdated: () => void;
  readonly?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskUpdated, readonly = false }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline);
      return format(date, 'M月d日（E）HH:mm', { locale: ja });
    } catch {
      return deadline;
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800';
      case 2: return 'bg-orange-100 text-orange-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-blue-100 text-blue-800';
      case 5: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const hasChildTasks = task.child_tasks && task.child_tasks.length > 0;

  return (
    <>
      <div className={`bg-white shadow rounded-lg border ${task.progress === 100 ? 'opacity-75' : ''}`}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                {hasChildTasks && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                )}
                
                <h3 className={`text-lg font-medium ${task.progress === 100 ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {task.name}
                </h3>
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  優先度{task.priority}
                </span>
              </div>

              {task.description && (
                <p className="mt-2 text-sm text-gray-600">{task.description}</p>
              )}

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">担当者:</span>
                  <span className="ml-1 font-medium">{task.assignee_name || '未設定'}</span>
                </div>
                
                <div>
                  <span className="text-gray-500">所要時間:</span>
                  <span className="ml-1 font-medium">{task.estimated_hours}時間</span>
                </div>
                
                {task.deadline && (
                  <div>
                    <span className="text-gray-500">期限:</span>
                    <span className="ml-1 font-medium">{formatDeadline(task.deadline)}</span>
                  </div>
                )}
                
                {task.remaining_days !== undefined && (
                  <div>
                    <span className="text-gray-500">残日数:</span>
                    <span className="ml-1 font-medium">{task.remaining_days}日</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">進捗度</span>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(task.progress)}`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {!readonly && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => setShowMemoModal(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  title="メモ"
                >
                  <MessageSquare size={16} />
                </button>
                
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  title="編集"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 子タスク */}
        {expanded && hasChildTasks && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">子タスク</h4>
              <div className="space-y-3">
                {task.child_tasks!.map((childTask) => (
                  <TaskCard
                    key={childTask.id}
                    task={childTask}
                    onTaskUpdated={onTaskUpdated}
                    readonly={readonly}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* メモモーダル */}
      {showMemoModal && (
        <TaskMemoModal
          task={task}
          onClose={() => setShowMemoModal(false)}
          onMemoCreated={onTaskUpdated}
        />
      )}

      {/* 編集モーダル */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          onClose={() => setShowEditModal(false)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
};

export default TaskCard; 