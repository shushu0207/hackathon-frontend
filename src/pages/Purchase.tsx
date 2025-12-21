import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import { Button } from '../components/ui/Button';
import { API_BASE_URL } from '../config';

export const Purchase = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [realName, setRealName] = useState('');
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    // 1. 商品情報取得
    fetch(`${API_BASE_URL}/items/${id}`).then(r => r.json()).then(setItem);

    if (currentUser?.uid) {
       fetch(`${API_BASE_URL}/user?uid=${currentUser.uid}`)
         .then(res => {
            if(!res.ok) throw new Error("Fetch failed");
            return res.json();
         })
         .then(data => {
            const user = Array.isArray(data) ? data[0] : data;
            
            if (user) {
                setAddress(user.address || '');
                setRealName(user.real_name || '');
            }
         })
         .catch(err => console.error("ユーザー情報の取得に失敗", err));
    }
  }, [id, currentUser]);

  const handlePurchase = async () => {
    if (!currentUser) return alert('ログインしてください');

    const res = await fetch(`${API_BASE_URL}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_id: id,
        buyer_id: currentUser.uid 
      }),
    });

    if (res.ok) {
      alert('購入ありがとうございます！');
      navigate('/');
    } else {
      alert('購入処理に失敗しました。');
    }
  };

  if (!item) return <div>読み込み中...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">購入内容の確認</h2>
      
      <div className="flex gap-4 mb-6">
        <img src={item.image_urls ? item.image_urls[0] : item.image_url} alt="" className="w-24 h-24 object-cover rounded-md bg-gray-100"/>
        <div>
          <p className="font-bold text-lg">{item.name}</p>
          <p className="text-gray-600">¥{item.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">出品者: {item.seller_name}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-500 mb-1">配送先 (登録情報)</h3>
          <p className="font-medium text-gray-800">
            {address ? `〒000-0000 ${address}` : '住所が登録されていません'}
          </p>
          <p className="font-medium text-gray-800 mt-1">
             {realName ? `${realName} 様` : ''}
          </p>
          <button onClick={() => navigate('/register/profile')} className="text-blue-600 text-sm mt-2 hover:underline">
            変更する (プロフィール編集)
          </button>
        </div>
        {/* ... */}
      </div>

      <Button onClick={handlePurchase} className="w-full py-4 text-lg bg-red-500 hover:bg-red-600">
        購入を確定する
      </Button>
    </div>
  );
};