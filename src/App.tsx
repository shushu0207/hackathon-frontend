// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContexts';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

// Pages
import { Home } from './pages/home';
import { Login } from './pages/login';
import { RegisterProfile } from './pages/RegisterProfile';
import { ItemDetail } from './pages/ItemDetail';
import { SellPage } from './pages/SellPage';
import { Purchase } from './pages/Purchase';
import { ChatRoom } from './pages/ChatRoom';
import { Inbox } from './pages/Inbox';

// Layout
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-bold text-2xl text-blue-600 tracking-tight hover:opacity-80">
            Be Flea
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-700 hidden md:block mr-2">
              {currentUser 
                ? `こんにちは、${currentUser.displayName || 'ユーザー'}さん` 
                : 'こんにちは、ゲストさん'}
            </span>

            <nav className="flex items-center gap-4">
              {currentUser ? (
                // ---------------------------
                // ログインしている時の表示
                // ---------------------------
                <>
                  <Link
                    to="/inbox"
                    className="text-gray-600 hover:text-blue-600 font-bold text-sm flex items-center gap-1 transition-colors"
                  >
                    <span className="text-lg">📩</span>
                    <span className="hidden sm:inline">メッセージ</span>
                  </Link>

                  <Link
                    to="/sell"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition"
                  >
                    出品する
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 font-bold text-sm border-l pl-4 ml-2"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                // ---------------------------
                // ログインしていない時の表示
                // ---------------------------
                <Link
                  to="/Login"
                  className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition shadow-md"
                >
                  ログイン / 登録
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="pt-6">{children}</main>
    </div>
  );
};

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/profile" element={<RegisterProfile />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/chat/:itemId" element={<ChatRoom />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;