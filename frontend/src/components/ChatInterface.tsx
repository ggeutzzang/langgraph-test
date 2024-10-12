'use client';

import React, { useState, KeyboardEvent } from 'react';

interface ChatInterfaceProps {
    onHistoryUpdate: (history: string[]) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onHistoryUpdate }) => {
    const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, isUser: true }];
        setMessages(newMessages);
        setInput('');

        console.log('메시지 전송 시도:', input);

        try {
            console.log('API 호출 시작');
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
            console.log('API 응답 받음:', response.status);
            const data = await response.json();
            console.log('API 응답 데이터:', data);

            const updatedMessages = [...newMessages, { text: data.response, isUser: false }];
            setMessages(updatedMessages);

            // 대화 기록 업데이트
            const newHistory = [
                ...updatedMessages.map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`)
            ];
            onHistoryUpdate(newHistory);
        } catch (error) {
            console.error('메시지 전송 중 오류 발생:', error);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-3 rounded-lg ${
                            msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}>
                            {msg.text}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-grow p-3 rounded-l-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                    placeholder="메시지를 입력하세요..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition duration-200"
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
