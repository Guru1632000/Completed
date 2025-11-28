import React, { useState, useEffect, DragEvent, useRef } from 'react';
import { Topic, Difficulty, Question, ExamType } from '../types';
import { generateQuestionsFromPDFContent } from '../services/aiService';

interface PdfUploadModalProps {
  isOpen: boolean;
  topic: Topic | null;
  onClose: () => void;
  onGenerationComplete: (questions: Question[], topic: Topic, difficulty: Difficulty) => void;
  activeExamType: ExamType;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ isOpen, topic, onClose, onGenerationComplete, activeExamType }) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [isClosing, setIsClosing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<'configuring' | 'processing' | 'error'>('configuring');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      // Reset state when modal opens
      setStatus('configuring');
      setNumQuestions(10);
      setDifficulty('Medium');
      setUploadedFile(null);
      setError(null);
      setProgress(0);
      setProgressText('');
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const readPdfText = async (file: File): Promise<string> => {
    if (!window.pdfjsLib) {
        throw new Error("PDF processing library is not loaded.");
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        // IMPROVEMENT: Join with newlines to better preserve document structure
        const pageText = textContent.items.map((item: any) => item.str).join('\n');
        // Clean up extra whitespace and newlines for a cleaner input to the AI
        fullText += pageText.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').replace(/ {2,}/g, ' ') + '\n\n';
    }
    const MAX_CONTEXT_LENGTH = 100000;
    if (fullText.length > MAX_CONTEXT_LENGTH) {
        console.warn(`PDF text truncated to ${MAX_CONTEXT_LENGTH} characters.`);
        return fullText.substring(0, MAX_CONTEXT_LENGTH);
    }
    return fullText.trim();
  };

  const simulateProgress = (start: number, end: number, duration: number) => {
      return new Promise(resolve => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = (end - start) / steps;
        
        progressIntervalRef.current = window.setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= end) {
                    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                    setProgress(end);
                    resolve(true);
                    return end;
                }
                return next;
            });
        }, stepTime);
      });
  };

  const handleGenerateClick = async () => {
    if (!topic || !uploadedFile) return;
    
    setStatus('processing');
    setError(null);

    try {
        // Phase 1: Reading PDF (0% -> 30%)
        setProgressText('Analyzing PDF...');
        await simulateProgress(0, 30, 1500);
        const pdfText = await readPdfText(uploadedFile);

        // Phase 2: Generating Questions (30% -> 90%)
        setProgressText('Generating questions with AI...');
        
        // FIX: The type of setProgressText (a state setter) does not match the expected function signature.
        // A wrapper function `updateStatus` is created to adapt it, using the text from the service while letting
        // the `simulateProgress` function handle the visual progress bar animation.
        const updateStatus = (_progress: number, text: string, _currentStepIndex?: number) => {
            setProgressText(text);
        };
        const generationPromise = generateQuestionsFromPDFContent(pdfText, topic, numQuestions, difficulty, activeExamType, updateStatus);
        await simulateProgress(30, 90, 8000); // Simulate long AI call
        const generatedQuestions = await generationPromise;

        if (!generatedQuestions || generatedQuestions.length === 0) {
            throw new Error("The AI could not generate any questions from the provided PDF content.");
        }
        
        // Phase 3: Complete (90% -> 100%)
        setProgressText('Done!');
        await simulateProgress(90, 100, 300);
        
        setTimeout(() => {
            onGenerationComplete(generatedQuestions, topic, difficulty);
            handleClose();
        }, 500);

    } catch (err) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
        setError(errorMessage);
        setStatus('error');
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf') {
        setError('Invalid file type. Please upload a PDF file.');
        return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File is too large. Please upload a file under 10MB.');
        return;
    }
    setError(null);
    setUploadedFile(file);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    if (event.target) event.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  if (!isOpen || !topic) return null;
  
  const renderContent = () => {
    if (status === 'processing' || status === 'error') {
        return (
            <div className="p-8 text-center">
                <div className="relative mx-auto w-48 h-56 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl border border-white/10" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-purple-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/30 text-white text-xs font-bold px-2 py-0.5 rounded-md">PDF</div>
                </div>

                <h3 className="text-lg font-semibold text-white mt-6 truncate" title={uploadedFile?.name}>{uploadedFile?.name}</h3>
                <p className="text-sm text-gray-400">{formatBytes(uploadedFile?.size || 0)}</p>

                {status === 'processing' && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center text-sm font-medium text-gray-400 mb-2">
                            <span>{progressText}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-2.5">
                            <div 
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300 ease-linear"
                                style={{ 
                                    width: `${progress}%`,
                                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.7), 0 0 20px rgba(139, 92, 246, 0.4)'
                                }}
                            />
                        </div>
                    </div>
                )}
                 {status === 'error' && (
                    <div className="mt-6 text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-red-300 font-semibold">Generation Failed</p>
                        <p className="text-red-400 text-sm mt-1">{error}</p>
                         <button onClick={() => setStatus('configuring')} className="mt-4 text-sm font-semibold bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20">
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <main className="p-6 space-y-6 overflow-y-auto">
                <div>
                    <label className="block text-lg font-semibold text-gray-200 mb-3">Upload your study material</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf" />
                    {uploadedFile ? (
                        <div className="p-4 bg-black/20 rounded-lg flex items-center justify-between border border-white/20">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <span className="font-medium text-gray-300 truncate" title={uploadedFile.name}>{uploadedFile.name}</span>
                            </div>
                            <button onClick={() => setUploadedFile(null)} className="ml-4 flex-shrink-0 text-gray-400 hover:text-red-500" aria-label="Remove file">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors group ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-400'}`} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && fileInputRef.current?.click()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="mt-2 font-semibold text-gray-300">Drag & drop PDF here or <span className="text-purple-400">click to browse</span></p>
                            <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                        </div>
                    )}
                    {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                </div>

                <div>
                    <label htmlFor="question-slider" className="block text-lg font-semibold text-gray-200 mb-2">Number of Questions: <span className="font-extrabold text-purple-300">{numQuestions}</span></label>
                    <input id="question-slider" type="range" min="5" max="25" step="5" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1"><span>5</span><span>25</span></div>
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-200 mb-3">Difficulty Level</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {difficulties.map((level) => (<button key={level} onClick={() => setDifficulty(level)} className={`w-full font-semibold rounded-lg px-4 py-2 text-md transition-colors duration-200 border ${difficulty === level ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400'}`}>{level}</button>))}
                    </div>
                </div>
            </main>
            <footer className="p-6 border-t border-white/10 mt-auto">
                <button onClick={handleGenerateClick} disabled={!uploadedFile} className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">Generate Questions</button>
            </footer>
        </>
    );
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4 ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
        <div className={`bg-gradient-to-br from-[#110f1e] to-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col transition-all duration-300 ${isClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`} onClick={(e) => e.stopPropagation()}>
            <header className="p-6 border-b border-white/10 flex justify-between items-start">
                <div>
                    <h2 id="pdf-modal-title" className="text-2xl font-bold text-white">Generate Questions from PDF</h2>
                    <p className="text-sm text-gray-400 mt-1">Topic: {topic.name}</p>
                </div>
                <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>
            {renderContent()}
        </div>
    </div>
  );
};

export default PdfUploadModal;
