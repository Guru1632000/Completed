import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Topic, Difficulty, Marks, ExamType, TestMode } from '../types';

interface TestConfigModalProps {
  isOpen: boolean;
  testSubject: Topic | Topic[] | null;
  onClose: () => void;
  onStartMCQTest: (subject: Topic | Topic[], numQuestions: number, difficulty: Difficulty, mode: TestMode, durationInMinutes?: number) => void;
  onStartMainsTest: (topic: Topic, marks: Marks) => void;
  activeExamType: ExamType;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];
const marksOptions: Marks[] = [5, 10, 15];

const TestConfigModal: React.FC<TestConfigModalProps> = ({ isOpen, testSubject, onClose, onStartMCQTest, onStartMainsTest, activeExamType }) => {
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [selectedMarks, setSelectedMarks] = useState<Marks | null>(null);
  const [mode, setMode] = useState<TestMode>('test');
  const [timePerQuestion, setTimePerQuestion] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    // Reset to default when modal opens for a new subject
    if (isOpen) {
      setIsClosing(false);
      setNumQuestions(10);
      setDifficulty('Medium');
      setSelectedMarks(null);
      setMode('test');
      setTimePerQuestion(1);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
        onClose();
    }, 300); // Match exit animation duration
  };

  if (!isOpen || !modalRoot) {
    return null;
  }
  
  const isCombinedTest = Array.isArray(testSubject);
  const topic = isCombinedTest ? null : testSubject as Topic; // For single topic properties
  const isMainsTopic = !isCombinedTest && topic!.unit.toLowerCase().includes('mains');

  const theme = {
    buttonSelected: 'bg-white text-black border-white',
    buttonUnselected: 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400',
    sliderAccent: 'accent-purple-500',
    sliderText: 'text-purple-300',
  };

  const handleStartClick = () => {
    if (isMainsTopic && topic) {
        if(selectedMarks) {
            onStartMainsTest(topic, selectedMarks);
        }
    } else if (testSubject) {
        onStartMCQTest(testSubject, numQuestions, difficulty, mode, mode === 'test' ? numQuestions * timePerQuestion : undefined);
    }
  };

  const renderModalHeader = () => {
    if (isCombinedTest) {
        return (
            <div>
                <h2 id="modal-title" className="text-2xl font-bold text-white">Configure Your Test</h2>
                <p className="text-sm text-gray-400 mt-1">{(testSubject as Topic[]).length} topics selected</p>
            </div>
        );
    }
    if (topic) {
         return (
            <div>
                <h2 id="modal-title" className="text-2xl font-bold text-white">{topic.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{topic.unit}</p>
            </div>
        );
    }
    return null;
  }

  const renderModalContent = () => {
      if (isCombinedTest) {
          return (
             <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-md font-semibold text-gray-300 mb-2">Selected Topics:</h3>
                <ul className="text-gray-400 text-sm leading-relaxed max-h-32 overflow-y-auto list-disc pl-5 space-y-1">
                    {(testSubject as Topic[]).map(t => <li key={t.name+t.unit}>{t.name}</li>)}
                </ul>
            </div>
          )
      }
      if (topic && topic.description) {
           return (
             <div className="mt-6 border-t border-white/10 pt-6">
                <h3 className="text-md font-semibold text-gray-300 mb-2">Topic Details</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{topic.description}</p>
            </div>
           )
      }
      return null;
  }
  
  const TestSummary = () => {
      if (isMainsTopic) {
          if (!selectedMarks) return null;
          return (
              <div className="text-center p-3 bg-black/20 rounded-lg">
                  <p className="text-sm text-gray-300">
                      You are creating a descriptive test with a <strong className="text-purple-300">{selectedMarks} Marks</strong> question.
                  </p>
              </div>
          );
      }
      
      const durationInMinutes = mode === 'test' ? numQuestions * timePerQuestion : undefined;

      return (
          <div className="text-center p-3 bg-black/20 rounded-lg">
              <p className="text-sm text-gray-300 leading-relaxed">
                  You are creating a <strong className="text-purple-300">{difficulty}</strong> difficulty <strong className="text-purple-300">{mode}</strong> with <strong className="text-purple-300">{numQuestions} questions</strong>.
                  {durationInMinutes && ` The time limit will be ~${durationInMinutes} minutes.`}
              </p>
          </div>
      );
  };

  const modalJsx = (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-[#0d0c15] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 ${isClosing ? 'modal-content-animate-exit' : 'modal-content-animate'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            {renderModalHeader()}
            <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {renderModalContent()}
        
        {isMainsTopic ? (
             <div className="mt-8">
                <label className="block text-lg font-semibold text-gray-200 mb-3">
                    Select Question Marks
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {marksOptions.map((mark) => (
                        <button
                            key={mark}
                            onClick={() => setSelectedMarks(mark)}
                            className={`w-full font-semibold rounded-lg px-4 py-3 text-md transition-colors duration-200 border ${
                                selectedMarks === mark
                                ? theme.buttonSelected
                                : theme.buttonUnselected
                            }`}
                        >
                            {mark} Marks
                        </button>
                    ))}
                </div>
                 <p className="text-xs text-gray-500 mt-2 text-center">The question's complexity will be tailored for the selected marks.</p>
            </div>
        ) : (
            <>
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                        <label htmlFor="question-slider" className="block text-lg font-semibold text-gray-200">
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
                  <input
                    id="question-slider"
                    type="range"
                    min="5"
                    max="100"
                    step="1"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className={`w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer ${theme.sliderAccent}`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-lg font-semibold text-gray-200 mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {difficulties.map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`w-full font-semibold rounded-lg px-4 py-2 text-md transition-colors duration-200 border ${
                          difficulty === level
                            ? theme.buttonSelected
                            : theme.buttonUnselected
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                 <div className="mt-8">
                  <label className="block text-lg font-semibold text-gray-200 mb-3">
                    Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setMode('test')}
                        className={`w-full font-semibold rounded-lg px-4 py-3 text-md transition-colors duration-200 border ${
                          mode === 'test'
                            ? theme.buttonSelected
                            : theme.buttonUnselected
                        }`}
                      >
                        Test Mode
                      </button>
                      <button
                        onClick={() => setMode('practice')}
                        className={`w-full font-semibold rounded-lg px-4 py-3 text-md transition-colors duration-200 border ${
                          mode === 'practice'
                            ? theme.buttonSelected
                            : theme.buttonUnselected
                        }`}
                      >
                        Practice Mode
                      </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {mode === 'test' ? 'Timed test with results at the end.' : 'Untimed practice with instant feedback.'}
                </p>
                </div>
                {mode === 'test' && (
                    <div className="mt-8 explanation-animate">
                        <label htmlFor="timer-slider" className="block text-lg font-semibold text-gray-200 mb-2">
                        Timer Settings: <span className={`font-extrabold ${theme.sliderText}`}>{timePerQuestion * 60} seconds / question</span>
                        </label>
                        <input
                        id="timer-slider"
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={timePerQuestion}
                        onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                        className={`w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer ${theme.sliderAccent}`}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>30 secs</span>
                        <span>3 mins</span>
                        </div>
                    </div>
                )}
            </>
        )}


        <div className="mt-8 border-t border-white/10 pt-6 space-y-4">
            <TestSummary />
            <button
                onClick={handleStartClick}
                disabled={isMainsTopic && !selectedMarks}
                className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600"
            >
                {isMainsTopic ? 'Start Mains Test' : 'Launch Test'}
            </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalJsx, modalRoot);
};

export default TestConfigModal;
