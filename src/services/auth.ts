import { apiService } from './api';
import { ApiResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLogin: string;
  };
}

export const authService = {
  // Admin login
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/auth/login', credentials);
  },

  // Get admin profile
  async getProfile(): Promise<ApiResponse<any>> {
    return apiService.get('/auth/profile');
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    return apiService.post('/auth/logout');
  },
};

export default authService;
