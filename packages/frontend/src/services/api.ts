import axios from 'axios';
import { Product, User } from '../types';

const API_URL = 'http://localhost:3001/api';


interface AuthResponse {
  token: string;
  user: User;
}

export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      username,
      password
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const registerUser = async (userData: Partial<User>): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export async function getUsers(): Promise<User[]> {
  const token = localStorage.getItem('token');
  return axios.get<User[]>(`${API_URL}/auth/users`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(response => response.data);
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<{ data: Product[] }>(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const token = localStorage.getItem('token');
  const response = await axios.post<Product>(`${API_URL}/products`, productData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
