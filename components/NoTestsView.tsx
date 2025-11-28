import React from 'react';

interface NoTestsViewProps {
    onGoBack: () => void;
}

const NoTestsView: React.FC<NoTestsViewProps> = ({ onGoBack }) => {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-250px)] px-4 text-center item-animated-entry">
            <div className="max-w-md mx-auto">
                <div className="w-32 h-32 mx-auto rounded-full bg-white/5 flex items-center justify-center border-2 border-dashed border-white/10 mb-8 backdrop-blur-sm">
                     <svg className="w-16 h-16 text-purple-400/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    No Tests This Week
                </h2>
                <p className="mt-4 text-lg text-gray-400">
                    You haven't completed any tests in the last 7 days.
                    <br />
                    Take a test to start tracking your weekly progress here.
                </p>
                <div className="mt-8">
                    <button onClick={onGoBack} className="btn btn-secondary">
                        &larr; Back to History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoTestsView;