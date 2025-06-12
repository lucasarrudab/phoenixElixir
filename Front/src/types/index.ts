// Types for the application

export enum ViewType {
  USUARIO = 'usuario',
  TRANSACAO = 'transacao',
  TAG = 'tag'
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  inserted_at?: string;
  updated_at?: string;
}

export interface Transacao {
  id: number;
  valor: number;
  descricao: string;
  data?: string;
  inserted_at: string;
  updated_at?: string;
  tipo?: string;
  user_id?: number;
  tags?: Tag[];
  tag_ids?: number[];
}

export interface Tag {
  id: number;
  nome: string;
  inserted_at?: string;
  updated_at?: string;
}