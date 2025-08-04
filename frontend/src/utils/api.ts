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

// 一時的にAPI URLを設定（後で環境変数に変更）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API_BASE_URL:', API_BASE_URL);

// Axiosインスタンスを作成
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// タスク関連のAPI
export const taskApi = {
  // タスク一覧を取得
  getTasks: () => api.get<Task[]>('/tasks'),
  
  // タスクを作成
  createTask: (data: CreateTaskRequest) => api.post<Task>('/tasks', data),
  
  // タスクを更新
  updateTask: (id: number, data: UpdateTaskRequest) => api.put<Task>(`/tasks/${id}`, data),
  
  // タスクを削除
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
  
  // タスクの進捗を計算
  calculateProgress: (id: number) => api.get<CalculatedProgress>(`/tasks/${id}/progress`),
};

// ユーザー関連のAPI
export const userApi = {
  // ユーザー一覧を取得
  getUsers: () => api.get<User[]>('/users'),
  
  // ユーザーを作成
  createUser: (data: CreateUserRequest) => api.post<User>('/users', data),
  
  // ユーザーを更新
  updateUser: (id: number, data: CreateUserRequest) => api.put<User>(`/users/${id}`, data),
  
  // ユーザーを削除
  deleteUser: (id: number) => api.delete(`/users/${id}`),
};

// メモ関連のAPI
export const memoApi = {
  // タスクのメモを取得
  getMemos: (taskId: number) => api.get(`/tasks/${taskId}/memos`),
  
  // メモを作成
  createMemo: (taskId: number, data: CreateMemoRequest) => api.post(`/tasks/${taskId}/memos`, data),
};

// 認証関連のAPI
export const authApi = {
  // GitHub OAuth認証
  githubAuth: (code: string) => api.post<AuthResponse>('/auth/github', { code }),
  
  // 現在のユーザー情報を取得
  getMe: () => api.get<User>('/auth/me'),
};

export default api; 