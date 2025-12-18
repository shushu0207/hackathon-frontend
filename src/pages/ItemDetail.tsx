import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// 商品型定義 (APIレスポンスに合わせて調整)
interface ItemDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  seller_name: string;
  condition_rank: number;
  is_sold: boolean;
}

export const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    // 本来は GET /items/:id
    fetch(`http://localhost:8080/items/${id}`) 
      .then(res => res.json())
      .then(data => setItem(data));
      if (data.image_urls && data.image_urls.length > 0){
        setMainImage(data.image_urls[0]);
      }
  }, [id]);

  if (!item) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:flex gap-8">
      {/* 左カラム: 画像 */}
      <div className="md:w-1/2">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
            {item.is_sold && (<div className='absolute bg-red-600 text-white font-bold px-4 py-1 m-4 rounded z-10'>SOLD OUT</div>)}
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        </div>
        {/* サムネイル一覧 (実装イメージ) */}
        <div className="flex gap-2 overflow-x-auto">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* 右カラム: 情報 & アクション */}
      <div className="md:w-1/2 space-y-6 mt-6 md:mt-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
          <p className="text-gray-500 text-sm">出品者: {item.seller_name}</p>
        </div>

        <div className="text-4xl font-bold text-blue-600">
          ¥{item.price.toLocaleString()}
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={() => navigate(`/purchase/${item.id}`)} 
            className="flex-1 py-3 text-lg"
          >
            購入画面へ進む
          </Button>
          <Button variant="secondary" className="px-6 text-2xl">
            ♥
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="font-bold mb-2">商品の説明</h3>
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {item.description}
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 p-4 rounded-xl">
          <h3 className="font-bold mb-2">商品の状態</h3>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-2xl ${i < item.condition_rank ? 'text-yellow-400' : 'text-gray-200'}`}>
                ★
              </span>
            ))}
            <span className="text-gray-500 text-sm ml-2">ランク {item.condition_rank}</span>
          </div>
        </div>
      </div>
    </div>

// 遷移ハンドラ
const handleContact = () => {
  if (!currentUser) return alert('ログインしてください');
  
  // 自分が出品者の場合は遷移させない、もしくは購入者リストを表示するなどの分岐が必要
  // ここでは「購入希望者として出品者に連絡する」パターン
  navigate(`/chat/${item.id}`, { 
    state: { 
      partnerId: item.seller_id, // 商品情報にseller_idが含まれている前提
      partnerName: item.seller_name 
    } 
  });
};

// ... JSX内 ...
<Button variant="outline" onClick={handleContact} className="w-full mt-2">
  出品者に質問する
</Button>
  );
};