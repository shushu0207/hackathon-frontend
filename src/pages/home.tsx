import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config'; 

interface Item {
  id: string;
  name: string;
  price: number;
  image_url: string; 
  is_sold: boolean;
}

export const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const fetchItems = (searchQuery = '') => {
    const url = searchQuery
      ? `${API_BASE_URL}/items?name=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/items`;

    fetch(url)
      .then(res => res.json())
      .then(data => setItems(data || []))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = () => {
    fetchItems(keyword);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <div className="mb-10 p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-4">欲しいもの、見つかる。</h1>
        <p className="opacity-90 text-lg">AIがサポートする新しいフリマ体験</p>

        {/*検索バー*/}
        <div className="flex max-w-lg mx-auto bg-white rounded-full p-1 shadow-lg">
          <input
            type="text"
            placeholder='キーワードで検索（例：iPhone）'
            className='flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className='bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition'
          >
            検索
          </button>
        </div>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-bold text-gray-800'>
          {keyword ? `"${keyword}"の検索結果` : "新着商品"}
        </h2>
        {keyword && (
          <button
            onClick={() => { setKeyword(''); fetchItems(''); }}
            className='text-sm text-blue-600 hover:underline'
          >
            検索条件をクリア
          </button>
        )}
      </div>

      {/* 商品一覧表示エリア */}
      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-10">現在出品されている商品はありません。</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/items/${item.id}`)}
              className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="relative aspect-square bg-gray-100">
                {/* 売り切れバッジ */}
                {item.is_sold && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    SOLD
                  </div>
                )}
                {/* 商品画像 */}
                <img 
                  src={item.image_url || "https://placehold.co/400?text=No+Image"} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 truncate mb-1">{item.name}</h3>
                <p className="text-blue-600 font-bold">¥{item.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};