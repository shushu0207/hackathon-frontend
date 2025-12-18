import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export const Purchase = () => {
  const { id } = useParams(); // 商品ID
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // ユーザーの登録情報を格納
  const [address, setAddress] = useState('');
  const [item, setItem] = useState<any>(null); // 型定義は省略

  useEffect(() => {
    // 1. 商品情報取得
    fetch(`http://localhost:8080/items/${id}`).then(r => r.json()).then(setItem);

    // 2. ユーザーの住所情報を取得 (バックエンドにエンドポイントが必要)
    // GET /user/me?uid=xxxxx のようなAPIを想定
    if (currentUser?.uid) {
       // ここではモックとして固定値をセット、実際はAPIから取得する
       // fetch(`http://localhost:8080/user/profile?uid=${currentUser.uid}`)
       setAddress('東京都渋谷区... (登録情報を自動表示)');
    }
  }, [id, currentUser]);

  const handlePurchase = async () => {
    if (!currentUser) return alert('ログインしてください');

    const res = await fetch('http://localhost:8080/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        item_id: id,
        buyer_id: currentUser.uid // 本来はサーバー側でTokenから検証すべき
      }),
    });

    if (res.ok) {
      alert('購入ありがとうございます！');
      navigate('/');
    } else {
      alert('購入処理に失敗しました。売り切れの可能性があります。');
    }
  };

  if (!item) return <div>読み込み中...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">購入内容の確認</h2>
      
      <div className="flex gap-4 mb-6">
        <img src={item.image_url} alt="" className="w-24 h-24 object-cover rounded-md bg-gray-100"/>
        <div>
          <p className="font-bold text-lg">{item.name}</p>
          <p className="text-gray-600">¥{item.price.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-500 mb-1">配送先 (登録済みの住所)</h3>
          <p className="font-medium text-gray-800">{address}</p>
          <button className="text-blue-600 text-sm mt-2 hover:underline">変更する</button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-bold text-gray-500 mb-1">支払い方法</h3>
          <p className="font-medium text-gray-800">クレジットカード (**** 1234)</p>
          <button className="text-blue-600 text-sm mt-2 hover:underline">変更する</button>
        </div>
      </div>

      <div className="flex justify-between items-center text-xl font-bold mb-6">
        <span>支払い金額</span>
        <span>¥{item.price.toLocaleString()}</span>
      </div>

      <Button onClick={handlePurchase} className="w-full py-4 text-lg bg-red-500 hover:bg-red-600">
        購入を確定する
      </Button>
    </div>
  );
};