import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { TestTopic } from '../types';
import * as dbService from '../services/dbService';
import { extractTextFromPDF } from '../services/aiService';
import Loader from './Loader';

interface ExtractedText {
    topicId: string;
    topicName: string;
    text: string;
    createdAt: string;
}

interface TextExtractionsViewProps {
  onGoBack: () => void;
}

const TextExtractionsView: React.FC<TextExtractionsViewProps> = ({ onGoBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([]);
  const [selectedText, setSelectedText] = useState<ExtractedText | null>(null);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    const fetchAndExtractTexts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const topics = await dbService.getTestTopics();
            const pdfTopics = topics.filter(t => t.sourceType === 'pdf' && t.files && t.files.length > 0 && !t.sourceDetails?.sourcePdfTopicId);
            
            if (pdfTopics.length === 0) {
                setIsLoading(false);
                return;
            }

            const extractions: ExtractedText[] = [];
            for (const topic of pdfTopics) {
                let combinedText = '';
                const pdfFiles = topic.files?.filter(f => f.mimeType === 'application/pdf' || f.fileName.toLowerCase().endsWith('.pdf')) || [];
                
                for (const file of pdfFiles) {
                    if (file.fileContentBase64) {
                        try {
                            const text = await extractTextFromPDF(file.fileContentBase64);
                            combinedText += `--- START OF FILE: ${file.fileName} ---\n\n${text}\n\n--- END OF FILE: ${file.fileName} ---\n\n`;
                        } catch (e) {
                            console.error(`Failed to extract text from ${file.fileName}:`, e);
                            combinedText += `--- ERROR EXTRACTING FROM: ${file.fileName} ---\n\n`;
                        }
                    }
                }
                if (combinedText.trim()) {
                    extractions.push({
                        topicId: topic.id,
                        topicName: topic.topicName,
                        text: combinedText.trim(),
                        createdAt: topic.createdAt,
                    });
                }
            }
            setExtractedTexts(extractions);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load document data.");
        } finally {
            setIsLoading(false);
        }
    };
  
    fetchAndExtractTexts();
  }, []);

  const sortedTexts = useMemo(() => {
    return [...extractedTexts].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [extractedTexts]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const scrollAmount = event.deltaY;
        
        if (scrollAmount > 0) { // Scrolling down/right
            setActiveIndex(prev => Math.min(prev + 1, sortedTexts.length - 1));
        } else if (scrollAmount < 0) { // Scrolling up/left
            setActiveIndex(prev => Math.max(0, prev - 1));
        }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
        container.removeEventListener('wheel', handleWheel);
    };
  }, [sortedTexts.length]);


  const handleCardClick = (item: ExtractedText) => {
    setSelectedText(item);
  };
  
  const handleCloseDetailView = () => {
    setSelectedText(null);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="py-24"><Loader message="Extracting text from your documents..." activeExamType="TNPSC" /></div>;
    }
    if (error) {
      return <div className="text-center py-24 text-red-400">{error}</div>;
    }
    if (extractedTexts.length === 0) {
      return (
        <div className="text-center py-16">
          <svg className="mx-auto h-20 w-20 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <h3 className="mt-6 text-xl font-bold text-white">No PDF Documents Found</h3>
          <p className="text-gray-400 mt-2">Go to the "Upload Files" tab to add your study materials.</p>
        </div>
      );
    }

    return (
        <div ref={containerRef} className="relative flex items-center justify-center min-h-[70vh] py-16 cursor-grab" style={{ perspective: '1500px' }}>
            <div 
              className="relative w-[400px] h-[250px]" 
              style={{ transformStyle: 'preserve-3d' }}
            >
              {sortedTexts.map((item, index) => {
                const relativeIndex = index - activeIndex;
                const isVisible = relativeIndex >= 0 && relativeIndex < 7; // Show active and next few cards
                
                const x = isVisible ? relativeIndex * 60 : (relativeIndex < 0 ? -400 : 400);
                const y = isVisible ? relativeIndex * -40 : 100;
                const z = isVisible ? relativeIndex * -80 : -500;
                const scale = isVisible ? 1 - relativeIndex * 0.05 : 0.8;
                const opacity = isVisible ? 1 - (relativeIndex / 8) : 0;
                const zIndex = sortedTexts.length - Math.abs(relativeIndex);

                const isHovered = hoveredCardId === item.topicId;
                const hoverY = isHovered && relativeIndex === 0 ? y - 20 : y;
                const hoverScale = isHovered && relativeIndex === 0 ? scale * 1.05 : scale;

                const transform = `translate3d(${x}px, ${hoverY}px, ${z}px) scale(${hoverScale})`;

                const cardDate = new Date(item.createdAt);
                const timeString = cardDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

                return (
                  <div
                    key={item.topicId}
                    onMouseEnter={() => setHoveredCardId(item.topicId)}
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
                    <div className="flex flex-col h-full justify-between relative text-white">
                      <div>
                        <h3 className="text-4xl font-bold">
                            {String(index + 1).padStart(2, '0')}
                        </h3>
                         <p className="text-sm text-purple-300/80">({timeString})</p>
                        <p className="text-lg text-purple-200 mt-4 font-semibold">
                            View Extracted Content
                        </p>
                      </div>
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
  
  if (selectedText && modalRoot) {
    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4 modal-backdrop-animate"
            onClick={handleCloseDetailView}
        >
            <div 
                className="bg-[#13111c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col modal-content-animate"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">{selectedText.topicName}</h2>
                    <button onClick={handleCloseDetailView} className="text-gray-400 hover:text-white" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                 <main className="p-6 overflow-y-auto">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans bg-black/30 p-4 rounded-lg">
                        {selectedText.text}
                    </pre>
                 </main>
            </div>
        </div>,
        modalRoot
    );
  }

  return (
    <div className="page-transition-wrapper">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">Text Extractions</h1>
                    <p className="mt-2 text-lg text-gray-400">Review the raw text content from your uploaded PDFs.</p>
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

export default TextExtractionsView;