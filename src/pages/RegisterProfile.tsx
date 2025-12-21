import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { API_BASE_URL } from '../config';

// ★追加: Firebaseのプロフィール更新機能
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContexts';

export const RegisterProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // ★追加: currentUserを取得
  const { currentUser } = useAuth();
  
  const { uid, email } = location.state || {};

  const [username, setUsername] = useState('');
  const [realName, setRealName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return alert("不正なアクセスです");

    setLoading(true);
    try {
      // 1. バックエンド(MySQL)への保存
      const res = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebase_uid: uid,           
          name: username,
          real_name: realName,
          address: address,
          age: Number(age),
          email: email,
        }),
      });

      if (!res.ok) {
        throw new Error('バックエンドへの登録に失敗しました');
      }

      // 2. ★追加: Firebase側の表示名(displayName)を更新
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: username
        }).catch(err => console.error("Firebase Profile Update Error:", err));
        
        // プロフィール更新を反映させるために強制リロードする手もありますが、
        // 次回の画面遷移時には反映されていることが多いです。
      }

      alert('登録が完了しました！');
      navigate('/'); 
      
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // ... (return内のJSXは変更なし) ...
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">プロフィール設定</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">ユーザー名 (表示名)</label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="例: メルカリ太郎" 
              required 
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">本名 (配送用)</label>
            <Input 
              value={realName} 
              onChange={(e) => setRealName(e.target.value)} 
              placeholder="例: 山田 太郎" 
              required 
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">住所 (配送先)</label>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="例: 東京都渋谷区..." 
              required 
            />
          </div>

          <div>
            <label className='text-sm font-bold text-gray-700'>年齢</label>
            <Input
              type='number'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder='年齢を入力'
              required
              min="18"
              max="100"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full py-3 mt-4">
            {loading ? '登録中...' : '利用を開始する'}
          </Button>
        </form>
      </div>
    </div>
  );
};