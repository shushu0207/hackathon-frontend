import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { API_BASE_URL } from '../config';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const ChatRoom = () => {
  const { itemId } = useParams(); 
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const state = location.state as { partnerId: string, partnerName: string } | null;
  const partnerId = state?.partnerId || "";
  const partnerName = state?.partnerName || "相手";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージ取得関数
  const fetchMessages = async () => {
    if (!currentUser || !partnerId || !itemId) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/messages?item_id=${itemId}&user_a=${currentUser.uid}&user_b=${partnerId}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 初回ロード & 定期ポーリング (3秒ごと)
  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalId);
  }, [itemId, currentUser, partnerId]);

  // 新着メッセージがあれば一番下へスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: itemId,
          sender_id: currentUser.uid,
          receiver_id: partnerId,
          content: inputText,
        }),
      });

      if (res.ok) {
        setInputText('');
        fetchMessages();
    } else {
      alert('送信に失敗しました');
    }
  } catch (err) {
    console.error(err);
    alert('ネットワークエラーが発生しました');
  }
 };

if (!partnerId) {
  return <div className='p-8 text-center text-gray-500'>チャット相手が指定されていません</div>;
}

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-4">
      {/* ヘッダー */}
      <div className="bg-gray-100 p-4 border-b flex items-center justify-between">
        <h2 className="font-bold text-gray-700">
          {partnerName || 'ユーザー'} とのメッセージ
        </h2>
        <span className="text-xs text-gray-500">商品ID: {itemId}</span>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUser?.uid;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1"
        />
        <Button type="submit" disabled={!inputText} className="px-6">
          送信
        </Button>
      </form>
    </div>
  );
};