import api from './api';
import { Usuario } from '../types';

export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const resposta = await api.get('/users');
    return resposta.data.data || resposta.data;
  } catch (erro) {
    throw erro;
  }
};

export const getUsuario = async (id: number): Promise<Usuario | null> => {
  try {
    const resposta = await api.get(`/users/${id}`);
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const getUsuarioWithTransactions = async (id: number): Promise<Usuario | null> => {
  try {
    const resposta = await api.get(`/users/${id}?include=transactions`);
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const criarUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<Usuario | null> => {
  try {
    const resposta = await api.post('/users', { user: usuario });
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const atualizarUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario | null> => {
  try {
    const resposta = await api.put(`/users/${id}`, { user: usuario });
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const deletarUsuario = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/users/${id}`);
    return true;
  } catch (erro) {
    return false;
  }
};