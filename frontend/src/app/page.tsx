'use client';

import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import ChatHistory from '../components/ChatHistory';

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);

  const handleHistoryUpdate = (newHistory: string[]) => {
    // 최근 3개의 턴만 유지
    setHistory(newHistory.slice(-6));
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <aside className="w-1/4 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">대화 기록</h2>
        <ChatHistory history={history} />
      </aside>
      <div className="flex-grow p-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">LangGraph Chatbot</h1>
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <ChatInterface onHistoryUpdate={handleHistoryUpdate} />
        </div>
      </div>
    </main>
  );
}
