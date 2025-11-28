
import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { TestTopic, Question, ExamType, TestResult } from '../types';
import { renderTextWithMarkdown } from './utils';
import SearchBar from './SearchBar';

const getTopicIcon = (sourceType: TestTopic['sourceType']) => {
    switch (sourceType) {
        case 'pdf': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0011.586 2H4zm5 2.5a.5.5 0 01.5.5v2.5a.5.5 0 01-1 0V5a.5.5 0 01.5-.5zM8 8a.5.5 0 00-.5.5v4a.5.5 0 001 0V8.5A.5.5 0 008 8zm4 0a.5.5 0 00-.5.5v4a.5.5 0 001 0V8.5A.5.5 0 0012 8z" clipRule="evenodd" /></svg>;
        case 'syllabus': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>;
        case 'pyq': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3.293 11.707a1 1 0 001.414 0L10 11.414l1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 000 1.414z" clipRule="evenodd" /></svg>;
        case 'mock': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2-2H4a2 2 0 01-2-2V5zm3 1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" clipRule="evenodd" /></svg>;
        default: return null;
    }
};

const EXAM_ICONS: { [key in ExamType]: React.ReactNode } = {
    'TNPSC': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v4.59L6.71 11H4v9h16v-9h-2.71L13 6.59V2h-2zm-2 16H7v-5h2v5zm4 0h-2v-5h2v5zm4 0h-2v-5h2v5zM12 8.69l2.13 3.31H9.87L12 8.69z"/></svg>,
    'Bank Exam': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v2h20V7L12 2zM5.947 8L12 4.236 18.053 8H5.947zM19 19H5v-8h14v8z"/><path d="M7 13h2v4H7zm4 0h2v4h-2zm4 0h2v4h-2z"/></svg>,
    'Railway': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4.42 0-8 3.13-8 7v7c0 1.65 1.35 3 3 3h1.34c-.21.65-.21 1.39 0 2.04.28.87 1.09 1.46 2.06 1.46s1.78-.59 2.06-1.46c.21-.65.21-1.39 0-2.04H15c1.65 0 3-1.35 3-3v-7c0-3.87-3.58-7-8-7zm-1.5 15c-.83 0-1.5-.67-1.5-1.5S9.67 14 10.5 14s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 14H6V9h12v5z" /></svg>,
    'SSC': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9v12h16V9L12 3zm0 2.236L17.535 9H6.465L12 5.236zM6 19v-8h2v8H6zm4 0v-8h4v8h-4zm6 0v-8h2v8h-2z"/></svg>,
};

interface QuestionCollection {
    id: string;
    topicName: string;
    examType: ExamType;
    sectionName: string;
    sourceType: TestTopic['sourceType'];
    questions: Question[];
    count: number;
}

interface StorageViewProps {
    testTopics: TestTopic[];
    onGoBack: () => void;
    onDownloadPdf: (result: TestResult, options?: { showScore?: boolean }) => void;
}

const StorageView: React.FC<StorageViewProps> = ({ testTopics, onGoBack, onDownloadPdf }) => {
    const [selectedCollection, setSelectedCollection] = useState<QuestionCollection | null>(null);
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [isCollecting, setIsCollecting] = useState(false);
    const [collection, setCollection] = useState<Map<string, Question>>(new Map());
    const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
    const [collectionName, setCollectionName] = useState('Custom Question Paper');
    const [isCollectionBarVisible, setIsCollectionBarVisible] = useState(false);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    useEffect(() => {
        if (isCollecting && collection.size > 0) {
            setIsCollectionBarVisible(true);
        } else {
            setIsCollectionBarVisible(false);
        }
    }, [isCollecting, collection.size]);

    const handleToggleCollecting = () => {
        if (isCollecting) {
            if (collection.size > 0) {
                setIsFinalizeModalOpen(true);
            } else {
                setIsCollecting(false);
            }
        } else {
            setIsCollecting(true);
            setCollection(new Map());
        }
    };
    
    const handleAddToCollection = (question: Question) => setCollection(prev => new Map(prev).set(question.questionText, question));
    const handleRemoveFromCollection = (question: Question) => setCollection(prev => { const newMap = new Map(prev); newMap.delete(question.questionText); return newMap; });
    const handleAddAllToCollection = (questions: Question[]) => setCollection(prev => { const newMap = new Map(prev); questions.forEach(q => newMap.set(q.questionText, q)); return newMap; });

    const handleDownloadCollection = () => {
        if (collection.size === 0) return;
        // FIX: Explicitly type `questions` as Question[] to fix type inference issue.
        const questions: Question[] = Array.from(collection.values());
        const uniqueExamTypes = Array.from(new Set(questions.map(q => {
            const topic = testTopics.find(t => t.generatedQuestions?.some(gq => gq.questionText === q.questionText));
            return topic?.examType;
        }).filter(Boolean)));

        const dummyResult: TestResult = {
            id: Date.now(),
            date: new Date().toISOString(),
            topic: { name: collectionName, unit: "Custom Collection" },
            examType: uniqueExamTypes.length === 1 ? uniqueExamTypes[0]! : 'Mixed',
            questions: questions,
            score: 0, totalCount: questions.length, userAnswers: [], bookmarks: [],
            correctCount: 0, incorrectCount: 0, marks: 0, totalMarks: 0, difficulty: 'Mixed',
        };
        onDownloadPdf(dummyResult, { showScore: false });
        
        setIsFinalizeModalOpen(false);
        setIsCollecting(false);
        setCollection(new Map());
    };

    const questionCollections = useMemo(() => {
        const completed = testTopics.filter(t => t.generationStatus === 'completed' && t.generatedQuestions && t.generatedQuestions.length > 0);
        const collectionMap = new Map<string, QuestionCollection>();

        completed.forEach(topic => {
            if (topic.sourceType === 'syllabus' && topic.sourceDetails?.sourceTopics) {
                (topic.generatedQuestions || []).forEach(question => {
                    const topicName = question.questionSubtype || question.section || 'Uncategorized';
                    const sectionName = question.section || 'Uncategorized';
                    
                    if(topicName === 'Uncategorized' || sectionName === 'Uncategorized') return;

                    const mergeKey = `syllabus-${topic.examType}-${sectionName}-${topicName}`;
                    const existing = collectionMap.get(mergeKey);

                    if (existing) {
                        const existingQuestionTexts = new Set(existing.questions.map(q => q.questionText));
                        if (!existingQuestionTexts.has(question.questionText)) {
                            existing.questions.push(question);
                            existing.count = existing.questions.length;
                        }
                    } else {
                        collectionMap.set(mergeKey, {
                            id: mergeKey, topicName, examType: topic.examType, sectionName, sourceType: 'syllabus', questions: [question], count: 1,
                        });
                    }
                });
            } else {
                const sectionName = topic.sourceType === 'mock' ? 'Full Mock Tests' : topic.sourceType === 'pyq' ? 'Previous Year Questions' : 'Custom PDF Topics';
                collectionMap.set(topic.id, {
                    id: topic.id, topicName: topic.topicName, examType: topic.examType, sectionName, sourceType: topic.sourceType,
                    questions: [...(topic.generatedQuestions || [])], count: topic.generatedQuestions?.length || 0,
                });
            }
        });
        
        return Array.from(collectionMap.values());
    }, [testTopics]);

    const groupedAndFilteredTopics = useMemo(() => {
        const grouped: { [exam in ExamType]?: { [section: string]: QuestionCollection[] } } = {};
        const lowercasedSearch = searchTerm.toLowerCase();

        const filtered = questionCollections.filter(c => 
            c.topicName.toLowerCase().includes(lowercasedSearch) || c.examType.toLowerCase().includes(lowercasedSearch) || c.sectionName.toLowerCase().includes(lowercasedSearch)
        );

        for (const collection of filtered) {
            if (!grouped[collection.examType]) grouped[collection.examType] = {};
            if (!grouped[collection.examType]![collection.sectionName]) grouped[collection.examType]![collection.sectionName] = [];
            grouped[collection.examType]![collection.sectionName].push(collection);
        }
        return grouped;
    }, [questionCollections, searchTerm]);

    const toggleExpand = (key: string) => setExpandedKeys(prev => { const newSet = new Set(prev); newSet.has(key) ? newSet.delete(key) : newSet.add(key); return newSet; });

    if (selectedCollection) {
        let lastRenderedContext: string | null = null;
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 page-transition-wrapper">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white">{selectedCollection.topicName}</h2>
                            <p className="text-gray-400 mt-1">{selectedCollection.count} questions</p>
                        </div>
                        <button onClick={() => setSelectedCollection(null)} className="btn btn-secondary">← Back to Bank</button>
                    </div>

                    <div className="space-y-8">
                        {/* FIX: Explicitly type 'question' as Question to fix type inference issue. */}
                        {selectedCollection.questions?.map((question: Question, index) => {
                             const shouldRenderContext = question.commonContext && question.commonContext !== lastRenderedContext;
                             if (shouldRenderContext) lastRenderedContext = question.commonContext!;
                             const isInCollection = collection.has(question.questionText);
                            return (
                                <div key={index}>
                                    {shouldRenderContext && (
                                        <div className="p-6 mb-6 bg-black/20 rounded-2xl border border-white/10 shadow-sm">
                                            <h4 className="text-md font-bold text-gray-300 mb-3">Common Context:</h4>
                                            {question.commonContextDiagramSvg && (<div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: question.commonContextDiagramSvg }} />)}
                                            <div className="text-gray-300 prose prose-sm prose-invert max-w-none">{renderTextWithMarkdown(question.commonContext)}</div>
                                        </div>
                                    )}
                                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 relative">
                                        {isCollecting && (
                                            <button 
                                                onClick={() => isInCollection ? handleRemoveFromCollection(question) : handleAddToCollection(question)} 
                                                className={`collection-add-btn ${isInCollection ? 'added' : ''}`}
                                                aria-label={isInCollection ? 'Remove from collection' : 'Add to collection'}
                                            >
                                                {isInCollection ? <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>}
                                            </button>
                                        )}
                                        <h3 className="text-lg font-bold text-white mb-4">Question {index + 1}</h3>
                                        <div className="font-semibold text-gray-200 mb-4">{renderTextWithMarkdown(question.questionText)}</div>
                                        <div className="space-y-2">
                                            {Object.entries(question.options).map(([key, value]) => (<div key={key} className={`p-3 rounded-lg flex items-start gap-3 border ${question.correctOption === key ? 'bg-green-500/10 text-green-200 border-green-500/30' : 'bg-black/20 text-gray-400 border-transparent'}`}><span className="font-bold text-sm">{key}.</span><span className="text-base flex-grow">{renderTextWithMarkdown(value as string)}</span></div>))}
                                        </div>
                                        <div className="mt-6 p-4 rounded-lg bg-purple-500/10">
                                            <h5 className="font-bold text-white mb-2">Explanation</h5>
                                            {question.explanationDiagramSvg && (<div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: question.explanationDiagramSvg }} />)}
                                            <div className="prose prose-sm prose-invert max-w-none text-gray-300">{renderTextWithMarkdown(question.explanation)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 page-transition-wrapper">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">Question Bank</h1>
                    <p className="mt-2 text-lg text-gray-400">Browse all sets of questions generated by the AI.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleToggleCollecting} className={`btn ${isCollecting ? 'bg-green-600 hover:bg-green-700' : 'btn-secondary'}`}>
                        {isCollecting ? `Finalize Collection (${collection.size})` : 'Start Collecting'}
                    </button>
                    <button onClick={onGoBack} className="btn btn-secondary flex-shrink-0">
                        &larr; Back to Home
                    </button>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto mb-8">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by exam, topic, or test name..."/>
            </div>

            {Object.keys(groupedAndFilteredTopics).length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-4">
                    {Object.entries(groupedAndFilteredTopics).map(([exam, sections]) => (
                        <div key={exam} className="bg-black/20 border border-white/10 rounded-2xl transition-all duration-300">
                            <button onClick={() => toggleExpand(exam)} aria-expanded={expandedKeys.has(exam)} className="w-full p-6 text-left flex justify-between items-center">
                                <div className="flex items-center gap-4"><div className="text-purple-400">{EXAM_ICONS[exam as ExamType]}</div><h2 className="text-2xl font-bold text-white">{exam}</h2></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${expandedKeys.has(exam) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                             <div className={`grid transition-all duration-500 ease-in-out ${expandedKeys.has(exam) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="px-6 pb-6 pt-2 space-y-3">
                                        {Object.entries(sections).map(([sectionName, collections]) => (
                                            <div key={sectionName} className="bg-slate-800/50 rounded-xl">
                                                <button onClick={() => toggleExpand(`${exam}-${sectionName}`)} aria-expanded={expandedKeys.has(`${exam}-${sectionName}`)} className="w-full p-4 text-left flex justify-between items-center">
                                                    <h3 className="font-semibold text-gray-200">{sectionName}</h3>
                                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${expandedKeys.has(`${exam}-${sectionName}`) ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                </button>
                                                <div className={`grid transition-all duration-300 ease-in-out ${expandedKeys.has(`${exam}-${sectionName}`) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                                     <div className="overflow-hidden">
                                                        <div className="px-4 pb-4 space-y-2">
                                                            {collections.map(collection => (
                                                                <div key={collection.id} className="bg-slate-900/70 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                                                    <div className="min-w-0 flex items-center gap-3"><div className="flex-shrink-0">{getTopicIcon(collection.sourceType)}</div><div><p className="font-bold text-white truncate" title={collection.topicName}>{collection.topicName}</p><p className="text-xs text-gray-400 mt-1">{collection.count} Qs</p></div></div>
                                                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                                                        {isCollecting && <button onClick={() => handleAddAllToCollection(collection.questions)} className="btn btn-secondary !py-2 !px-4 text-sm w-full sm:w-auto flex-shrink-0">Add All</button>}
                                                                        <button onClick={() => setSelectedCollection(collection)} className="btn btn-secondary !py-2 !px-4 text-sm w-full sm:w-auto flex-shrink-0">View</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                     </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-black/20 rounded-2xl border border-dashed border-white/10"><p className="text-lg text-gray-400">{searchTerm ? "No question sets match your search." : "No question sets have been generated yet."}</p><p className="text-sm text-gray-500 mt-2">{searchTerm ? "Try a different search term." : "Create a test from the syllabus or a PDF to get started."}</p></div>
            )}

            {isCollectionBarVisible && (
                <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 collection-bar-enter">
                    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-4 flex justify-between items-center border border-white/10">
                        <p className="font-semibold text-white">Collecting: <span className="text-purple-300">{collection.size}</span> question{collection.size !== 1 ? 's' : ''}</p>
                        <button onClick={() => setIsFinalizeModalOpen(true)} className="btn btn-primary shadow-lg !py-2">Finalize</button>
                    </div>
                </div>
            )}

            {isFinalizeModalOpen && modalRoot && ReactDOM.createPortal(
                 <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 modal-backdrop-animate" onClick={() => setIsFinalizeModalOpen(false)}>
                    <div className="bg-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 modal-content-animate" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white">Finalize Collection</h3>
                        <p className="text-gray-300 mt-2">You have selected <strong className="text-purple-300">{collection.size}</strong> questions.</p>
                        <div className="mt-6">
                            <label htmlFor="collection-name" className="block text-sm font-semibold text-gray-300 mb-2">Collection Title (for PDF)</label>
                            <input id="collection-name" type="text" value={collectionName} onChange={e => setCollectionName(e.target.value)} className="w-full p-3 bg-slate-900/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                        </div>
                        <div className="mt-8 flex justify-end gap-4">
                            <button onClick={() => setIsFinalizeModalOpen(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleDownloadCollection} className="btn btn-primary">Download as PDF</button>
                        </div>
                    </div>
                </div>,
                modalRoot
            )}
        </div>
    );
};

export default StorageView;
