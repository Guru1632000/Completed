import React from 'react';

interface LeaderboardItem {
    rank: number;
    title: string;
    subtitle?: string;
    value: string;
    valueLabel: string;
}

interface LeaderboardProps {
    items: LeaderboardItem[];
}

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.429a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM6.757 4.015a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM11 16a1 1 0 10-2 0v1a1 1 0 102 0v-1zM6.757 14.571a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM15.657 13.157a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM3.293 4.293a1 1 0 011.414 0L6 5.586V4a1 1 0 112 0v1.586l1.293-1.293a1 1 0 111.414 1.414L9.414 7.05 11.293 8.93a1 1 0 11-1.414 1.414L8 8.464V10a1 1 0 11-2 0V8.464l-1.879 1.879a1 1 0 01-1.414-1.414L4.586 7.05 3.293 5.707a1 1 0 010-1.414zM17 4a1 1 0 10-2 0v1.586l-1.293-1.293a1 1 0 10-1.414 1.414L13.586 7.05l-1.879 1.879a1 1 0 101.414 1.414L15 8.464V10a1 1 0 102 0V8.464l1.293 1.293a1 1 0 101.414-1.414L18.414 7.05 17 5.586V4z" clipRule="evenodd" />
    </svg>
);


const Leaderboard: React.FC<LeaderboardProps> = ({ items }) => {
    return (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-white/10 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5.268l4.06-4.06a1 1 0 011.414 1.414l-4.06 4.06H19a1 1 0 011 1v2a1 1 0 01-1 1h-5.268l4.06 4.06a1 1 0 01-1.414 1.414l-4.06-4.06V18a1 1 0 01-1.7.707l-5-5a1 1 0 010-1.414l5-5A1 1 0 0111.3 1.046z" clipRule="evenodd" />
                    </svg>
                    Top Topics
                </h3>
            </div>
            <p className="text-sm text-gray-400 mt-1">By Performance | Last 30 Days</p>

            {items.length > 0 ? (
                <ul className="mt-4 space-y-2 flex-grow">
                    {items.map((item) => (
                        <li key={item.rank} className={`flex items-center p-3 rounded-lg transition-colors ${item.rank === 1 ? 'bg-green-500/10' : ''}`}>
                            <span className="font-bold text-gray-400 w-8 text-lg">#{item.rank}</span>
                            {item.rank === 1 && <TrophyIcon />}
                            <div className="ml-2 flex-grow min-w-0">
                                <p className="font-semibold text-gray-100 truncate" title={item.title}>{item.title}</p>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                                <span className="font-bold text-white text-lg">{item.value}</span>
                                <p className="text-xs text-gray-400">{item.valueLabel}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                     <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <p className="mt-2 font-semibold">Not enough data</p>
                        <p className="text-xs">Attempt at least 5 questions in a topic.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;