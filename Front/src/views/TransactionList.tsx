import React, { useEffect, useState } from 'react';
import { getTransacoes, deletarTransacao } from '../services/transacaoService';
import { Transacao } from '../types';
import { Calendar, ArrowUpRight, ArrowDownLeft, Tag as TagIcon } from 'lucide-react';
import TransactionDialog from '../components/TransactionDialog';

const TransactionList: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transacao | undefined>();

  const fetchTransacoes = async () => {
    try {
      setCarregando(true);
      const data = await getTransacoes();
      setTransacoes(data);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar transações. Tente novamente mais tarde.');
      console.error('Erro ao buscar transações:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchTransacoes();
  }, []);

  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleEdit = (transacao: Transacao) => {
    setSelectedTransaction(transacao);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTransaction(undefined);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deletarTransacao(id);
        await fetchTransacoes();
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
      }
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Transações</h2>
        <button
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Nova Transação
        </button>
      </div>

      {transacoes.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="hover:bg-gray-750 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
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
                        <div className="text-sm font-medium text-white">
                          {transacao.descricao}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${
                        transacao.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatarValor(transacao.valor)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transacao.tags && transacao.tags.length > 0 ? (
                        <div className="flex items-center flex-wrap gap-1">
                          {transacao.tags.map((tag) => (
                            <span 
                              key={tag.id}
                              className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full text-xs flex items-center"
                            >
                              <TagIcon size={10} className="mr-1" />
                              {tag.nome}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Sem tags</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1.5 text-gray-400" />
                        {new Date(transacao.inserted_at).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(transacao)}
                        className="text-purple-400 hover:text-purple-300 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(transacao.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TransactionDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchTransacoes}
        transacao={selectedTransaction}
      />
    </div>
  );
};

export default TransactionList;