'use client';

import React, { useState, KeyboardEvent } from 'react';

interface Message {
    text: string;
    timestamp: Date;
    isUser: boolean;
}

interface ChatInterfaceProps {
    onHistoryUpdate: (history: Message[]) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onHistoryUpdate }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage: Message = { text: input, timestamp: new Date(), isUser: true };
        const newMessages = [...messages, newMessage];
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

            const aiMessage: Message = { text: data.response, timestamp: new Date(), isUser: false };
            const updatedMessages = [...newMessages, aiMessage];
            setMessages(updatedMessages);

            // 대화 기록 업데이트
            onHistoryUpdate(updatedMessages);
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
                        <span className={`inline-block p-3 rounded-lg ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                            }`}>
                            {msg.text}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                            {msg.timestamp.toLocaleTimeString()}
                        </div>
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
