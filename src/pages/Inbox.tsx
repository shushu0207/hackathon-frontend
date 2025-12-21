import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import { API_BASE_URL } from '../config'; 

interface InboxItem {
  item_id: string;
  item_name: string;
  partner_id: string;
  last_message: string;
}

export const Inbox = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInbox = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/messages/inbox?seller_id=${currentUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setInbox(data || []);
        }
      } catch (err) {
        console.error("Inbox取得エラー", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [currentUser]);

  if (!currentUser) return <div className="p-10 text-center">ログインしてください</div>;
  if (loading) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 pb-2 border-b">
        お問い合わせ一覧 <span className="text-sm font-normal text-gray-500">(出品した商品)</span>
      </h1>
      
      <div className="space-y-3">
        {inbox.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">まだメッセージはありません</p>
          </div>
        ) : (
          inbox.map((item, idx) => (
            <div 
              key={`${item.item_id}-${item.partner_id}-${idx}`}
              onClick={() => navigate(`/chat/${item.item_id}`, {
                // チャット画面へ相手のIDを渡す
                state: { 
                    partnerId: item.partner_id, 
                    partnerName: "購入希望者" // ここは相手の名前が取れていればそれを入れる
                }
              })}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md cursor-pointer transition duration-200 flex justify-between items-center group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-medium">商品</span>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition">
                        {item.item_name}
                    </h3>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                   <span>💬 相手ID: {item.partner_id.slice(0, 8)}...</span>
                </p>
              </div>
              
              <div className="flex items-center text-blue-500 font-bold text-sm">
                チャットを開く 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};