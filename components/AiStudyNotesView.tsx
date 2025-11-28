import React, { useState, useCallback, useRef } from 'react';
import { SyllabusUnit, Topic, StudyNotes } from '../types';
import { generateStudyNotes } from '../services/aiService';
import StudyNotesModal from './StudyNotesModal';

interface AiStudyNotesViewProps {
    syllabus: SyllabusUnit[];
    onGoBack?: () => void;
}

const AiStudyNotesView: React.FC<AiStudyNotesViewProps> = ({ syllabus, onGoBack }) => {
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [notesData, setNotesData] = useState<StudyNotes | null>(null);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);
    const [notesError, setNotesError] = useState<string | null>(null);
    const [activeTopicForNotes, setActiveTopicForNotes] = useState<Topic | null>(null);
    const notesGenerationController = useRef<AbortController | null>(null);
    const [expandedUnitId, setExpandedUnitId] = useState<string | null>(syllabus.length > 0 ? syllabus[0].id : null);

    const handleGenerateNotes = useCallback(async (topic: Topic) => {
        if (notesGenerationController.current) {
            notesGenerationController.current.abort();
        }
        const controller = new AbortController();
        notesGenerationController.current = controller;

        setActiveTopicForNotes(topic);
        setIsNotesModalOpen(true);
        setIsLoadingNotes(true);
        setNotesError(null);
        setNotesData(null);

        try {
            const notes = await generateStudyNotes(topic, controller.signal);
            if (!controller.signal.aborted) {
                setNotesData(notes);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setNotesError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) {
                setIsLoadingNotes(false);
            }
        }
    }, []);

    const handleCloseNotesModal = () => {
        if (notesGenerationController.current) {
            notesGenerationController.current.abort();
        }
        setIsNotesModalOpen(false);
        setActiveTopicForNotes(null);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">AI Study Notes</h1>
                    <p className="mt-2 text-lg text-gray-400">Generate comprehensive study material for any syllabus topic.</p>
                </div>
                 {onGoBack && (
                    <button onClick={onGoBack} className="btn btn-secondary flex-shrink-0 self-start sm:self-center">
                        &larr; Back to Home
                    </button>
                )}
            </div>

            <div className="max-w-4xl mx-auto">
                {syllabus.length > 0 ? (
                    <div className="space-y-4">
                        {syllabus.map((unit) => (
                            <div key={unit.id} className="bg-black/20 border border-white/10 rounded-2xl transition-all duration-300">
                                <button 
                                    className="w-full p-6 text-left"
                                    onClick={() => setExpandedUnitId(expandedUnitId === unit.id ? null : unit.id)}
                                    aria-expanded={expandedUnitId === unit.id}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white">{unit.title}</h3>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${expandedUnitId === unit.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </button>
                                
                                <div className={`grid transition-all duration-500 ease-in-out ${expandedUnitId === unit.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-6 pt-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {unit.topics.map((topic, index) => (
                                                    <button
                                                        key={`${topic.unit}-${index}`}
                                                        onClick={() => handleGenerateNotes(topic)}
                                                        className="text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/70 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    >
                                                        <span className="font-semibold text-gray-200">{topic.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-400">No syllabus is currently active. Please select an exam and topic from the home page.</p>
                    </div>
                )}
            </div>
            
            <StudyNotesModal
                isOpen={isNotesModalOpen}
                isLoading={isLoadingNotes}
                error={notesError}
                notes={notesData}
                onClose={handleCloseNotesModal}
                onRetry={() => activeTopicForNotes && handleGenerateNotes(activeTopicForNotes)}
            />
        </div>
    );
};

export default AiStudyNotesView;