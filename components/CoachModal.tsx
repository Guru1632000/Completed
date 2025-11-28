import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CoachFeedback } from '../types';

interface CoachModalProps {
    feedback: CoachFeedback;
    onClose: () => void;
}

const renderWithMarkdown = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
        }
        return part;
    });
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mt-6">
        <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            {title}
        </h3>
        <div className="pl-12 text-gray-300 space-y-2">
            {children}
        </div>
    </div>
);

const CoachModal: React.FC<CoachModalProps> = ({ feedback, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Match exit animation duration
    };

    if (!modalRoot) {
        return null;
    }

    const modalJsx = (
        <div 
            className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="coach-modal-title"
        >
            <div 
                className={`bg-[#13111c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-white/10 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="9" y1="14" x2="15" y2="14"></line>
                            </svg>
                        </div>
                        <div>
                            <h2 id="coach-modal-title" className="text-2xl font-bold text-white">Your AI Coach Report</h2>
                            <p className="text-sm text-gray-400">Personalized feedback from PrepPal</p>
                        </div>
                    </div>
                     <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <main className="p-6 overflow-y-auto">
                    <p className="text-lg text-gray-200 mb-4">{feedback.greeting}</p>
                    <p className="text-gray-300 leading-relaxed">{renderWithMarkdown(feedback.overall_summary)}</p>

                    {feedback.strength_areas.length > 0 && (
                        <Section title="Your Strengths" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}>
                            <ul className="list-disc pl-5 space-y-2">
                                {feedback.strength_areas.map((area, i) => (
                                    <li key={`str-${i}`}><strong className="text-white">{area.topic}:</strong> {renderWithMarkdown(area.reason)}</li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    {feedback.weakness_areas.length > 0 && (
                         <Section title="Focus Areas" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>}>
                            <ul className="list-disc pl-5 space-y-2">
                                {feedback.weakness_areas.map((area, i) => (
                                    <li key={`weak-${i}`}><strong className="text-white">{area.topic}:</strong> {renderWithMarkdown(area.reason)}</li>
                                ))}
                            </ul>
                        </Section>
                    )}
                    
                     <Section title="Recommended Study Plan" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}>
                        <p className="mb-4">{renderWithMarkdown(feedback.study_plan_intro)}</p>
                        <div className="space-y-4">
                            {feedback.study_plan.map(step => (
                                <div key={step.step} className="flex items-start gap-4 p-4 bg-black/20 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center">{step.step}</div>
                                    <div>
                                        <h4 className="font-bold text-white">{step.title}</h4>
                                        <p className="text-sm">{renderWithMarkdown(step.description)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                    
                    <div className="mt-8 border-t border-dashed border-white/20 pt-6">
                        <blockquote className="text-center">
                            <p className="text-lg italic text-gray-300">"{renderWithMarkdown(feedback.motivational_quote)}"</p>
                        </blockquote>
                    </div>
                </main>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalJsx, modalRoot);
};

export default CoachModal;