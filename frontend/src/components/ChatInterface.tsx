'use client';

import React, { useState } from 'react';

interface ChatInterfaceProps {
    onHistoryUpdate: (history: string[]) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onHistoryUpdate }) => {
    const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, isUser: true }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
            const data = await response.json();
            const updatedMessages = [...newMessages, { text: data.response, isUser: false }];
            setMessages(updatedMessages);

            // 대화 기록 업데이트
            const newHistory = [
                ...updatedMessages.map(msg => `${msg.isUser ? 'User' : 'AI'}: ${msg.text}`)
            ];
            onHistoryUpdate(newHistory);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white p-4 h-96 overflow-y-auto mb-4 rounded-lg shadow">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
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
                    className="flex-grow border p-2 rounded-l"
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;