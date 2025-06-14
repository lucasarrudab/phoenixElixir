import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import { Tag } from '../types';
import { criarTag, atualizarTag } from '../services/tagService';

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tag?: Tag;
}

const TagDialog: React.FC<TagDialogProps> = ({ isOpen, onClose, onSuccess, tag }) => {
  const [formData, setFormData] = useState({
    nome: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tag) {
      setFormData({
        nome: tag.nome,
      });
    } else {
      setFormData({
        nome: '',
      });
    }
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (tag) {
        await atualizarTag(tag.id, formData);
      } else {
        await criarTag(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tag:', error);
      alert('Erro ao salvar tag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={tag ? 'Editar Tag' : 'Nova Tag'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={loading}
          />
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
            {loading ? 'Salvando...' : (tag ? 'Salvar' : 'Criar')}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default TagDialog;