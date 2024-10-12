import React from 'react';

interface ChatHistoryProps {
    history: string[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 overflow-y-auto h-[calc(100vh-12rem)] shadow-inner">
            <ul className="space-y-3">
                {history.map((message, index) => (
                    <li key={index} className={`p-2 rounded-lg ${message.startsWith('User:') ? 'bg-blue-100' : 'bg-green-100'}`}>
                        <span className={`font-semibold ${message.startsWith('User:') ? 'text-blue-600' : 'text-green-600'}`}>
                            {message.split(':')[0]}:
                        </span>
                        <span className="ml-2 text-gray-700">{message.split(':')[1]}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHistory;
