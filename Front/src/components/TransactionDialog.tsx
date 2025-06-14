import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import { Transacao, Tag, Usuario } from '../types';
import { criarTransacao, atualizarTransacao } from '../services/transacaoService';
import { getTags } from '../services/tagService';
import { getUsuarios } from '../services/usuarioService';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transacao?: Transacao;
  userId?: number;
}

const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  transacao,
  userId,
}) => {
  const [formData, setFormData] = useState({
    valor: '',
    descricao: '',
    tipo: 'entrada',
    user_id: userId,
    tag_ids: [] as number[],
  });
console.log("userId:", userId);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        try {
          setLoading(true);
          const [tags, users] = await Promise.all([
            getTags(),
            getUsuarios()
          ]);
          setAvailableTags(tags);
          setAvailableUsers(users);
        } catch (error) {
          console.error('Erro com os dados:', error);
          setAvailableTags([]);
          setAvailableUsers([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (transacao && availableTags.length > 0) {
      setFormData({
        valor: transacao.valor.toString(),
        descricao: transacao.descricao,
        tipo: transacao.tipo || 'entrada',
        user_id: transacao.user_id || userId || 1,
        tag_ids: transacao.tags?.map(tag => tag.id) || [],
      });
    } else if (!transacao) {
      setFormData({
        valor: '',
        descricao: '',
        tipo: 'entrada',
        user_id: userId,
        tag_ids: [],
      });
    }
  }, [transacao, userId, availableTags]);

  const handleTagChange = (tagId: number, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        tag_ids: [...prev.tag_ids, tagId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tag_ids: prev.tag_ids.filter(id => id !== tagId)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const transacaoData = {
        valor: parseFloat(formData.valor),
        descricao: formData.descricao,
        tipo: formData.tipo,
        user_id: formData.user_id,
        tag_ids: formData.tag_ids,
        data: new Date().toISOString(),
        inserted_at: new Date().toISOString(),
      };


      if (transacao) {
        await atualizarTransacao(transacao.id, transacaoData);
      } else {
        await criarTransacao(transacaoData);
      }
      setFormData({
      valor: '',
      descricao: '',
      tipo: 'entrada',
      user_id: userId,
      tag_ids: [],
    });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('erro', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId?: number) => {
    const user = availableUsers.find(u => u.id === userId);
    return user ? user.nome : "";
  };
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={transacao ? 'Editar Transação' : 'Nova Transação'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Usuário
          </label>
            <p className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white">
             {getUserName(formData.user_id) || 'Usuário não encontrado'}
           </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Tipo
          </label>
          <select
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descrição
          </label>
          <input
            type="text"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="max-h-32 overflow-y-auto space-y-2 bg-gray-700 rounded-md p-3">
              {availableTags.map((tag) => (
                <label key={tag.id} className="flex items-center cursor-pointer hover:bg-gray-600 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={formData.tag_ids.includes(tag.id)}
                    onChange={(e) => handleTagChange(tag.id, e.target.checked)}
                    className="mr-2 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-300">{tag.nome}</span>
                </label>
              ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {transacao ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default TransactionDialog;