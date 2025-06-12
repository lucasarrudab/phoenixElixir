import api from './api';
import { Tag } from '../types';

export const getTags = async (): Promise<Tag[]> => {
  try {
    const resposta = await api.get('/tags');
    return resposta.data.data || resposta.data;
  } catch (erro) {
    console.error('Erro ao buscar tags:', erro);
    throw erro;
  }
};

export const getTag = async (id: number): Promise<Tag | null> => {
  try {
    const resposta = await api.get(`/tags/${id}`);
    return resposta.data.data || resposta.data;
  } catch (erro) {
    console.error(`Erro ao buscar tag com ID ${id}:`, erro);
    return null;
  }
};

export const criarTag = async (tag: Omit<Tag, 'id'>): Promise<Tag | null> => {
  try {
    const resposta = await api.post('/tags', { tag: tag });
    return resposta.data.data || resposta.data;
  } catch (erro) {
    console.error('Erro ao criar tag:', erro);
    return null;
  }
};

export const atualizarTag = async (id: number, tag: Partial<Tag>): Promise<Tag | null> => {
  try {
    const resposta = await api.put(`/tags/${id}`, { tag: tag });
    return resposta.data.data || resposta.data;
  } catch (erro) {
    console.error(`Erro ao atualizar tag com ID ${id}:`, erro);
    return null;
  }
};

export const deletarTag = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/tags/${id}`);
    return true;
  } catch (erro) {
    console.error(`Erro ao deletar tag com ID ${id}:`, erro);
    return false;
  }
};