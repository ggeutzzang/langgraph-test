import React from 'react';

interface ChatHistoryProps {
    history: string[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 overflow-y-auto h-[calc(100vh-8rem)]">
            <h2 className="text-lg font-semibold mb-4">대화 기록</h2>
            <ul className="space-y-2">
                {history.map((message, index) => (
                    <li key={index} className="text-sm">
                        {message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatHistory;