import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Question, Topic, ExamType, TestMode } from '../types';
import CountdownTimer from './CountdownTimer';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { renderTextWithMarkdown, renderQuestionText } from './utils';
import Loader from './Loader';

interface TestViewProps {
  questions: Question[];
  topic: Topic;
  onFinishTest: (answers: string[], bookmarks: boolean[], timeTakenInSeconds: number) => void;
  activeExamType: ExamType;
  mode: TestMode;
  durationInMinutes?: number;
  currentTestTopicId: string | null;
}

interface TestProgress {
  userAnswers: string[];
  currentQuestionIndex: number;
  timeLeft: number;
  currentSectionIndex?: number;
  bookmarks: boolean[];
}

const TEST_DURATION_PER_QUESTION = 60; // 1 minute per question for general tests
const FULL_MOCK_TEST_DURATION = 3 * 60 * 60; // 3 hours for TNPSC
const BANK_MAINS_MOCK_TEST_DURATION = 3 * 60 * 60; // 3 hours
const RAILWAY_NTPC_MOCK_TEST_DURATION = 90 * 60; // 90 minutes
const RAILWAY_GROUP_D_MOCK_TEST_DURATION = 90 * 60; // 90 minutes

const TestView: React.FC<TestViewProps> = ({ questions, topic, onFinishTest, activeExamType, mode, durationInMinutes, currentTestTopicId }) => {
  const totalQuestions = questions.length;
  const testStartTimeRef = useRef<number>(Date.now());
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const isBankPrelimsMock = useMemo(() => topic.name.includes('Bank Prelims Full Mock Test'), [topic.name]);
  
  const rawSectionConfig = useMemo(() => {
    if (!isBankPrelimsMock) return null;
    const hasMultipleSections = questions.some(q => q.section);
    if (!hasMultipleSections) return null;

    type SectionData = { name: string; startIndex: number; endIndex: number; duration: number };
    const sections = questions.reduce((acc: {[key: string]: SectionData}, q, i) => {
        const sectionName = q.section || 'Unknown';
        if (!acc[sectionName]) {
            acc[sectionName] = { name: sectionName, startIndex: i, endIndex: i, duration: 20 * 60 };
        } else {
            acc[sectionName].endIndex = i;
        }
        return acc;
    }, {});
    
    return Object.values(sections).sort((a: SectionData, b: SectionData) => a.startIndex - b.startIndex);
  }, [isBankPrelimsMock, questions]);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(totalQuestions).fill(''));
  const [bookmarks, setBookmarks] = useState<boolean[]>(new Array(totalQuestions).fill(''));
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [justSelectedOption, setJustSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [direction, setDirection] = useState<'next' | 'previous'>('next');

  const { sections, sectionBoundaries, isSectionalTimer } = useMemo(() => {
    if (isBankPrelimsMock && rawSectionConfig) {
        return {
            sections: rawSectionConfig.map(s => s.name),
            sectionBoundaries: rawSectionConfig.map(s => ({ name: s.name, start: s.startIndex, end: s.endIndex, duration: s.duration })),
            isSectionalTimer: true,
        };
    }

    const sectionNames: string[] = [];
    questions.forEach(q => {
        if (q.section && !sectionNames.includes(q.section)) {
            sectionNames.push(q.section);
        }
    });

    if (sectionNames.length > 1) {
        const boundaries: {name: string; start: number; end: number; duration?: number}[] = [];
        sectionNames.forEach(sectionName => {
            const startIndex = questions.findIndex(q => q.section === sectionName);
            let endIndex = -1;
            for(let i = questions.length - 1; i >= startIndex; i--) {
                if (questions[i].section === sectionName) {
                    endIndex = i;
                    break;
                }
            }
            if (startIndex !== -1) {
                boundaries.push({ name: sectionName, start: startIndex, end: endIndex });
            }
        });
        return { sections: sectionNames, sectionBoundaries: boundaries, isSectionalTimer: false };
    }

    return { sections: [], sectionBoundaries: [], isSectionalTimer: false };
  }, [questions, isBankPrelimsMock, rawSectionConfig]);
  
  const activeSectionIndex = useMemo(() => {
    if (isSectionalTimer) return currentSectionIndex;
    if (sectionBoundaries.length > 0) {
      const index = sectionBoundaries.findIndex(b => currentQuestionIndex >= b.start && currentQuestionIndex <= b.end);
      return index > -1 ? index : 0;
    }
    return -1;
  }, [currentQuestionIndex, sectionBoundaries, isSectionalTimer, currentSectionIndex]);

  const handleFinish = useCallback(() => {
    const timeTakenInSeconds = Math.round((Date.now() - testStartTimeRef.current) / 1000);
    onFinishTest(userAnswers, bookmarks, timeTakenInSeconds);
  }, [onFinishTest, userAnswers, bookmarks, testStartTimeRef]);

  useEffect(() => {
    const getInitialTime = () => {
        if (isSectionalTimer && sectionBoundaries.length > 0) return sectionBoundaries[0].duration!;
        if (mode === 'test' && durationInMinutes) return durationInMinutes * 60;
        if (topic.name.includes('Full Mock Test (Prelims)')) return FULL_MOCK_TEST_DURATION;
        if (topic.name.includes('Bank Mains Full Mock Test')) return BANK_MAINS_MOCK_TEST_DURATION;
        if (topic.name.includes('Railway NTPC Mock Test')) return RAILWAY_NTPC_MOCK_TEST_DURATION;
        if (topic.name.includes('Railway Group D Mock Test')) return RAILWAY_GROUP_D_MOCK_TEST_DURATION;
        return totalQuestions * TEST_DURATION_PER_QUESTION;
    };
    setTimeLeft(getInitialTime());
  }, [topic.name, mode, durationInMinutes, totalQuestions, isSectionalTimer, sectionBoundaries]);

  useEffect(() => {
    try {
      if (mode === 'test') {
        const savedProgressRaw = localStorage.getItem('tnpsc-test-progress');
        const savedSessionRaw = localStorage.getItem('tnpsc-test-session');

        if (savedProgressRaw && savedSessionRaw) {
          const savedProgress = JSON.parse(savedProgressRaw) as TestProgress;
          const savedSession = JSON.parse(savedSessionRaw);
          
          if (savedSession.topic.name === topic.name) {
            setUserAnswers(savedProgress.userAnswers);
            setBookmarks(savedProgress.bookmarks || new Array(totalQuestions).fill(false));
            setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
            setTimeLeft(savedProgress.timeLeft);
            if (isSectionalTimer && savedProgress.currentSectionIndex !== undefined) {
              setCurrentSectionIndex(savedProgress.currentSectionIndex);
            }
          }
        }
      }
    } catch (e) { console.error("Failed to load test progress", e); localStorage.removeItem('tnpsc-test-progress'); }
  }, [topic.name, mode, isSectionalTimer, totalQuestions]);

  useEffect(() => {
    if (mode === 'test') {
        const sessionData = { topic, questions, durationInMinutes, testTopicId: currentTestTopicId };
        localStorage.setItem('tnpsc-test-session', JSON.stringify(sessionData));
    }
  }, [topic, questions, durationInMinutes, currentTestTopicId, mode]);
  
  useEffect(() => {
    if (mode === 'test') {
      const progress: TestProgress = { userAnswers, currentQuestionIndex, timeLeft, bookmarks, ...(isSectionalTimer && { currentSectionIndex }) };
      localStorage.setItem('tnpsc-test-progress', JSON.stringify(progress));
    }
  }, [userAnswers, currentQuestionIndex, timeLeft, mode, isSectionalTimer, currentSectionIndex, bookmarks]);

  const moveToNextSection = useCallback(() => {
    if (!isSectionalTimer) return;
    if (currentSectionIndex < sectionBoundaries.length - 1) {
        const nextIdx = currentSectionIndex + 1;
        setCurrentSectionIndex(nextIdx);
        setCurrentQuestionIndex(sectionBoundaries[nextIdx].start);
        setTimeLeft(sectionBoundaries[nextIdx].duration!);
    } else { handleFinish(); }
  }, [currentSectionIndex, sectionBoundaries, handleFinish, isSectionalTimer]);

  useEffect(() => {
    if (mode === 'practice' || timeLeft <= 0) return;
    if (timeLeft <= 1) {
        if (isSectionalTimer) moveToNextSection();
        else handleFinish();
        return;
    }
    const timerId = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, handleFinish, mode, isSectionalTimer, moveToNextSection]);

  const currentQuestion = questions[currentQuestionIndex];
  const attemptedCount = userAnswers.filter(answer => answer !== '').length;
  const unansweredCount = totalQuestions - attemptedCount;

  const { questionsInCurrentSection, currentQuestionInSectionIndex, currentSectionStartIndex } = useMemo(() => {
    if (sections.length > 0 && activeSectionIndex !== -1) {
        const currentBoundary = sectionBoundaries[activeSectionIndex];
        return {
            questionsInCurrentSection: currentBoundary.end - currentBoundary.start + 1,
            currentQuestionInSectionIndex: currentQuestionIndex - currentBoundary.start,
            currentSectionStartIndex: currentBoundary.start,
        };
    }
    return {
        questionsInCurrentSection: totalQuestions,
        currentQuestionInSectionIndex: currentQuestionIndex,
        currentSectionStartIndex: 0,
    };
  }, [sections, sectionBoundaries, activeSectionIndex, totalQuestions, currentQuestionIndex]);

  const progress = useMemo(() => {
      return totalQuestions > 0 ? (attemptedCount / totalQuestions) * 100 : 0;
  }, [attemptedCount, totalQuestions]);
  const progressData = useMemo(() => [{ name: 'progress', value: progress }], [progress]);
  const bookmarkedCount = useMemo(() => bookmarks.filter(b => b).length, [bookmarks]);
  
  const theme = {
    topicText: 'text-purple-400',
    border: 'border-white/10',
    optionSelectedBorder: 'border-purple-500',
    optionHover: 'hover:border-purple-500/70',
    optionCorrect: 'bg-green-500/20 border-green-500 text-green-200',
    optionIncorrect: 'bg-red-500/20 border-red-500 text-red-200',
    optionDisabled: 'bg-white/5 border-white/10 opacity-70 cursor-not-allowed',
    explanationBg: 'bg-purple-500/10',
    explanationIcon: 'text-purple-400',
  };

  useEffect(() => {
    const currentAnswer = userAnswers[currentQuestionIndex] || '';
    setSelectedOption(currentAnswer);
    setJustSelectedOption(null);
    setIsAnswerChecked(false);
  }, [currentQuestionIndex, userAnswers]);

  const handleOptionSelect = (option: string) => {
    if (mode === 'practice' && isAnswerChecked) return;
    setSelectedOption(option);
    setJustSelectedOption(option);
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = option;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setDirection('next');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection('previous');
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSectionChange = (sectionIndex: number) => {
    if (isSectionalTimer) return; // Cannot manually change section with sectional timers
    const boundary = sectionBoundaries[sectionIndex];
    if (boundary) {
        setCurrentQuestionIndex(boundary.start);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsAnswerChecked(true);
  }
  
  const handleToggleBookmark = () => {
    const newBookmarks = [...bookmarks];
    newBookmarks[currentQuestionIndex] = !newBookmarks[currentQuestionIndex];
    setBookmarks(newBookmarks);
  };

  const getOptionClasses = (option: string) => {
    const isSelected = selectedOption === option;
    const isJustSelected = justSelectedOption === option;
    let base = `w-full text-left p-4 my-2 rounded-xl border flex items-center justify-between apple-like-transition`;
    if (mode === 'practice' && isAnswerChecked) {
        const isCorrect = currentQuestion.correctOption === option;
        if (isCorrect) return `${base} ${theme.optionCorrect} cursor-default`;
        if (isSelected && !isCorrect) return `${base} ${theme.optionIncorrect} cursor-default`;
        return `${base} ${theme.optionDisabled}`;
    }
    if (isSelected) return `${base} bg-purple-500/10 font-semibold text-white ${theme.optionSelectedBorder} ${isJustSelected ? 'option-selected-animate' : ''}`;
    return `${base} bg-white/5 border-white/10 text-gray-200 ${theme.optionHover} cursor-pointer`;
  };
  
    const renderOptionIcon = (optionKey: string) => {
        const isSelected = selectedOption === optionKey;
        if (mode === 'practice' && isAnswerChecked) {
            const isCorrect = currentQuestion.correctOption === optionKey;
            if (isCorrect) return <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>;
            if (isSelected && !isCorrect) return <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" /></svg></div>;
            return <div className="w-7 h-7 rounded-full border-2 border-white/20 opacity-70"></div>;
        }
        if (isSelected) return <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center"><div className="w-3 h-3 bg-purple-400 rounded-full"></div></div>;
        return <div className="w-7 h-7 rounded-full border-2 border-white/20"></div>;
    };
    
  const renderQuestionTextWithTheme = (question: Question) => renderQuestionText(question, theme);
  
  const isAtSectionStart = isSectionalTimer && activeSectionIndex !== -1 && sectionBoundaries[activeSectionIndex]?.start === currentQuestionIndex;
  const isAtSectionEnd = isSectionalTimer && activeSectionIndex !== -1 && sectionBoundaries[activeSectionIndex]?.end === currentQuestionIndex;

  if (!currentQuestion) {
    return <Loader message="Loading question..." activeExamType={activeExamType} />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isFinishModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 modal-backdrop-animate">
            <div className="bg-[#13111c] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content-animate">
                <h3 className="text-xl font-bold text-white">Confirm Finish Test</h3>
                <p className="text-gray-300 mt-2">
                    Are you sure you want to end the test? You have {unansweredCount} unanswered questions.
                </p>
                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={() => setIsFinishModalOpen(false)} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={() => { setIsFinishModalOpen(false); handleFinish(); }} className="btn bg-red-600 hover:bg-red-700 text-white border-transparent">
                        Finish Test
                    </button>
                </div>
            </div>
        </div>
      )}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
          </defs>
      </svg>
      {sections.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 p-2 bg-black/20 rounded-xl border border-white/10">
            {sections.map((sectionName, index) => (
                <button
                    key={sectionName}
                    onClick={() => handleSectionChange(index)}
                    disabled={isSectionalTimer && index !== currentSectionIndex}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        index === activeSectionIndex
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-300 hover:bg-white/10'
                    } ${isSectionalTimer && index !== currentSectionIndex ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {sectionName}
                </button>
            ))}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 self-start">
              <div className="space-y-6">
                  {mode === 'test' && (
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/10 flex justify-center">
                        <CountdownTimer 
                            timeLeft={timeLeft} 
                            initialTime={(isSectionalTimer && sectionBoundaries[activeSectionIndex]?.duration) || (durationInMinutes ? durationInMinutes * 60 : totalQuestions * TEST_DURATION_PER_QUESTION)} 
                        />
                    </div>
                  )}
                  <div className="bg-black/20 p-6 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white text-center mb-4">Test Progress</h3>
                      <div className="relative w-48 h-48 mx-auto">
                          <ResponsiveContainer width="100%" height="100%">
                              <RadialBarChart innerRadius="85%" outerRadius="100%" data={progressData} startAngle={90} endAngle={-270} barSize={10}>
                                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                                  <RadialBar background={{ fill: 'rgba(255, 255, 255, 0.05)' }} dataKey="value" cornerRadius={5} fill="url(#progressGradient)" isAnimationActive={true} animationDuration={500}/>
                              </RadialBarChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="text-4xl font-bold text-purple-300">{progress.toFixed(0)}%</span>
                          </div>
                      </div>
                      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                          <div><p className="font-bold text-green-400 text-2xl">{attemptedCount}</p><p className="text-xs text-gray-400 font-semibold">Attempted</p></div>
                          <div><p className="font-bold text-gray-300 text-2xl">{unansweredCount}</p><p className="text-xs text-gray-400 font-semibold">Unanswered</p></div>
                          <div><p className="font-bold text-yellow-400 text-2xl">{bookmarkedCount}</p><p className="text-xs text-gray-400 font-semibold">Bookmarked</p></div>
                      </div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/10">
                      <h3 className="text-lg font-bold text-white text-center mb-4">Question Palette</h3>
                      <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-2">
                          {Array.from({ length: questionsInCurrentSection }, (_, i) => {
                              const questionIndex = currentSectionStartIndex + i;
                              const isAttempted = userAnswers[questionIndex] !== '';
                              const isBookmarked = bookmarks[questionIndex];
                              const isCurrent = questionIndex === currentQuestionIndex;
                              let paletteClass = 'bg-white/10 hover:bg-white/20'; // Unattempted
                              if (isAttempted) paletteClass = 'bg-green-500/30 hover:bg-green-500/50';
                              if (isBookmarked) paletteClass = 'bg-yellow-500/30 hover:bg-yellow-500/50';
                              return (
                                  <button key={questionIndex} onClick={() => setCurrentQuestionIndex(questionIndex)} className={`aspect-square rounded-md text-sm font-bold text-white transition-colors flex items-center justify-center ${paletteClass} ${isCurrent ? 'ring-2 ring-purple-300' : ''}`} aria-label={`Go to question ${i + 1}`}>
                                      {i + 1}
                                  </button>
                              );
                          })}
                      </div>
                       <div className="mt-4 space-y-2 text-xs text-gray-400 border-t border-white/10 pt-4">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500/30"></div> Attempted</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500/30"></div> Bookmarked</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white/10"></div> Unanswered</div>
                      </div>
                  </div>
                  {mode === 'test' && (
                    <div className="mt-6">
                        <button 
                            onClick={() => setIsFinishModalOpen(true)}
                            className="w-full btn bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-600/30 hover:shadow-red-600/40"
                        >
                            Finish Test
                        </button>
                    </div>
                  )}
              </div>
          </aside>
          <main className="lg:col-span-8 xl:col-span-9">
              {currentQuestion.commonContext && (
                  <div className="mb-6 p-6 bg-black/20 rounded-2xl border border-white/10">
                      <h3 className={`text-lg font-bold mb-4 ${theme.topicText}`}>Context</h3>
                      {currentQuestion.commonContextDiagramSvg && <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-full mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: currentQuestion.commonContextDiagramSvg }} />}
                      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">{renderTextWithMarkdown(currentQuestion.commonContext)}</div>
                  </div>
              )}
              <div className={`bg-black/20 rounded-2xl shadow-xl border ${theme.border} overflow-hidden`}>
                  <div className="p-8 question-container">
                      <div key={currentQuestionIndex} className={direction === 'next' ? 'question-enter-next' : 'question-enter-prev'}>
                          <div className="flex justify-between items-start mb-6">
                              <div className="flex-grow min-w-0">
                                  <p className={`text-sm font-semibold ${theme.topicText}`}>{sections[activeSectionIndex] || topic.unit}</p>
                                  <h2 className="text-xl font-bold text-gray-100 truncate">{topic.name}</h2>
                              </div>
                              <div className="flex-shrink-0 ml-4 flex items-center gap-2">
                                  <button onClick={handleToggleBookmark} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Toggle bookmark">
                                      {bookmarks[currentQuestionIndex] ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                                  </button>
                              </div>
                          </div>
                          <div className="mb-8">{renderQuestionTextWithTheme(currentQuestion)}{currentQuestion.isPYQ && <span className="text-xs font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full ml-2">PYQ</span>}</div>
                          <div>{Object.entries(currentQuestion.options).map(([key, value]) => <button key={key} onClick={() => handleOptionSelect(key)} className={getOptionClasses(key)} aria-pressed={selectedOption === key}><div className="flex items-start pr-4"><span className="font-bold mr-3">{key}.</span><span>{renderTextWithMarkdown(value as string)}</span></div><div className="flex-shrink-0 ml-2">{renderOptionIcon(key)}</div></button>)}</div>
                          {mode === 'practice' && isAnswerChecked && <div className="mt-6 explanation-animate"><div className={`p-4 rounded-lg ${theme.explanationBg}`}><div className="flex items-center gap-2 mb-3"><svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme.explanationIcon}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg><h5 className="font-bold text-white">Explanation</h5></div><div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">{renderTextWithMarkdown(currentQuestion.explanation)}</div></div></div>}
                      </div>
                  </div>
                  <div className="bg-black/20 px-8 py-4 border-t border-white/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0 || isAtSectionStart} className="btn btn-secondary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Go to previous question">Previous</button>
                          {mode === 'practice' ? (
                                isAnswerChecked ? (
                                    <button onClick={handleNext} className="btn btn-primary w-full text-lg" disabled={currentQuestionIndex === totalQuestions - 1}>Next</button>
                                ) : (
                                    <button onClick={handleCheckAnswer} disabled={!selectedOption} className="btn btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed">Check Answer</button>
                                )
                          ) : (
                            <button onClick={handleNext} className={`btn w-full text-lg ${!selectedOption ? 'btn-secondary' : 'btn-primary'}`} disabled={currentQuestionIndex === totalQuestions - 1 || isAtSectionEnd}>Save & Next</button>
                          )}
                      </div>
                  </div>
              </div>
          </main>
      </div>
    </div>
  );
};

export default TestView;
