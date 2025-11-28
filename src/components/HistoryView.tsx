import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CoachFeedback, TestResult, TestTopic } from '../types';
import { generateCoachFeedback } from '../services/aiService';
import CoachModal from './CoachModal';

interface HistoryViewProps {
  history: TestResult[];
  testTopics: TestTopic[];
  onViewResult: (result: TestResult) => void;
  onStartGeneratedTest: (topicId: string) => void;
  onRetakeTest: (topicId: string) => void;
  onUpdateTopics: (updater: React.SetStateAction<TestTopic[]>) => void;
  onUpdateHistory: (updater: React.SetStateAction<TestResult[]>) => void;
  onCancelGeneration: (topicId: string) => void;
  onClearAllData: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, testTopics, onViewResult, onStartGeneratedTest, onRetakeTest, onUpdateTopics, onUpdateHistory, onCancelGeneration, onClearAllData }) => {
    const [isCoachLoading, setIsCoachLoading] = useState(false);
    const [coachFeedback, setCoachFeedback] = useState<CoachFeedback | null>(null);
    const [coachError, setCoachError] = useState<string | null>(null);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'topic' | 'history'; id: string | number; name: string } | null>(null);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);
    
    const generatedTests = useMemo(() => {
        const sorted = [...testTopics].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const completedTopicIds = new Set(
            history.filter(h => h.testTopicId).map(h => h.testTopicId)
        );

        return sorted.filter(t => {
            if (t.generationStatus === 'processing' || t.generationStatus === 'error') {
                return true;
            }
            if (t.generationStatus === 'completed') {
                return !completedTopicIds.has(t.id);
            }
            return false;
        });
    }, [testTopics, history]);

    const handleGetCoachFeedback = async () => {
        setIsCoachLoading(true);
        setCoachError(null);
        try {
            const feedback = await generateCoachFeedback(history);
            setCoachFeedback(feedback);
        } catch (err) {
            console.error(err);
            setCoachError((err as Error).message);
        } finally {
            setIsCoachLoading(false);
        }
    };
    
    const handleConfirmDelete = () => {
        if (!showDeleteConfirm) return;
        if (showDeleteConfirm.type === 'topic') {
            onUpdateTopics(prevTopics => prevTopics.filter(t => t.id !== showDeleteConfirm.id));
        } else if (showDeleteConfirm.type === 'history') {
            onUpdateHistory(prevHistory => prevHistory.filter(h => h.id !== showDeleteConfirm.id));
        }
        setShowDeleteConfirm(null);
    };

    const handleDeleteAllData = () => {
        onClearAllData();
        setIsDeleteAllModalOpen(false);
    };

    const getTopicIcon = (sourceType: TestTopic['sourceType']) => {
        switch (sourceType) {
            case 'pdf': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0011.586 2H4zm5 2.5a.5.5 0 01.5.5v2.5a.5.5 0 01-1 0V5a.5.5 0 01.5-.5zM8 8a.5.5 0 00-.5.5v4a.5.5 0 001 0V8.5A.5.5 0 008 8zm4 0a.5.5 0 00-.5.5v4a.5.5 0 001 0V8.5A.5.5 0 0012 8z" clipRule="evenodd" /></svg>;
            case 'syllabus': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>;
            case 'pyq': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3.293 11.707a1 1 0 001.414 0L10 11.414l1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414z" clipRule="evenodd" /></svg>;
            case 'mock': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2-2H4a2 2 0 01-2-2V5zm3 1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
            default: return null;
        }
    }
    
    const renderTopicItem = (topic: TestTopic) => {
        let displayName = topic.topicName;
        let displayDescription = topic.sourceDetails?.description || `PDF Topic`;
        if (topic.sourceType === 'syllabus' && topic.topicName === 'Combined Test' && topic.sourceDetails?.sourceTopics && Array.isArray(topic.sourceDetails.sourceTopics)) {
            displayName = topic.sourceDetails.sourceTopics.map(t => t.name).join(', ');
            displayDescription = `${topic.sourceDetails.sourceTopics.length} topics selected`;
        }

        return (
            <div key={topic.id} className="bg-black/20 p-4 rounded-xl border border-white/10 item-animated-entry">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">{getTopicIcon(topic.sourceType)}</div>
                        <div className="min-w-0">
                            <p className="font-bold text-white truncate" title={displayName}>{displayName}</p>
                            <p className="text-xs text-gray-400">{displayDescription}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 sm:w-auto w-full">
                        <div className="flex-grow sm:w-64">
                            {topic.generationStatus === 'processing' ? (
                                <div>
                                    {topic.generationSteps && typeof topic.currentStepIndex === 'number' ? (
                                        <ul className="generation-stepper">
                                            {topic.generationSteps.map((step, index) => {
                                                let status = 'pending';
                                                if (index < topic.currentStepIndex!) status = 'completed';
                                                if (index === topic.currentStepIndex) status = 'active';

                                                return (
                                                    <li key={index} className={`generation-step ${status}`}>
                                                        <div className="step-icon">
                                                            {status === 'completed' && <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                                        </div>
                                                        <span>{step}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                         <p className="text-xs text-purple-300 font-semibold mb-1 text-center">{topic.progressText || 'Processing...'}</p>
                                    )}
                                    <div className="futuristic-progress-container mt-2">
                                        <div className="futuristic-progress-track">
                                            <div 
                                                className="futuristic-progress-fill" 
                                                style={{ width: `${topic.generationProgress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ) : topic.generationStatus === 'completed' ? (
                                <div className="flex flex-col gap-2">
                                    <button onClick={() => onStartGeneratedTest(topic.id)} className="btn btn-primary w-full !py-2 !text-sm">Start Test</button>
                                </div>
                            ) : topic.generationStatus === 'error' ? (
                                <div className="text-red-400 text-sm font-semibold truncate" title={topic.generationError}>{topic.generationError || 'Error Occurred'}</div>
                            ) : null}
                        </div>
                        {topic.generationStatus === 'processing' && (
                             <button 
                                onClick={() => onCancelGeneration(topic.id)} 
                                className="p-2 text-gray-500 hover:text-red-500 rounded-full bg-slate-800/50 hover:bg-red-500/10 transition-colors flex-shrink-0"
                                aria-label="Cancel generation"
                                title="Cancel generation"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                         {topic.generationStatus !== 'processing' && (
                             <button onClick={() => setShowDeleteConfirm({ type: 'topic', id: topic.id, name: topic.topicName })} className="p-2 text-gray-500 hover:text-red-500 rounded-full" aria-label="Delete job"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                         )}
                    </div>
                </div>
            </div>
        );
    }
    
    const renderDeleteConfirmationModal = () => {
        if (!isDeleteAllModalOpen && !showDeleteConfirm || !modalRoot) return null;

        const isDeleteAll = isDeleteAllModalOpen;
        const confirmData = showDeleteConfirm;
        const name = isDeleteAll ? "all your test history and saved topics" : confirmData?.name;
        const title = isDeleteAll ? "Clear All Data" : "Confirm Deletion";

        const modalJsx = (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 modal-backdrop-animate" onClick={() => { setIsDeleteAllModalOpen(false); setShowDeleteConfirm(null); }}>
                <div className="bg-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 modal-content-animate" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-gray-300 mt-2">
                        Are you sure you want to delete <strong className="text-red-400 break-all">{name}</strong>? This action cannot be undone.
                    </p>
                    <div className="mt-8 flex justify-end gap-4">
                        <button onClick={() => { setIsDeleteAllModalOpen(false); setShowDeleteConfirm(null); }} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button onClick={isDeleteAll ? handleDeleteAllData : handleConfirmDelete} className="btn bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-600/30 hover:shadow-red-600/40">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
        return ReactDOM.createPortal(modalJsx, modalRoot);
    };

    if (history.length === 0 && testTopics.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <div className="max-w-md mx-auto">
                     <svg className="mx-auto h-24 w-24 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    <h2 className="mt-6 text-3xl font-extrabold text-white">No Tests Available</h2>
                    <p className="mt-4 text-lg text-gray-400">Generate a test from the syllabus or upload a document to get started. Your ready-to-take tests and completed history will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                 <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                    <h2 className="text-3xl font-extrabold text-white">My Tests</h2>
                    {history.length >= 2 && (
                        <button
                            onClick={handleGetCoachFeedback}
                            disabled={isCoachLoading}
                            className="inline-flex items-center gap-2 bg-white text-black font-semibold rounded-lg px-5 py-2.5 text-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0d0c15] disabled:opacity-60 disabled:cursor-wait"
                        >
                            {isCoachLoading ? 'Analyzing...' : 'Get AI Coach Analysis'}
                        </button>
                    )}
                </div>
                 {coachError && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl" role="alert">
                        {coachError}
                    </div>
                )}
                
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5 11a1 1 0 100 2h4a1 1 0 100-2H5z" />
                       </svg>
                        Generated Tests
                    </h3>
                    <div className="space-y-4">
                        {generatedTests.length > 0 ? generatedTests.map(renderTopicItem) : (
                            <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10">
                                <p className="text-gray-400">Tests you generate will appear here.</p>
                                <p className="text-sm text-gray-500 mt-1">They will move to "Completed Tests" after you take them.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-16">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2-2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h4a1 1 0 100-2H7zm0 4a1 1 0 100 2h4a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Completed Tests
                    </h3>
                    {history.length > 0 ? (
                        <div className="space-y-6">
                            {history.map((result) => {
                                const originalTopic = result.testTopicId ? testTopics.find(t => t.id === result.testTopicId) : null;
                                let displayName = result.topic.name;
                                let displayDescription = result.topic.unit;

                                if (originalTopic) {
                                    displayName = originalTopic.topicName;
                                    if (originalTopic.sourceType === 'syllabus' && originalTopic.topicName === 'Combined Test' && originalTopic.sourceDetails?.sourceTopics && Array.isArray(originalTopic.sourceDetails.sourceTopics)) {
                                        displayName = originalTopic.sourceDetails.sourceTopics.map(t => t.name).join(', ');
                                        displayDescription = `${originalTopic.sourceDetails.sourceTopics.length} topics selected`;
                                    } else if(originalTopic.sourceDetails?.description) {
                                         displayDescription = originalTopic.sourceDetails.description;
                                    }
                                }
                                
                                return (
                                    <div 
                                        key={result.id} 
                                        className="bg-black/20 rounded-2xl shadow-lg border border-white/10 overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-grow min-w-0">
                                                    <p className="text-xs text-gray-400">{new Date(result.date).toLocaleString()}</p>
                                                    <h3 className="text-xl font-bold text-white mt-1 truncate" title={displayName}>
                                                        {displayName}
                                                    </h3>
                                                    <p className="text-sm text-gray-300 truncate" title={displayDescription}>
                                                        {displayDescription}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <p className="text-sm font-semibold text-gray-400">Score</p>
                                                    <p className="text-4xl font-extrabold text-purple-400">{result.score.toFixed(0)}%</p>
                                                    <p className="text-xs text-gray-500">{result.correctCount}/{result.totalCount} correct</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-6 py-4 bg-black/30 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
                                            <button onClick={() => setShowDeleteConfirm({ type: 'history', id: result.id, name: `test on ${displayName}` })} className="btn btn-secondary !bg-red-500/10 !border-red-500/20 text-red-300 hover:!bg-red-500/20 hover:text-red-200 w-full sm:w-auto">Delete</button>
                                            <button onClick={() => onViewResult(result)} className="btn btn-secondary w-full sm:w-auto">View Details</button>
                                            {result.testTopicId && testTopics.some(t => t.id === result.testTopicId) && (
                                                <button onClick={() => onRetakeTest(result.testTopicId!)} className="btn btn-primary w-full sm:w-auto">Retake Test</button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="text-center py-8 bg-black/20 rounded-xl border border-dashed border-white/10">
                            <p className="text-gray-400">You haven't completed any tests yet.</p>
                        </div>
                    )}
                </div>
                
                 {/* Data Management Section */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Data Management</h3>
                    <div className="bg-red-900/20 p-6 rounded-xl border border-red-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h4 className="font-semibold text-red-300">Clear All My Data</h4>
                            <p className="text-sm text-gray-400 mt-1">This will permanently delete all your test history and saved topics. This action cannot be undone.</p>
                        </div>
                        <button
                            onClick={() => setIsDeleteAllModalOpen(true)}
                            className="btn bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-600/30 hover:shadow-red-600/40 flex-shrink-0"
                        >
                            Delete Data
                        </button>
                    </div>
                </div>

            </div>
             {coachFeedback && (
                <CoachModal feedback={coachFeedback} onClose={() => setCoachFeedback(null)} />
            )}
            {renderDeleteConfirmationModal()}
        </div>
    );
};

export default HistoryView;
