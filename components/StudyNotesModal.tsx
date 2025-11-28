import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { StudyNotes } from '../types';
import Loader from './Loader';
import { renderTextWithMarkdown } from './utils';

interface StudyNotesModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  notes: StudyNotes | null;
  onClose: () => void;
  onRetry: () => void;
}

const StudyNotesModal: React.FC<StudyNotesModalProps> = ({ isOpen, isLoading, error, notes, onClose, onRetry }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-8"><Loader message="Generating study material..." activeExamType="TNPSC"/></div>;
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Failed to generate study notes:</strong>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={onRetry} className="btn btn-primary">Try Again</button>
        </div>
      );
    }

    if (notes) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-purple-300 uppercase tracking-wider">Introduction</h3>
            <div className="mt-2 text-gray-300 leading-relaxed">{renderTextWithMarkdown(notes.introduction)}</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-300 uppercase tracking-wider">Key Points</h3>
            <div className="mt-2 text-gray-300 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                    {notes.keyPoints.map((point, index) => <li key={index}>{renderTextWithMarkdown(point)}</li>)}
                </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-300 uppercase tracking-wider">Solved Example</h3>
            <div className="mt-2 space-y-4">
              <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                <h4 className="font-semibold text-gray-200">Problem:</h4>
                <div className="mt-1 text-gray-300">{renderTextWithMarkdown(notes.example.problem)}</div>
              </div>
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-500/20">
                <h4 className="font-semibold text-green-300">Solution:</h4>
                <div className="mt-1 text-gray-300 whitespace-pre-wrap">{renderTextWithMarkdown(notes.example.solution)}</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-300 uppercase tracking-wider">Summary</h3>
            <div className="mt-2 text-gray-300 leading-relaxed">{renderTextWithMarkdown(notes.summary)}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!isOpen || !modalRoot) {
    return null;
  }

  const modalJsx = (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notes-modal-title"
    >
      <div
        className={`bg-[#13111c] border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col ${isClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-white/10 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 id="notes-modal-title" className="text-2xl font-bold text-white">{notes?.topic || 'Study Notes'}</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJsx, modalRoot);
};

export default StudyNotesModal;
