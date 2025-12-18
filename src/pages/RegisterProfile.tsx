import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const RegisterProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 前の画面からUIDを受け取る
  const { uid, email } = location.state as { uid: string, email: string } || {};

  const [formData, setFormData] = useState({
    name: '', age: 20, phone: '', address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バックエンドへ送信
    const res = await fetch('http://localhost:8080/user', { // POSTメソッド
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebase_uid: uid, // ここで紐付け
        email: email,
        ...formData,
        age: Number(formData.age)
      }),
    });

    if (res.ok) {
      alert('登録完了しました！');
      navigate('/');
    } else {
      alert('登録に失敗しました');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6">プロフィール入力</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-700">お名前</label>
          <Input 
            required 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700">年齢</label>
          <Input 
            type="number" 
            value={formData.age} 
            onChange={e => setFormData({...formData, age: Number(e.target.value)})} 
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700">電話番号</label>
          <Input 
            type="tel" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
          />
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700">住所</label>
          <Input 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
            placeholder="配送先として使用されます"
          />
        </div>
        <Button type="submit" className="w-full mt-4">利用を開始する</Button>
      </form>
    </div>
  );
};