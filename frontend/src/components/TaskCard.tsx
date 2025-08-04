import React, { useState } from 'react';
import type { Task } from '../types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronDown, ChevronRight, MessageSquare, Edit } from 'lucide-react';
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
      case 1: return 'priority-1';
      case 2: return 'priority-2';
      case 3: return 'priority-3';
      case 4: return 'priority-4';
      case 5: return 'priority-5';
      default: return 'priority-3';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return '#10b981';
    if (progress >= 80) return '#3b82f6';
    if (progress >= 60) return '#f59e0b';
    if (progress >= 40) return '#f97316';
    return '#ef4444';
  };

  const hasChildTasks = task.child_tasks && task.child_tasks.length > 0;

  return (
    <>
      <div className="task-card" style={{ opacity: task.progress === 100 ? 0.75 : 1 }}>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {hasChildTasks && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                  >
                    {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                )}
                
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 500, 
                  margin: 0,
                  textDecoration: task.progress === 100 ? 'line-through' : 'none',
                  color: task.progress === 100 ? '#6b7280' : '#111827'
                }}>
                  {task.name}
                </h3>
                
                <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                  優先度{task.priority}
                </span>
              </div>

              {task.description && (
                <p style={{ margin: '8px 0', color: '#6b7280' }}>{task.description}</p>
              )}

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px', 
                marginTop: '16px',
                fontSize: '14px'
              }}>
                <div>
                  <span style={{ color: '#6b7280' }}>担当者:</span>
                  <span style={{ marginLeft: '4px', fontWeight: 500 }}>{task.assignee_name || '未設定'}</span>
                </div>
                
                <div>
                  <span style={{ color: '#6b7280' }}>所要時間:</span>
                  <span style={{ marginLeft: '4px', fontWeight: 500 }}>{task.estimated_hours}時間</span>
                </div>
                
                {task.deadline && (
                  <div>
                    <span style={{ color: '#6b7280' }}>期限:</span>
                    <span style={{ marginLeft: '4px', fontWeight: 500 }}>{formatDeadline(task.deadline)}</span>
                  </div>
                )}
                
                {task.remaining_days !== undefined && (
                  <div>
                    <span style={{ color: '#6b7280' }}>残日数:</span>
                    <span style={{ marginLeft: '4px', fontWeight: 500 }}>{task.remaining_days}日</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>進捗度</span>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{task.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ 
                      width: `${task.progress}%`,
                      backgroundColor: getProgressColor(task.progress)
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {!readonly && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                <button
                  onClick={() => setShowMemoModal(true)}
                  style={{ 
                    padding: '8px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#9ca3af',
                    borderRadius: '50%'
                  }}
                  title="メモ"
                >
                  <MessageSquare size={16} />
                </button>
                
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{ 
                    padding: '8px', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#9ca3af',
                    borderRadius: '50%'
                  }}
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
          <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <div style={{ padding: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>子タスク</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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