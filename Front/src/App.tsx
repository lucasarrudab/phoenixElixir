import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import UserList from './views/UserList';
import TransactionList from './views/TransactionList';
import TagList from './views/TagList';

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/users" />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/tags" element={<TagList />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;