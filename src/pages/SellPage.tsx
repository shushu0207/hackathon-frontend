import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const SellPage = () => {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Gemini API呼び出し
  const handleAIGenerate = async () => {
    if (!name) return alert('商品名を入力してください');
    setIsLoadingAI(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          keywords: keywords.split(','), // カンマ区切りで配列化
          condition: 3 // 仮置き
        }),
      });
      const data = await res.json();
      setDescription(data.description);
    } catch (error) {
      console.error(error);
      alert('AI生成に失敗しました');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">商品を出品する</h2>

      <div className="space-y-6">
        {/* 画像アップロード（UIのみ） */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition cursor-pointer">
          <span className="text-4xl">📷</span>
          <span className="text-sm mt-2">クリックして写真をアップロード</span>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">商品名</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="例: iPhone 14 Pro 128GB"
          />
        </div>

        {/* AI アシストセクション */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-blue-800">✨ AI説明文生成</label>
            <span className="text-xs text-blue-600 bg-white px-2 py-1 rounded-full">Gemini Pro</span>
          </div>
          <Input 
            className="mb-3 text-sm"
            placeholder="キーワードを入力 (例: 美品, 箱あり, バッテリー良好)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <Button 
            onClick={handleAIGenerate} 
            disabled={isLoadingAI}
            className="w-full text-sm py-2"
          >
            {isLoadingAI ? 'AIが考え中...' : '説明文を自動生成する'}
          </Button>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">商品の説明</label>
          <textarea 
            className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 h-40"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="AI生成ボタンを押すとここに自動入力されます"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">販売価格 (¥)</label>
          <Input type="number" placeholder="0" className="text-lg font-mono" />
        </div>

        <div className="pt-4">
          <Button className="w-full py-4 text-lg shadow-blue-300 shadow-lg">
            出品する
          </Button>
        </div>
      </div>
    </div>
  );
};