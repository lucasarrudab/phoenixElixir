import React, { useEffect, useState } from 'react';
import { getUsuarios, deletarUsuario } from '../services/usuarioService';
import { getTransacoesByUser } from '../services/transacaoService';
import { Usuario, Transacao } from '../types';
import { User, Calendar, ChevronDown, ChevronRight, Tag as TagIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import UserDialog from '../components/UserDialog';
import TransactionDialog from '../components/TransactionDialog';

const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [userTransactions, setUserTransactions] = useState<Record<number, Transacao[]>>({});
  const [expandedUsers, setExpandedUsers] = useState<Set<number>>(new Set());
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | undefined>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | undefined>();
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  const fetchUsuarios = async () => {
    try {
      setCarregando(true);
      const data = await getUsuarios();
      setUsuarios(data);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar usuários. Tente novamente mais tarde.');
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setCarregando(false);
    }
  };

  const fetchUserTransactions = async (userId: number) => {
    try {
      const transactions = await getTransacoesByUser(userId);
      setUserTransactions(prev => ({
        ...prev,
        [userId]: transactions
      }));
    } catch (error) {
      console.error(`Erro ao buscar transações do usuário ${userId}:`, error);
      setUserTransactions(prev => ({
        ...prev,
        [userId]: []
      }));
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const toggleUserExpansion = async (userId: number) => {
    const newExpanded = new Set(expandedUsers);
    
    if (expandedUsers.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
      // Always fetch fresh transactions when expanding
      await fetchUserTransactions(userId);
    }
    
    setExpandedUsers(newExpanded);
  };

  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedUser(undefined);
    setDialogOpen(true);
  };

  const handleAddTransaction = (userId: number) => {
    setSelectedUserId(userId);
    setSelectedTransaction(undefined);
    setTransactionDialogOpen(true);
  };

  const handleEditTransaction = (transacao: Transacao) => {
    setSelectedTransaction(transacao);
    setSelectedUserId(transacao.user_id);
    setTransactionDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await deletarUsuario(id);
        await fetchUsuarios();
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  const handleTransactionSuccess = async () => {
    if (selectedUserId) {
      await fetchUserTransactions(selectedUserId);
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
        <p>{erro}</p>
      </div>
    );
  }
console.log(usuarios);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Usuários</h2>
        <button
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Novo Usuário
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {usuarios.map((usuario) => (
            <div 
              key={usuario.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-900/20 transition-all duration-200"
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => toggleUserExpansion(usuario.id)}
                      className="mr-3 text-gray-400 hover:text-white transition-colors"
                    >
                      {expandedUsers.has(usuario.id) ? (
                        <ChevronDown size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>
                    
                    <div className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center mr-4">
                      <User size={24} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{usuario.nome}</h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <span>{usuario.email}</span>
                      </div>
                      {usuario.inserted_at && (
                        <div className="flex items-center text-gray-400 text-xs mt-1">
                          <Calendar size={12} className="mr-1" />
                          <span>Criado em: {new Date(usuario.inserted_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(usuario)}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-200 px-3 py-1 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200 px-3 py-1 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>

              {expandedUsers.has(usuario.id) && (
                <div className="border-t border-gray-700 bg-gray-750">
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-white flex items-center">
                        Transações do {usuario.nome}
                      </h4>
                      <button
                        onClick={() => handleAddTransaction(usuario.id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Nova Transação
                      </button>
                    </div>

                    {!userTransactions[usuario.id] ? (
                      <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                      </div>
                    ) : userTransactions[usuario.id]?.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-400 text-sm">Nenhuma transação encontrada para este usuário</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userTransactions[usuario.id]?.map((transacao) => (
                          <div 
                            key={transacao.id}
                            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <div className="flex-shrink-0 h-8 w-8 mr-3">
                                    {transacao.tipo === 'entrada' ? (
                                      <div className="bg-green-900/30 rounded-full h-8 w-8 flex items-center justify-center">
                                        <ArrowDownLeft size={16} className="text-green-400" />
                                      </div>
                                    ) : (
                                      <div className="bg-red-900/30 rounded-full h-8 w-8 flex items-center justify-center">
                                        <ArrowUpRight size={16} className="text-red-400" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-white font-medium">{transacao.descricao}</span>
                                  <span className={`ml-3 font-semibold ${
                                    transacao.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {formatarValor(transacao.valor)}
                                  </span>
                                </div>
                                
                                {transacao.tags && transacao.tags.length > 0 && (
                                  <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <TagIcon size={14} className="text-gray-400" />
                                    {transacao.tags.map((tag) => (
                                      <span 
                                        key={tag.id}
                                        className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full text-xs"
                                      >
                                        {tag.nome}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="text-gray-400 text-xs">
                                  {new Date(transacao.inserted_at).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handleEditTransaction(transacao)}
                                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 ml-4"
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <UserDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchUsuarios}
        usuario={selectedUser}
      />

      <TransactionDialog
        isOpen={transactionDialogOpen}
        onClose={() => setTransactionDialogOpen(false)}
        onSuccess={handleTransactionSuccess}
        transacao={selectedTransaction}
        userId={selectedUserId}
      />
    </div>
  );
};

export default UserList;