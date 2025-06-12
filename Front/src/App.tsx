import React, { useState } from 'react';
import Header from './components/Header';
import UserList from './views/UserList';
import TagList from './views/TagList';
import { ViewType } from './types';

function App() {
  const [viewAtual, setViewAtual] = useState<ViewType>(ViewType.USUARIO);

  const renderView = () => {
    switch (viewAtual) {
      case ViewType.USUARIO:
        return <UserList />;
      case ViewType.TAG:
        return <TagList />;
      default:
        return <UserList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header viewAtual={viewAtual} setViewAtual={setViewAtual} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {renderView()}
      </main>
    </div>
  );
}

export default App;