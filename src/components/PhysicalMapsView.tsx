import React, { useState, useRef } from 'react';
import { generateMapImage } from '../services/aiService';
import Loader from './Loader';
// FIX: Added missing import for ExamType
import { ExamType } from '../types';

interface PhysicalMapsViewProps {
    onGoBack?: () => void;
    activeExamType: ExamType;
}

const PhysicalMapsView: React.FC<PhysicalMapsViewProps> = ({ onGoBack, activeExamType }) => {
    const [mapPrompt, setMapPrompt] = useState('');
    const [isGeneratingMap, setIsGeneratingMap] = useState(false);
    const [generatedMapUrl, setGeneratedMapUrl] = useState<string | null>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const mapGenerationController = useRef<AbortController | null>(null);

    const handleGenerateMap = async () => {
        if (!mapPrompt.trim()) {
            setMapError("Please enter a location or feature for the map.");
            return;
        }
        if (mapGenerationController.current) {
            mapGenerationController.current.abort();
        }
        const controller = new AbortController();
        mapGenerationController.current = controller;

        setIsGeneratingMap(true);
        setMapError(null);
        setGeneratedMapUrl(null);

        try {
            const base64Data = await generateMapImage(mapPrompt, controller.signal);
            if (!controller.signal.aborted) {
                setGeneratedMapUrl(`data:image/png;base64,${base64Data}`);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setMapError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsGeneratingMap(false);
            }
        }
    };
    
    return (
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">AI Physical Maps</h1>
                    <p className="mt-2 text-lg text-gray-400">Instantly generate maps for geography, history, and general awareness.</p>
                </div>
                 {onGoBack && (
                    <button onClick={onGoBack} className="btn btn-secondary flex-shrink-0">
                        &larr; Back to Home
                    </button>
                )}
            </div>
             <div className="max-w-4xl mx-auto">
                <div className="p-8 bg-black/20 rounded-2xl shadow-lg border border-white/10">
                    <div className="flex flex-col sm:flex-row items-stretch gap-4">
                        <input
                            type="text"
                            value={mapPrompt}
                            onChange={(e) => setMapPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateMap()}
                            placeholder="e.g., 'Major rivers of South India'"
                            className="w-full p-4 bg-slate-900/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow"
                            disabled={isGeneratingMap}
                        />
                        <button
                            onClick={handleGenerateMap}
                            disabled={isGeneratingMap || !mapPrompt.trim()}
                            className="btn btn-primary text-lg"
                        >
                            {isGeneratingMap ? 'Generating...' : 'Generate Map'}
                        </button>
                    </div>
                    <div className="mt-8 min-h-[300px] flex items-center justify-center bg-black/20 rounded-xl border border-dashed border-white/10">
                        {isGeneratingMap && <Loader message="Creating your map, this may take a moment..." activeExamType={activeExamType} />}
                        {mapError && (
                            <div className="text-center p-4">
                                <p className="text-red-400 font-semibold">{mapError}</p>
                            </div>
                        )}
                        {generatedMapUrl && !isGeneratingMap && (
                            <div className="p-4 w-full">
                                <img src={generatedMapUrl} alt={mapPrompt} className="max-w-full max-h-[60vh] mx-auto rounded-lg object-contain" />
                            </div>
                        )}
                        {!isGeneratingMap && !mapError && !generatedMapUrl && (
                            <div className="text-center text-gray-500">
                                <p>Your generated map will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhysicalMapsView;