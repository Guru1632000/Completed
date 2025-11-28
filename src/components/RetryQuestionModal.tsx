
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Question, Topic, Difficulty, ExamType } from '../types';
import { generateMCQQuestions, generateBankMCQQuestions, generateRailwayMCQQuestions, generateSSCMCQQuestions } from '../services/aiService';
import Loader from './Loader';
import { renderTextWithMarkdown, renderQuestionText } from './utils';

interface RetryQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionToRetry: Question | null;
  testDifficulty: Difficulty;
  examType: ExamType;
}

export const RetryQuestionModal: React.FC<RetryQuestionModalProps> = ({ isOpen, onClose, questionToRetry, testDifficulty, examType }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState<Question | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const explanationRef = useRef<HTMLDivElement>(null);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    const fetchNewQuestion = useCallback(async () => {
        if (!questionToRetry) return;

        setIsLoading(true);
        setError(null);
        setNewQuestion(null);
        setSelectedOption(null);
        setIsAnswered(false);

        try {
            const topic: Topic = {
                name: questionToRetry.questionSubtype || "Related Topic",
                unit: questionToRetry.section || "General"
            };

            let generator: (topics: Topic | Topic[], num: number, diff: Difficulty, exclude?: string, signal?: AbortSignal) => Promise<Question[]>;
            
            switch (examType) {
                case 'Bank Exam':
                    generator = generateBankMCQQuestions;
                    break;
                case 'Railway':
                    generator = generateRailwayMCQQuestions;
                    break;
                case 'SSC':
                    generator = generateSSCMCQQuestions;
                    break;
                default:
                    generator = generateMCQQuestions;
            }

            const questions = await generator([topic], 1, testDifficulty, questionToRetry.questionText);
            if (questions && questions.length > 0) {
                setNewQuestion(questions[0]);
            } else {
                throw new Error("Could not generate a new question.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [questionToRetry, testDifficulty, examType]);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            fetchNewQuestion();
        }
    }, [isOpen, fetchNewQuestion]);

    useEffect(() => {
        if (isAnswered && explanationRef.current) {
            explanationRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [isAnswered]);
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Match exit animation duration
    };
    
    if (!isOpen || !modalRoot) {
        return null;
    }

    const handleCheckAnswer = () => {
        if (!selectedOption) return;
        setIsAnswered(true);
    };
    
    const getOptionClasses = (option: string) => {
        const isSelected = selectedOption === option;
        let baseClasses = `w-full text-left p-4 my-2 rounded-xl border flex items-center justify-between apple-like-transition`;
        
        if (isAnswered) {
            const isCorrectAnswer = newQuestion?.correctOption === option;
            baseClasses += ' cursor-default';
            if(isCorrectAnswer) {
                baseClasses += ` bg-green-500/20 border-green-500 text-green-200`;
            } else if (isSelected && !isCorrectAnswer) {
                baseClasses += ` bg-red-500/20 border-red-500 text-red-200`;
            } else {
                baseClasses += ` bg-white/5 border-white/10 opacity-70 cursor-not-allowed`;
            }
        } else {
            baseClasses += ' cursor-pointer';
            if (isSelected) {
                baseClasses += ` bg-purple-500/10 font-semibold text-white border-purple-500`;
            } else {
                baseClasses += ` bg-white/5 border-white/10 text-gray-200 hover:border-purple-500/70`;
            }
        }
        return baseClasses;
    };

    const modalJsx = (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="retry-modal-title"
        >
            <div 
                className={`bg-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 id="retry-modal-title" className="text-xl font-bold text-white">Retry Question</h2>
                        <p className="text-sm text-gray-400">Topic: {questionToRetry?.questionSubtype}</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="p-6 overflow-y-auto">
                    {isLoading ? (
                        <Loader message="Generating a new question..." activeExamType={examType} />
                    ) : error ? (
                        <div className="text-center p-4">
                            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg" role="alert">
                                <strong className="font-bold">Failed to generate question:</strong>
                                <p>{error}</p>
                            </div>
                            <button onClick={fetchNewQuestion} className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 17H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Retry Generation
                            </button>
                        </div>
                    ) : newQuestion ? (
                        <div>
                            {newQuestion.commonContext && (
                                <div className="p-4 mb-4 bg-black/20 rounded-xl border border-white/10">
                                    <h4 className="text-md font-bold text-gray-300 mb-2">Common Context:</h4>
                                     {newQuestion.commonContextDiagramSvg && (
                                        <div className="my-2 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center diagram-container" dangerouslySetInnerHTML={{ __html: newQuestion.commonContextDiagramSvg }} />
                                    )}
                                    <div className="text-gray-300 prose prose-sm prose-invert max-w-none">
                                        {renderTextWithMarkdown(newQuestion.commonContext)}
                                    </div>
                                </div>
                            )}
                            <div className="text-lg font-semibold text-gray-100 mb-4">
                                {renderQuestionText(newQuestion)}
                            </div>
                            <div>
                                {Object.entries(newQuestion.options).map(([key, value]) => (
                                    <button 
                                        key={key} 
                                        onClick={() => !isAnswered && setSelectedOption(key)} 
                                        className={getOptionClasses(key)}
                                        aria-pressed={selectedOption === key}
                                    >
                                        <div className="flex items-start pr-4">
                                            <span className="font-bold mr-3">{key}.</span> 
                                            <span>{renderTextWithMarkdown(value as string)}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {isAnswered && (
                                <div ref={explanationRef} className="mt-6 p-4 rounded-lg bg-purple-500/10 explanation-animate">
                                    <h5 className="font-bold text-white mb-2">Explanation</h5>
                                     {newQuestion.explanationDiagramSvg && (
                                        <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center diagram-container" dangerouslySetInnerHTML={{ __html: newQuestion.explanationDiagramSvg }} />
                                    )}
                                    <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                                        {renderTextWithMarkdown(newQuestion.explanation)}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </main>
                
                <footer className="p-6 border-t border-white/10 mt-auto flex-shrink-0 flex items-center justify-end gap-3">
                    {isLoading ? null : error ? (
                        <button onClick={handleClose} className="btn btn-secondary">Close</button>
                    ) : isAnswered ? (
                        <>
                            <button onClick={fetchNewQuestion} className="btn btn-secondary">Try Another</button>
                            <button onClick={handleClose} className="btn btn-primary">Close</button>
                        </>
                    ) : (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={!selectedOption || !newQuestion}
                            className="btn btn-primary"
                        >
                            Check Answer
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalJsx, modalRoot);
};
