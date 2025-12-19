import React, { useEffect, useState } from 'react';

interface Item {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export const Home = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // API呼び出し
    fetch('http://localhost:8080/items')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* ヒーローセクション */}
      <div className="mb-8 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white text-center shadow-xl">
        <h1 className="text-3xl font-bold mb-2">欲しいもの、見つかる。</h1>
        <p className="opacity-90">AIがサポートする新しいフリマ体験</p>
      </div>

      {/* 検索バー（UIのみ） */}
      <div className="flex gap-2 mb-8">
        <input 
          type="text" 
          placeholder="何をお探しですか？" 
          className="flex-1 p-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button className="bg-gray-900 text-white px-8 rounded-full font-bold">検索</button>
      </div>

      {/* 商品グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-2">
              <img 
                src={item.image_url || "https://placehold.co/400"} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
            <p className="text-blue-600 font-bold">¥{item.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};