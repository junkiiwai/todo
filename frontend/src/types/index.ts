export interface User {
  id: number;
  github_username: string;
  display_name: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  name: string;
  description?: string;
  assignee_id?: number;
  priority: number;
  estimated_hours: number;
  deadline?: string;
  remaining_days?: number;
  progress: number;
  parent_task_id?: number;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
  assignee_name?: string;
  parent_task_name?: string;
  child_tasks?: Task[];
  memos?: TaskMemo[];
}

export interface TaskMemo {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user_name?: string;
}

export interface CreateTaskRequest {
  name: string;
  description?: string;
  assignee_id?: number;
  priority: number;
  estimated_hours?: number;
  deadline?: string;
  remaining_days?: number;
  progress?: number;
  parent_task_id?: number;
}

export interface UpdateTaskRequest {
  name?: string;
  description?: string;
  assignee_id?: number;
  priority?: number;
  estimated_hours?: number;
  deadline?: string;
  remaining_days?: number;
  progress?: number;
  parent_task_id?: number;
  status?: 'active' | 'completed';
}

export interface CreateUserRequest {
  github_username: string;
  display_name: string;
}

export interface CreateMemoRequest {
  content: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface CalculatedProgress {
  estimated_hours: number;
  progress: number;
} 