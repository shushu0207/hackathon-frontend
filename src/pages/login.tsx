import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // ログイン成功 -> ホームへ (本来はDBにユーザー情報があるかチェック推奨)
        navigate('/');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // 新規登録成功 -> プロフィール入力画面へUIDを渡して遷移
        // Firebase Authenticationの完了後、自社DBへの登録が必要
        navigate('/register/profile', { state: { uid: userCredential.user.uid, email } });
      }
    } catch (error) {
      alert(`エラー: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLogin ? 'ログイン' : '新規アカウント作成'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <Input 
            type="email" 
            placeholder="メールアドレス" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="パスワード" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit" className="w-full py-3 mt-4">
            {isLogin ? 'ログインして始める' : '登録して次へ'}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "アカウントをお持ちでないですか？" : "すでにアカウントをお持ちですか？"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-blue-600 font-bold ml-2 hover:underline"
          >
            {isLogin ? "新規登録" : "ログイン"}
          </button>
        </p>
      </div>
    </div>
  );
};