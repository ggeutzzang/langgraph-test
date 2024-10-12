'use client';

import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import ChatHistory from '../components/ChatHistory';

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);

  const handleHistoryUpdate = (newHistory: string[]) => {
    setHistory(newHistory);
  };

  return (
    <main className="flex min-h-screen bg-gray-100">
      <aside className="w-64 p-6">
        <ChatHistory history={history} />
      </aside>
      <div className="flex-grow p-6">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">LangGraph Chatbot</h1>
        <ChatInterface onHistoryUpdate={handleHistoryUpdate} />
      </div>
    </main>
  );
}