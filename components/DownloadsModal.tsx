import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TestResult, TestTopic } from '../types';

interface DownloadsViewProps {
  history: TestResult[];
  testTopics: TestTopic[];
  onDownloadPdf: (result: TestResult) => void;
  onGoBack: () => void;
}

const DownloadsView: React.FC<DownloadsViewProps> = ({ history, testTopics, onDownloadPdf, onGoBack }) => {
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [history]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const scrollAmount = event.deltaY;
        
        if (scrollAmount > 0) { // Scrolling down/right
            setActiveIndex(prev => Math.min(prev + 1, sortedHistory.length - 1));
        } else if (scrollAmount < 0) { // Scrolling up/left
            setActiveIndex(prev => Math.max(0, prev - 1));
        }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
        if (container) {
          container.removeEventListener('wheel', handleWheel);
        }
    };
  }, [sortedHistory.length]);

  const handleCardClick = (item: TestResult) => {
    onDownloadPdf(item);
  };
  
  const renderContent = () => {
    if (sortedHistory.length === 0) {
      return (
        <div className="text-center py-16">
          <svg className="mx-auto h-20 w-20 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          <h3 className="mt-6 text-xl font-bold text-white">No Tests Completed Yet</h3>
          <p className="text-gray-400 mt-2">Once you complete a test, you'll find it here ready to download.</p>
        </div>
      );
    }

    return (
        <div ref={containerRef} className="relative flex items-center justify-center min-h-[70vh] py-16 cursor-grab" style={{ perspective: '1500px' }}>
            <div 
              className="relative w-[400px] h-[250px]" 
              style={{ transformStyle: 'preserve-3d' }}
            >
              {sortedHistory.map((item, index) => {
                const relativeIndex = index - activeIndex;
                const isVisible = relativeIndex >= 0 && relativeIndex < 7;
                
                const x = isVisible ? relativeIndex * 60 : (relativeIndex < 0 ? -400 : 400);
                const y = isVisible ? relativeIndex * -40 : 100;
                const z = isVisible ? relativeIndex * -80 : -500;
                const scale = isVisible ? 1 - relativeIndex * 0.05 : 0.8;
                const opacity = isVisible ? 1 - (relativeIndex / 8) : 0;
                const zIndex = sortedHistory.length - Math.abs(relativeIndex);

                const isHovered = hoveredCardId === item.id;
                const hoverY = isHovered && relativeIndex === 0 ? y - 20 : y;
                const hoverScale = isHovered && relativeIndex === 0 ? scale * 1.05 : scale;

                const transform = `translate3d(${x}px, ${hoverY}px, ${z}px) scale(${hoverScale})`;

                const originalTopic = item.testTopicId ? testTopics.find(t => t.id === item.testTopicId) : null;
                let displayName = item.topic.name;

                if (originalTopic) {
                    if (originalTopic.sourceType === 'syllabus' && originalTopic.topicName === 'Combined Test' && originalTopic.sourceDetails?.sourceTopics && Array.isArray(originalTopic.sourceDetails.sourceTopics)) {
                        displayName = `${originalTopic.sourceDetails.sourceTopics.length} Topics`;
                    } else {
                        displayName = originalTopic.topicName;
                    }
                }
                
                const cardDate = new Date(item.date);
                const timeString = cardDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredCardId(item.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className="absolute w-[400px] h-[250px] p-6 rounded-2xl border border-purple-300/20 bg-purple-500/10 backdrop-blur-md"
                    style={{
                      transform,
                      opacity,
                      zIndex,
                      transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.5s ease-out',
                      cursor: relativeIndex === 0 ? 'pointer' : 'default',
                      boxShadow: isHovered && relativeIndex === 0
                        ? '0 35px 60px -15px rgba(168, 85, 247, 0.3)'
                        : '0 25px 50px -12px rgba(0,0,0,0.6)',
                    }}
                    onClick={() => relativeIndex === 0 && handleCardClick(item)}
                  >
                     <div className="flex flex-col h-full relative text-white">
                        {/* Top Section */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-4xl font-bold">
                                    {String(index + 1).padStart(2, '0')}
                                </h3>
                                <p className="text-sm text-purple-300/80">({timeString})</p>
                            </div>
                            {/* Show hint only on the active card */}
                            {relativeIndex === 0 && (
                                <p className="font-semibold text-purple-300 flex-shrink-0 animate-pulse">
                                    Click to Download
                                </p>
                            )}
                        </div>

                        {/* Middle Section (Topic Name) - This will grow and center the topic */}
                        <div className="flex-grow flex items-center">
                            <p className="text-lg text-purple-200 font-semibold" title={displayName}>
                                {displayName}
                            </p>
                        </div>

                        {/* Bottom Section */}
                        <div>
                            <p className="text-xs text-gray-400">Score</p>
                            <p className="text-4xl font-bold text-white">{item.score.toFixed(0)}<span className="text-2xl">%</span></p>
                        </div>

                        {/* Background Number */}
                        <div className="absolute bottom-0 right-0 text-9xl font-black text-white/10 tracking-tighter select-none pointer-events-none">
                            {String(index + 1).padStart(2, '0')}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
    );
  };

  return (
    <div className="page-transition-wrapper">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">Download Test PDFs</h1>
                    <p className="mt-2 text-lg text-gray-400">Save your completed tests for offline practice.</p>
                </div>
                <button onClick={onGoBack} className="btn btn-secondary">
                    &larr; Back to Dashboard
                </button>
            </div>
            
            <div className="max-w-7xl mx-auto">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default DownloadsView;