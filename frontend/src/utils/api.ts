import axios from 'axios';
import type { 
  Task, 
  User, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  CreateUserRequest, 
  CreateMemoRequest,
  AuthResponse,
  CalculatedProgress
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプターでトークンを追加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// レスポンスインターセプターでエラーハンドリング
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 認証関連
export const authAPI = {
  githubLogin: async (code: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/github', { code });
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// タスク関連
export const taskAPI = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getCompletedTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks/completed');
    return response.data;
  },
  
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id: number, taskData: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  
  getTaskMemos: async (taskId: number) => {
    const response = await api.get(`/tasks/${taskId}/memos`);
    return response.data;
  },
  
  createTaskMemo: async (taskId: number, memoData: CreateMemoRequest) => {
    const response = await api.post(`/tasks/${taskId}/memos`, memoData);
    return response.data;
  },
  
  getCalculatedProgress: async (taskId: number): Promise<CalculatedProgress> => {
    const response = await api.get(`/tasks/${taskId}/calculated-progress`);
    return response.data;
  },
};

// ユーザー関連
export const userAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  updateUser: async (id: number, displayName: string): Promise<User> => {
    const response = await api.put(`/users/${id}`, { display_name: displayName });
    return response.data;
  },
  
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default api; 