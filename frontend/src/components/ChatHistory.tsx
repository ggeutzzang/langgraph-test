import React from 'react';

interface Message {
    text: string;
    timestamp: Date;
    isUser: boolean;
}

interface ChatHistoryProps {
    messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto h-[calc(100vh-12rem)] shadow-inner">
            <ul className="space-y-3">
                {messages.map((message, index) => (
                    <li key={index} className={`p-2 rounded-lg ${message.isUser ? 'bg-blue-100' : 'bg-green-100'}`}>
                        <div className={`font-semibold ${message.isUser ? 'text-blue-600' : 'text-green-600'}`}>
                            {message.isUser ? 'User:' : 'AI:'}
                        </div>
                        <div className="ml-2 text-gray-700">{message.text}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHistory;
