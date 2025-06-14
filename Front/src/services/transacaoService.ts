import api from './api';
import { Transacao } from '../types';

export const getTransacoes = async (): Promise<Transacao[]> => {
  try {
    const resposta = await api.get('/transactions');
    return resposta.data.data || resposta.data;
  } catch (erro) {
    throw erro;
  }
};

export const getTransacoesByUser = async (userId: number): Promise<Transacao[]> => {
  try {
    const resposta = await api.get(`/transactions?user_id=${userId}`);
    const transactions = resposta.data.data || resposta.data;
    
    return transactions.filter((t: Transacao) => t.user_id === userId);
  } catch (erro) {
    throw erro;
  }
};

export const getTransacao = async (id: number): Promise<Transacao | null> => {
  try {
    const resposta = await api.get(`/transactions/${id}`);
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const criarTransacao = async (transacao: Omit<Transacao, 'id'>): Promise<Transacao | null> => {
  try {
    const resposta = await api.post('/transactions', { transaction: transacao });
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const atualizarTransacao = async (id: number, transacao: Partial<Transacao>): Promise<Transacao | null> => {
  try {
    const resposta = await api.put(`/transactions/${id}`, { transaction: transacao });
    return resposta.data.data || resposta.data;
  } catch (erro) {
    return null;
  }
};

export const deletarTransacao = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/transactions/${id}`);
    return true;
  } catch (erro) {
    return false;
  }
};