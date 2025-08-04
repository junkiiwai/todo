import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  title: string;
  readonly?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskUpdated, title, readonly = false }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">{title}がありません</h3>
          <p className="mt-1 text-sm text-gray-500">
            {readonly ? '完了済みのタスクはありません' : '新しいタスクを作成してください'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          readonly={readonly}
        />
      ))}
    </div>
  );
};

export default TaskList; 