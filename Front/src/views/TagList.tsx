import React, { useEffect, useState } from 'react';
import { getTags, deletarTag } from '../services/tagService';
import { Tag as TagType } from '../types';
import { Tag as TagIcon, Edit2, Trash2, Calendar } from 'lucide-react';
import TagDialog from '../components/TagDialog';

const TagList: React.FC = () => {
  const [tags, setTags] = useState<TagType[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();

  const fetchTags = async () => {
    try {
      setCarregando(true);
      const data = await getTags();
      setTags(data);
      setErro(null);
    } catch (error) {
      console.error('Erro ao buscar tags', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEdit = (tag: TagType) => {
    setSelectedTag(tag);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTag(undefined);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta tag?')) {
      try {
        await deletarTag(id);
        await fetchTags();
      } catch (error) {
        console.error('Erro ao deletar tag:', error);
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
        <h2 className="text-2xl font-bold text-white">Tags</h2>
        <button
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Nova Tag
        </button>
      </div>

      {tags.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">Nenhuma tag encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <div 
              key={tag.id}
              className="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-purple-900/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <TagIcon size={16} className="text-white" />
                  </div>
                  <span className="text-md font-medium text-white">
                    {tag.nome}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(tag)}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tag.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {tag.inserted_at && (
                <div className="flex items-center text-gray-400 text-xs">
                  <Calendar size={12} className="mr-1" />
                  <span>Criada em: {new Date(tag.inserted_at).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <TagDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={fetchTags}
        tag={selectedTag}
      />
    </div>
  );
};

export default TagList;