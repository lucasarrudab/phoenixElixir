import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import { Usuario } from '../types';
import { criarUsuario, atualizarUsuario } from '../services/usuarioService';

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  usuario?: Usuario;
}

const UserDialog: React.FC<UserDialogProps> = ({ isOpen, onClose, onSuccess, usuario }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '', 
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        senha: '',
      });
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (usuario) {
        const updateData = {
          nome: formData.nome,
          email: formData.email,
          ...(formData.senha ? { senha: formData.senha } : {}),
        };
        await atualizarUsuario(usuario.id, updateData);
      } else {
        await criarUsuario(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={usuario ? 'Editar Usuário' : 'Novo Usuário'}
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
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {usuario ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
          </label>
          <input
            type="password"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            {...(!usuario && { required: true })}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            {usuario ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default UserDialog;