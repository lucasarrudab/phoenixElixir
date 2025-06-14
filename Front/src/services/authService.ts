import api from './api';
import { LoginCredentials, RegisterData, AuthUser } from '../types';

interface AuthResponse {
  user: {
    id: number;
    nome: string;
    email: string;
  };
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): AuthUser | null => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      return { ...user, token };
    }
    
    return null;
  } catch (error) {
    return null;
  }
};