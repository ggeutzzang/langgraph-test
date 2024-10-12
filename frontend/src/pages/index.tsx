import ChatInterface from '../components/ChatInterface';

import React from 'react';

export default function Home() {
    const handleHistoryUpdate = () => {
        // 채팅 기록 업데이트 로직 구현
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>LangGraph Chatbot</h1>
            <ChatInterface onHistoryUpdate={handleHistoryUpdate} />
        </main>
    );
}