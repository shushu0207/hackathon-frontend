import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { uid, email } = location.state || {};

  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return alert("不正なアクセスです");

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebase_uid: uid,           
          name: username,
          age: Number(age),
          email: email,
        }),
      });

      if (res.ok) {
        alert('登録が完了しました！');
        navigate('/');
      } else {
        throw new Error('登録に失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">プロフィール設定</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">ユーザー名</label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="表示名を入力" 
              required 
            />
          </div>

          <div className='mt-4'>
            <label className='text-sm font-bold text-gray-700'>年齢</label>
            <Input
              type='number'
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder='年齢を入力'
              required
              min="20"
              max="80"
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