import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContexts';
import { API_BASE_URL } from '../config'; 

interface ItemDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  image_urls: string[];
  seller_id: string;
  seller_name?: string;
  condition_rank: number;
  is_sold: boolean;
}

export const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE_URL}/items/${id}`) 
      .then(res => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data: ItemDetail) => {
        setItem(data);
        
        if (data.image_urls && data.image_urls.length > 0){
          setMainImage(data.image_urls[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleContact = () => {
    if (!currentUser) {
        alert('ログインしてください');
        return;
    }
    if (!item) return;

    navigate(`/chat/${item.id}`, { 
      state: { 
        partnerId: item.seller_id, 
        partnerName: item.seller_name 
      } 
    });
  };

  if (loading) return <div className="p-10 text-center">読み込み中</div>;
  if (!item) return <div className="p-10 text-center">商品が見つかりませんでした</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:flex gap-8">
      <div className="md:w-1/2">
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 border border-gray-200">
            {item.is_sold && (
                <div className='absolute bg-red-600 text-white font-bold px-4 py-1 m-4 rounded z-10'>
                    SOLD OUT
                </div>
            )}
          <img src={mainImage || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {item.image_urls?.map((url, i) => (
            <div 
                key={i} 
                className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden cursor-pointer border hover:border-blue-500"
                onClick={() => setMainImage(url)}
            >
                <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover"/>
            </div>
          ))}
        </div>
      </div>

      <div className="md:w-1/2 space-y-6 mt-6 md:mt-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.name}</h1>
          <p className="text-gray-500 text-sm">出品者: {item.seller_name}</p>
        </div>

        <div className="text-4xl font-bold text-blue-600">
          ¥{item.price.toLocaleString()}
        </div>

        <div className="space-y-3">
            <div className="flex gap-4">
            <Button 
                onClick={() => navigate(`/purchase/${item.id}`)} 
                className="flex-1 py-3 text-lg"
                disabled={item.is_sold}
            >
                {item.is_sold ? '売り切れ' : '購入画面へ進む'}
            </Button>
            <Button variant="secondary" className="px-6 text-2xl">
                ♥
            </Button>
            </div>
            
            <Button variant="outline" onClick={handleContact} className="w-full">
                出品者に質問する
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
  );
};