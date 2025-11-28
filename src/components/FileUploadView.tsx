import React, { useState, useMemo, useRef, DragEvent, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Difficulty, ExamType, FileInfo, TestTopic, TestMode, SyllabusUnit, Topic, TopicQuestion } from '../types';
import { generateSampleQuestionForTopic } from '../services/aiService';
import Loader from './Loader';
import { renderTextWithMarkdown } from './utils';

interface FileUploadViewProps {
    testTopics: TestTopic[];
    allTopicNames: string[];
    onUpdateTopics: (updater: React.SetStateAction<TestTopic[]>) => void;
    onStartGeneration: (topicId: string, numQuestions: number, difficulty: Difficulty, mode: TestMode) => void;
    activeExamType: ExamType;
    onGoBack?: () => void;
    syllabus: SyllabusUnit[];
}

const fileUploadDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];

const FileUploadFolderIcon = ({ count }: { count: number }) => (
    <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        {count > 0 && (
            <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white ring-2 ring-[#13111c]">
                {count > 9 ? '9+' : count}
            </span>
        )}
    </div>
);


const FileUploadView: React.FC<FileUploadViewProps> = ({ testTopics, allTopicNames, onUpdateTopics, onStartGeneration, activeExamType, onGoBack, syllabus }) => {
    const [newTopicName, setNewTopicName] = useState('');
    const [topicCreationError, setTopicCreationError] = useState<string | null>(null);
    const [folderUploadError, setFolderUploadError] = useState<string | null>(null);
    const [topicToConfigureId, setTopicToConfigureId] = useState<string | null>(null);
    const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
    const [editingTopicName, setEditingTopicName] = useState('');
    const [draggedOverTopicId, setDraggedOverTopicId] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<{ topicId: string, message: string } | null>(null);
    const [topicIdForUpload, setTopicIdForUpload] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const multiFileInputRef = useRef<HTMLInputElement>(null);
    const [numQuestions, setNumQuestions] = useState(10);
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [mode, setMode] = useState<TestMode>('test');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'topic' | 'file'; topicId: string; fileId?: string; name: string } | null>(null);
    const [isConfigModalClosing, setIsConfigModalClosing] = useState(false);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    
    const [sampleQuestions, setSampleQuestions] = useState<TopicQuestion[]>([]);
    const [isLoadingSamples, setIsLoadingSamples] = useState(false);
    const [errorSamples, setErrorSamples] = useState<string | null>(null);
    const sampleGenerationController = useRef<AbortController | null>(null);
    
    useEffect(() => { setModalRoot(document.getElementById('modal-root')); }, []);

    // FIX: Added card hover animation handlers.
    const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const { width, height } = rect;

        const rotateX = (y / height - 0.5) * -10;
        const rotateY = (x / width - 0.5) * 10;

        const glowX = (x / width) * 100;
        const glowY = (y / height) * 100;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
    };

    const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const handleCreateTopic = () => {
        setFolderUploadError(null);
        const trimmedName = newTopicName.trim();
        if (!trimmedName) {
            setTopicCreationError('Topic name cannot be empty.');
            return;
        }
        if (allTopicNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            setTopicCreationError('A topic with this name already exists.');
            return;
        }
        setTopicCreationError(null);
        const newTopic: TestTopic = {
            id: `topic_${Date.now()}`,
            topicName: trimmedName,
            files: [],
            generationStatus: 'idle',
            sourceType: 'pdf',
            createdAt: new Date().toISOString(),
            examType: activeExamType,
        };
        onUpdateTopics(prev => [newTopic, ...prev].sort((a,b) => a.topicName.localeCompare(b.topicName)));
        setNewTopicName('');
    };
    
    const handleConfirmDelete = () => {
        if (!showDeleteConfirm) return;
        onUpdateTopics(prevTopics => {
            if (showDeleteConfirm.type === 'topic') {
                return prevTopics.filter(t => t.id !== showDeleteConfirm.topicId);
            }
            if (showDeleteConfirm.type === 'file' && showDeleteConfirm.fileId) {
                const { topicId, fileId } = showDeleteConfirm;
                return prevTopics.map(topic => 
                    topic.id === topicId ? { ...topic, files: topic.files?.filter(f => f.id !== fileId) } : topic
                );
            }
            return prevTopics;
        });
        setShowDeleteConfirm(null);
    };

    const handleStartEditingTopicName = (topic: TestTopic) => {
        setTopicToConfigureId(null);
        setEditingTopicId(topic.id);
        setEditingTopicName(topic.topicName);
    };

    const handleCancelEditing = () => {
        setEditingTopicId(null);
        setEditingTopicName('');
    };

    const handleUpdateTopicName = (topicId: string) => {
        const trimmedName = editingTopicName.trim();
        if (!trimmedName) {
            handleCancelEditing();
            return;
        };
        
        const originalTopic = testTopics.find(t => t.id === topicId);
        if (trimmedName.toLowerCase() !== originalTopic?.topicName.toLowerCase() && allTopicNames.some(name => name.toLowerCase() === trimmedName.toLowerCase())) {
            handleCancelEditing();
            return;
        }
        onUpdateTopics(prev => prev.map(t =>
            t.id === topicId ? { ...t, topicName: trimmedName } : t
        ));
        handleCancelEditing();
    };
    
    const handleFilesUpload = (files: FileList | null, topicId: string) => {
        if (!files || files.length === 0) return;
        setUploadError(null);

        const validFiles: File[] = Array.from(files);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (validFiles.length === 0) {
            return;
        }

        const newFileInfos: FileInfo[] = validFiles.map(file => ({
            id: `file_${topicId}_${Date.now()}_${Math.random()}`,
            fileName: file.name,
            mimeType: file.type,
            fileContentBase64: '',
            status: 'uploading' as const,
            progress: 0,
        }));

        onUpdateTopics(prevTopics =>
            prevTopics.map(topic => 
                topic.id === topicId ? { ...topic, files: [...(topic.files || []), ...newFileInfos] } : topic
            )
        );

        validFiles.forEach((file, index) => {
            const fileInfo = newFileInfos[index];
            const reader = new FileReader();

            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onUpdateTopics(prev => prev.map(t => t.id === topicId ? { ...t, files: t.files?.map(f => f.id === fileInfo.id ? { ...f, progress } : f) } : t));
                }
            };

            reader.onload = () => {
                onUpdateTopics(prev => prev.map(t => t.id === topicId ? { ...t, files: t.files?.map(f => f.id === fileInfo.id ? { ...f, fileContentBase64: reader.result as string, status: 'completed' as const, progress: 100 } : f) } : t));
            };

            reader.onerror = () => {
                onUpdateTopics(prev => prev.map(t => t.id === topicId ? { ...t, files: t.files?.map(f => f.id === fileInfo.id ? { ...f, status: 'error' as const, errorMessage: 'Failed to read file.' } : f) } : t));
            };

            reader.readAsDataURL(file);
        });
    };
    
    const handleFilesSelectedForNewTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopicCreationError(null);
        const files = e.target.files;
        const inputElement = e.target;
        if (!files || files.length === 0) {
            if (inputElement) inputElement.value = '';
            return;
        }
        
        const validFiles: File[] = Array.from(files);
        
        if (inputElement) inputElement.value = '';

        if (validFiles.length === 0) {
            setFolderUploadError(`No files were selected.`);
            setTimeout(() => setFolderUploadError(null), 5000);
            return;
        }
        
        setFolderUploadError(null);
        
        let baseName: string;
        if (validFiles.length === 1) {
            baseName = validFiles[0].name.split('.').slice(0, -1).join('.') || validFiles[0].name;
        } else {
            const firstFileName = validFiles[0].name.split('.').slice(0, -1).join('.') || validFiles[0].name;
            baseName = `${firstFileName} & others`;
        }
        
        const newTopicName = allTopicNames.some(name => name.toLowerCase() === baseName.toLowerCase()) 
            ? `${baseName} (${new Date().toLocaleTimeString()})` 
            : baseName;
        
        const newTopicId = `topic_${Date.now()}`;

        const newFileInfos: FileInfo[] = validFiles.map((file: File) => ({
            id: `file_${newTopicId}_${Date.now()}_${Math.random()}`,
            fileName: file.name,
            mimeType: file.type,
            fileContentBase64: '',
            status: 'uploading' as const,
            progress: 0,
        }));
        
        const newTopic: TestTopic = {
            id: newTopicId,
            topicName: newTopicName,
            files: newFileInfos,
            generationStatus: 'idle',
            sourceType: 'pdf',
            createdAt: new Date().toISOString(),
            examType: activeExamType,
        };

        onUpdateTopics(prevTopics => [...prevTopics, newTopic]);

        validFiles.forEach((file: File, index) => {
            const fileInfo = newFileInfos[index];
            const reader = new FileReader();
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onUpdateTopics(prev => prev.map(t => t.id === newTopicId ? { ...t, files: t.files?.map(f => f.id === fileInfo.id ? { ...f, progress } : f) } : t));
                }
            };
            reader.onload = () => {
                onUpdateTopics(prev => prev.map(t => t.id === newTopicId ? { ...t, files: t.files?.map(f => f.id === fileInfo.id ? { ...f, fileContentBase64: reader.result as string, status: 'completed' as const, progress: 100 } : f) } : t));
            };
            reader.onerror = () => {
                onUpdateTopics(prev => prev.map(t => t.id === newTopicId ? { ...t, files: t.files?.map(f => f.id === fileInfo.id ? { ...f, status: 'error' as const, errorMessage: 'Failed to read file.' } : f) } : t));
            };
            reader.readAsDataURL(file);
        });
    };

    const getFilesFromDirectoryEntry = (directoryEntry: any): Promise<File[]> => {
        const directoryReader = directoryEntry.createReader();
        let allEntries: any[] = [];

        return new Promise((resolve, reject) => {
            const readEntries = () => {
                directoryReader.readEntries(
                    async (entries: any[]) => {
                        if (entries.length > 0) {
                            allEntries = allEntries.concat(entries);
                            readEntries();
                        } else {
                            const filePromises: Promise<File | File[]>[] = allEntries.map(entry => {
                                if (entry.isFile) {
                                    return new Promise<File>((fileResolve, fileReject) => entry.file(fileResolve, fileReject));
                                }
                                if (entry.isDirectory) {
                                    return getFilesFromDirectoryEntry(entry);
                                }
                                return Promise.resolve([]);
                            });
                            const filesAndArrays = await Promise.all(filePromises);
                            resolve(filesAndArrays.flat() as File[]);
                        }
                    },
                    (error: any) => reject(error)
                );
            };
            readEntries();
        });
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>, topicId: string) => {
        e.preventDefault(); e.stopPropagation(); setDraggedOverTopicId(null); setUploadError(null);
        let allFiles: File[] = [];
        if (e.dataTransfer.items) {
            const entryPromises = Array.from(e.dataTransfer.items).map(item => {
                const entry = (item as any).webkitGetAsEntry();
                if (entry) {
                    if (entry.isDirectory) return getFilesFromDirectoryEntry(entry);
                    if (entry.isFile) return new Promise<File[]>(res => (entry as any).file((f: File) => res([f])));
                }
                return Promise.resolve([]);
            });
            const fileArrays = await Promise.all(entryPromises);
            allFiles = fileArrays.flat();
        } else {
            allFiles = Array.from(e.dataTransfer.files);
        }
        if (allFiles.length > 0) {
            const dataTransfer = new DataTransfer();
            allFiles.forEach((file: File) => dataTransfer.items.add(file));
            handleFilesUpload(dataTransfer.files, topicId);
        }
    };
    const handleBrowseClick = (topicId: string) => { setTopicIdForUpload(topicId); fileInputRef.current?.click(); };
    const handleOpenConfigModal = (topicId: string) => { 
        const topic = testTopics.find(t => t.id === topicId);
        if (topic?.generationConfig) {
            setNumQuestions(topic.generationConfig.numQuestions);
            setDifficulty(topic.generationConfig.difficulty);
            setMode(topic.generationConfig.mode || 'test');
        } else {
            setNumQuestions(10);
            setDifficulty('Medium');
            setMode('test');
        }
        setTopicToConfigureId(topicId);
     };
    const handleCloseConfigModal = () => { 
        setIsConfigModalClosing(true);
        setTimeout(() => {
            setTopicToConfigureId(null);
            setIsConfigModalClosing(false);
        }, 300);
     };
    
    // Sample Questions Logic
    const handleGenerateSampleQuestions = useCallback(async () => {
      if (sampleGenerationController.current) {
        sampleGenerationController.current.abort();
      }
      const controller = new AbortController();
      sampleGenerationController.current = controller;

      setIsLoadingSamples(true);
      setErrorSamples(null);
      setSampleQuestions([]);

      const allTopics = syllabus.flatMap(unit => unit.topics);

      try {
        const promises = allTopics.map(topic =>
          generateSampleQuestionForTopic(topic, activeExamType, controller.signal)
        );

        const allResults = await Promise.all(promises);

        if (controller.signal.aborted) return;
        
        const errorCount = allResults.filter(r => r.error).length;
        if (allTopics.length > 0 && errorCount === allTopics.length) {
          setErrorSamples("Failed to generate any sample questions. The AI service may be busy.");
        } else {
          setSampleQuestions(allResults);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setErrorSamples(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSamples(false);
        }
      }
    }, [syllabus, activeExamType]);

    const questionsByUnit = useMemo(() => {
        const grouped: { [unitTitle: string]: TopicQuestion[] } = {};
        sampleQuestions.forEach(tq => {
          const unitTitle = tq.topic.unit;
          if (!grouped[unitTitle]) {
            grouped[unitTitle] = [];
          }
          grouped[unitTitle].push(tq);
        });
        return Object.entries(grouped);
    }, [sampleQuestions]);


    const renderConfigModal = () => { 
        if (!topicToConfigureId || !modalRoot) return null;
        const topic = testTopics.find(t => t.id === topicToConfigureId);
        if (!topic) return null;

        const modalJsx = (
            <div
                className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 ${isConfigModalClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
                onClick={handleCloseConfigModal} role="dialog" aria-modal="true" aria-labelledby="config-modal-title"
            >
                <div
                    className={`bg-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col ${isConfigModalClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <header className="p-6 border-b border-white/10 flex justify-between items-start">
                        <div>
                            <h2 id="config-modal-title" className="text-2xl font-bold text-white">Configure Test</h2>
                            <p className="text-sm text-gray-400 mt-1 truncate" title={topic.topicName}>{topic.topicName}</p>
                        </div>
                        <button onClick={handleCloseConfigModal} className="text-gray-400 hover:text-white" aria-label="Close">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                     <main className="p-6 space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor={`qs-${topic.id}`} className="block text-lg font-semibold text-gray-200">
                                    Number of Questions:
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="100"
                                    step="1"
                                    value={numQuestions}
                                    onChange={(e) => {
                                        const value = Math.max(5, Math.min(100, Number(e.target.value) || 5));
                                        setNumQuestions(value);
                                    }}
                                    className="w-24 p-2 bg-slate-900/50 text-center font-bold text-lg text-purple-300 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <input id={`qs-${topic.id}`} type="range" min="5" max="100" step="1" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>5</span>
                                <span>100</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-200 mb-3">Difficulty Level</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {fileUploadDifficulties.map((level) => (<button key={level} type="button" onClick={() => setDifficulty(level)} className={`w-full font-semibold rounded-lg px-4 py-2 text-md transition-colors duration-200 border ${difficulty === level ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400'}`}>{level}</button>))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-200 mb-3">Mode</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button" onClick={() => setMode('test')}
                                    className={`w-full font-semibold rounded-lg px-4 py-3 text-md transition-colors duration-200 border ${mode === 'test' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400'}`}
                                >Test Mode</button>
                                <button
                                    type="button" onClick={() => setMode('practice')}
                                    className={`w-full font-semibold rounded-lg px-4 py-3 text-md transition-colors duration-200 border ${mode === 'practice' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400'}`}
                                >Practice Mode</button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">{mode === 'test' ? 'Timed test with results at the end.' : 'Untimed practice with instant feedback.'}</p>
                        </div>
                    </main>
                    <footer className="p-6 border-t border-white/10 mt-auto">
                        <button onClick={() => { onStartGeneration(topic.id, numQuestions, difficulty, mode); handleCloseConfigModal(); }} className="btn btn-primary w-full text-lg">
                            Generate & View Progress
                        </button>
                    </footer>
                </div>
            </div>
        );
        return ReactDOM.createPortal(modalJsx, modalRoot);
     };
    const renderDeleteConfirmationModal = () => { 
        if (!showDeleteConfirm || !modalRoot) return null;
        const modalJsx = (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 modal-backdrop-animate" onClick={() => setShowDeleteConfirm(null)}>
                <div className="bg-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 modal-content-animate" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
                    <p className="text-gray-300 mt-2">Are you sure you want to delete <strong className="text-red-400 break-all">{showDeleteConfirm.name}</strong>? This action cannot be undone.</p>
                    <div className="mt-8 flex justify-end gap-4">
                        <button onClick={() => setShowDeleteConfirm(null)} className="btn btn-secondary">Cancel</button>
                        <button onClick={handleConfirmDelete} className="btn bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-600/30 hover:shadow-red-600/40">Delete</button>
                    </div>
                </div>
            </div>
        );
        return ReactDOM.createPortal(modalJsx, modalRoot);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">My Documents & PDF Tests</h1>
                    <p className="mt-2 text-lg text-gray-400">Upload your study materials, create custom topics, and generate tests.</p>
                </div>
                 {onGoBack && (
                    <button onClick={onGoBack} className="btn btn-secondary flex-shrink-0 self-start sm:self-center">
                        &larr; Back to Home
                    </button>
                )}
            </div>

            <input type="file" ref={fileInputRef} onChange={(e) => {
                 if (topicIdForUpload) { handleFilesUpload(e.target.files, topicIdForUpload); }
                 if(e.target) e.target.value = '';
                 setTopicIdForUpload(null);
             }} className="hidden" multiple />
             <input type="file" ref={multiFileInputRef} onChange={handleFilesSelectedForNewTopic} className="hidden" multiple />
             {renderDeleteConfirmationModal()}
             {renderConfigModal()}

            <div className="max-w-7xl mx-auto space-y-16">
                 <div className="max-w-3xl mx-auto relative bg-slate-900/70 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8">
                    {folderUploadError && (
                        <div className="mb-6 -mt-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg" role="alert">
                            <p>{folderUploadError}</p>
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-white">Create a New Topic for {activeExamType}</h2>
                        <p className="text-gray-400 mt-1">Create a new topic by name, or by uploading one or more files directly, which will automatically create a new topic for them. Only PDF files will be used for question generation.</p>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-full">
                            <label htmlFor="new-topic-name" className="sr-only">New Topic Name</label>
                            <input id="new-topic-name" type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateTopic()} className="w-full p-3 bg-slate-900/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Indian History, Aptitude Formulas" />
                             {topicCreationError && <p className="text-red-400 text-sm font-semibold mt-2">{topicCreationError}</p>}
                        </div>
                         <div className="flex w-full sm:w-auto gap-3">
                            <button onClick={handleCreateTopic} className="flex-1 sm:flex-initial px-6 py-3 rounded-lg font-semibold text-white bg-purple-600 shadow-lg shadow-purple-600/40 transition-all duration-300 transform hover:scale-105 hover:bg-purple-700">Create Topic</button>
                            <button onClick={() => multiFileInputRef.current?.click()} className="flex-1 sm:flex-initial px-4 py-3 rounded-lg font-semibold text-white bg-teal-600 shadow-lg shadow-teal-600/40 transition-all duration-300 transform hover:scale-105 hover:bg-teal-700 flex items-center justify-center gap-2" title="Upload one or more files to create a new topic">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h1z" /></svg>
                                Upload Files
                            </button>
                        </div>
                    </div>
                </div>
            
                <div>
                    <h2 className="text-2xl font-bold text-white mb-8">My {activeExamType} Custom Topics</h2>
                    {testTopics.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {testTopics.map((topic, index) => {
                                const isBeingDraggedOver = draggedOverTopicId === topic.id;
                                const isEditing = editingTopicId === topic.id;
                                const filesReady = topic.files && topic.files.length > 0 && topic.files.every(f => f.status === 'completed' && f.fileContentBase64);
                                return (
                                <div 
                                    key={topic.id} 
                                    className={`upload-card rounded-2xl shadow-xl flex flex-col item-animated-entry ${isBeingDraggedOver ? 'drag-over-pulse' : ''}`}
                                    style={{ animationDelay: `${index * 80}ms` }}
                                    onMouseMove={handleCardMouseMove}
                                    onMouseLeave={handleCardMouseLeave}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDraggedOverTopicId(topic.id); }}
                                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDraggedOverTopicId(null); handleCardMouseLeave(e); }}
                                    onDrop={(e) => handleDrop(e, topic.id)}
                                >
                                    <div className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="flex-shrink-0 pt-1"><FileUploadFolderIcon count={topic.files?.length || 0} /></div>
                                                {isEditing ? (
                                                    <input type="text" value={editingTopicName} onChange={(e) => setEditingTopicName(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') handleUpdateTopicName(topic.id)}} onBlur={() => handleUpdateTopicName(topic.id)} className="text-lg font-bold text-white bg-transparent border-b-2 border-purple-500 focus:outline-none w-full" autoFocus />
                                                ) : (
                                                    <h3 className="text-lg font-bold text-white truncate" title={topic.topicName}>{topic.topicName}</h3>
                                                )}
                                            </div>
                                            <div className="flex items-center flex-shrink-0 -mr-2">
                                                {isEditing ? (
                                                    <><button onClick={() => handleUpdateTopicName(topic.id)} className="p-2 text-gray-400 hover:text-green-400 rounded-full" aria-label="Save topic name"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></button><button onClick={handleCancelEditing} className="p-2 text-gray-400 hover:text-red-500 rounded-full" aria-label="Cancel editing"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button></>
                                                ) : (
                                                    <><button onClick={() => handleStartEditingTopicName(topic)} className="p-2 text-gray-400 hover:text-purple-400 rounded-full" aria-label="Edit topic name"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button><button onClick={() => setShowDeleteConfirm({ type: 'topic', topicId: topic.id, name: topic.topicName })} className="p-2 text-gray-400 hover:text-red-500 rounded-full" aria-label="Delete topic"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2 flex-grow min-h-[80px] overflow-y-auto max-h-48 pr-2">
                                            {topic.files && topic.files.length > 0 ? ( topic.files.map(file => (<div key={file.id} className="p-3 bg-slate-800/50 rounded-lg text-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3 min-w-0"><div className="flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg></div><p className="font-medium text-gray-300 truncate" title={file.fileName}>{file.fileName}</p></div><div className="flex-shrink-0 flex items-center gap-2">{file.status === 'completed' && (<div title="Completed" className="text-green-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>)}{file.status === 'error' && (<div title={file.errorMessage} className="text-red-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg></div>)}<button onClick={() => setShowDeleteConfirm({ type: 'file', topicId: topic.id, fileId: file.id, name: file.fileName })} className="p-1 text-gray-500 hover:text-red-500 rounded-full" aria-label="Delete file"><svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button></div></div>{file.status === 'uploading' && file.progress !== undefined && (<div className="mt-2"><div className="flex items-center gap-2"><div className="w-full bg-slate-700 rounded-full h-1.5"><div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-150 ease-linear" style={{width: `${file.progress}%`}}></div></div><span className="text-xs text-gray-400 font-mono w-10 text-right flex-shrink-0">{file.progress}%</span></div></div>)}{file.status === 'error' && (<p className="text-xs text-red-400 mt-1 pl-9">{file.errorMessage}</p>)}</div>))
                                            ) : (
                                                <div className="text-center text-gray-500 pt-4 text-sm"><span className="pointer-events-none">Drag & drop files here or <button type="button" onClick={(e) => { e.stopPropagation(); handleBrowseClick(topic.id); }} className="font-semibold text-purple-400 hover:text-purple-300 pointer-events-auto">browse to add</button>.</span></div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-black/20 border-t border-white/10 mt-auto"><div className="flex flex-col gap-3"><button onClick={() => handleOpenConfigModal(topic.id)} className="btn btn-secondary w-full" disabled={!filesReady} title={!filesReady ? "Please add at least one PDF file to this topic to enable generation." : "Generate a test from these files."}>Generate Test</button></div></div>
                                </div>
                            )})}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-slate-900/70 rounded-2xl border border-dashed border-slate-700"><svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2-2H5a2 2 0 01-2-2z" /></svg><p className="mt-4 font-semibold text-gray-300">No topics created yet.</p><p className="text-sm text-gray-500">Create your first topic to get started.</p></div>
                    )}
                </div>

                <div className="mt-16 pt-16 border-t-2 border-dashed border-white/10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white">Syllabus Sample Questions</h2>
                        <p className="mt-4 text-lg text-gray-400">
                            Generate one AI-powered question for each topic in the current syllabus to check the quality and style.
                        </p>
                        <div className="mt-6">
                            <button onClick={handleGenerateSampleQuestions} disabled={isLoadingSamples} className="btn btn-primary">
                                {isLoadingSamples ? 'Generating...' : 'Generate Sample Questions'}
                            </button>
                        </div>
                    </div>

                    {isLoadingSamples && <Loader message="Generating one question per topic..." activeExamType={activeExamType} />}
                    {errorSamples && <p className="text-red-400 text-center">{errorSamples}</p>}
                    {sampleQuestions.length > 0 && !isLoadingSamples && (
                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-12">
                            {questionsByUnit.map(([unitTitle, questions]) => (
                                <div key={unitTitle}>
                                <h2 className="text-2xl font-bold text-purple-300 mb-6 border-b-2 border-purple-500/30 pb-3">{unitTitle}</h2>
                                <div className="space-y-8">
                                    {questions.map((item, itemIndex) => (
                                    <div key={`${item.topic.name}-${itemIndex}`} className="bg-black/20 p-6 rounded-2xl border border-white/10 item-animated-entry" style={{ animationDelay: `${itemIndex * 70}ms` }}>
                                        <h3 className="text-xl font-bold text-white mb-1">{item.topic.name}</h3>
                                        
                                        {item.error ? (
                                        <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                                            <p><strong className="font-bold">Error:</strong> Failed to generate question. {item.error}</p>
                                        </div>
                                        ) : !item.question ? (
                                        <div className="mt-4 text-gray-500">
                                            <p>Could not generate a sample question for this topic.</p>
                                        </div>
                                        ) : (
                                        <div className="mt-4">
                                            <div className="font-semibold text-gray-200 mb-4">{renderTextWithMarkdown(item.question.questionText)}</div>
                                            <div className="space-y-2">
                                            {Object.entries(item.question.options).map(([key, value]) => {
                                                const isCorrect = item.question?.correctOption === key;
                                                const optionStyle = isCorrect
                                                ? 'bg-green-500/10 text-green-200 border-green-500/30 font-semibold'
                                                : 'bg-black/20 text-gray-400 border-transparent';
                                                
                                                return (
                                                <div key={key} className={`p-3 rounded-lg flex items-start gap-3 border ${optionStyle}`}>
                                                    <span className="font-bold text-sm">{key}.</span>
                                                    <span className="text-base flex-grow">{renderTextWithMarkdown(value as string)}</span>
                                                </div>
                                                );
                                            })}
                                            </div>
                                            <div className="mt-6">
                                                <div className="p-4 rounded-lg bg-purple-500/10">
                                                    <h5 className="font-bold text-white mb-2">Explanation</h5>
                                                    {item.question.explanationDiagramSvg && (
                                                        <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: item.question.explanationDiagramSvg }} />
                                                    )}
                                                    <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed">
                                                        {renderTextWithMarkdown(item.question.explanation)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                    ))}
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploadView;
