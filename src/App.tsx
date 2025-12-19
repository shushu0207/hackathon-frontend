// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context
import { AuthProvider } from './contexts/AuthContexts';

// Pages
import { Home } from './pages/home';
import { Login } from './pages/login';
import { RegisterProfile } from './pages/RegisterProfile';
import { ItemDetail } from './pages/ItemDetail';
import { SellPage } from './pages/SellPage';
import { Purchase } from './pages/Purchase';
import { ChatRoom } from './pages/ChatRoom';

// Layout (ヘッダーなどを共通化するためのコンポーネントがあると仮定)
// なければ div で囲むだけでもOKです
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    {/* ここにHeaderコンポーネントを入れると良いです */}
    <header className="bg-white shadow-sm p-4 mb-4">
      <div className="max-w-6xl mx-auto font-bold text-xl text-blue-600">
        <a href="/">Kaizen Flea Market</a>
      </div>
    </header>
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* ホーム */}
            <Route path="/" element={<Home />} />
            
            {/* 認証・登録 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register/profile" element={<RegisterProfile />} />
            
            {/* 商品関連 */}
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/purchase/:id" element={<Purchase />} />
            
            {/* DM */}
            <Route path="/chat/:itemId" element={<ChatRoom />} />
            
            {/* 404対策（不明なURLはホームへ） */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;