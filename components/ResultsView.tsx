import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    RadialBarChart, RadialBar, PolarAngleAxis 
} from 'recharts';
import { TestResult, Question, MissedQuestion, ExamType, Topic, Difficulty } from '../types';
import StudyPlanView from './StudyPlanView';
import { RetryQuestionModal } from './RetryQuestionModal';
import { renderTextWithMarkdown, renderQuestionText } from './utils';

interface ResultsViewProps {
  result: TestResult;
  onTryAgain: () => void;
  onGoBack?: () => void;
  frequentlyMissedQuestions: MissedQuestion[];
  activeExamType: ExamType;
  onStartPracticeTest: (topic: Topic, numQuestions: number, difficulty: Difficulty) => void;
  onUpdateResult: (result: TestResult) => void;
  onDownloadPdf: (result: TestResult) => void;
}

export default function ResultsView({ result, onTryAgain, onGoBack, frequentlyMissedQuestions, activeExamType, onStartPracticeTest, onUpdateResult, onDownloadPdf }: ResultsViewProps) {
  const { questions, userAnswers, score, correctCount, totalCount, topic, incorrectCount, marks, totalMarks } = result;
  const [animatedScore, setAnimatedScore] = useState(0); // For text animation
  const [chartScore, setChartScore] = useState(0); // For the chart bar animation
  const scoreRef = useRef<HTMLDivElement>(null);
  const animationTriggered = useRef(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const [questionToRetry, setQuestionToRetry] = useState<Question | null>(null);
  const isRetryModalOpen = !!questionToRetry;

  const themeColor = {
      gradientId: 'scoreGradient',
      gradientStart: '#c084fc', // purple-400
      gradientEnd: '#7e22ce',   // purple-700
      trackColor: 'rgba(126, 34, 206, 0.15)',
      text: 'text-purple-400',
      topicText: 'text-purple-400',
      background: 'bg-violet-500/10',
      backgroundRaw: 'rgba(139, 92, 246, 0.1)',
      explanationBg: 'bg-violet-500/10',
      explanationIcon: 'text-violet-400',
      barGradientId: 'barGradient',
      barGradientStart: '#8b5cf6', // violet-500
      barGradientEnd: '#c4b5fd', // violet-300
      tooltipCursor: 'rgba(139, 92, 246, 0.2)',
  };

  const scoreData = useMemo(() => [{ name: 'score', value: chartScore }], [chartScore]);
  const unansweredCount = totalCount - correctCount - incorrectCount;

  useEffect(() => {
    const currentRef = scoreRef.current;
    if (!currentRef) return;

    // Reset animation state when result changes
    animationTriggered.current = false;
    setAnimatedScore(0);
    setChartScore(0);
    if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !animationTriggered.current) {
                animationTriggered.current = true;
                setChartScore(score); // Trigger the bar animation

                let startTimestamp: number | null = null;
                const duration = 1500;
                const endValue = score;

                const step = (timestamp: number) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    const currentValue = easedProgress * endValue;
                    
                    setAnimatedScore(currentValue);

                    if (progress < 1) {
                        animationFrameIdRef.current = requestAnimationFrame(step);
                    } else {
                        setAnimatedScore(endValue);
                    }
                };
                animationFrameIdRef.current = requestAnimationFrame(step);
                observer.unobserve(currentRef);
            }
        },
        { threshold: 0.5 }
    );

    observer.observe(currentRef);

    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
        if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
        }
    };
  }, [result.id, score]);

  const handleFeedback = (questionIndex: number, feedbackValue: 'good' | 'bad') => {
    const newFeedback = [...(result.feedback || new Array(result.questions.length).fill(null))];
    
    // Toggle feedback: if same button is clicked again, reset to null
    newFeedback[questionIndex] = newFeedback[questionIndex] === feedbackValue ? null : feedbackValue;

    const updatedResult = {
        ...result,
        feedback: newFeedback,
    };

    onUpdateResult(updatedResult);
  };

  const performanceData = useMemo(() => {
    if (questions.some(q => q && q.section)) {
        const sections: { [key: string]: { correct: number, incorrect: number, unanswered: number } } = {};
        questions.forEach((q, index) => {
            if (!q) return;
            const sectionName = q.section || 'Uncategorized';
            if (!sections[sectionName]) {
                sections[sectionName] = { correct: 0, incorrect: 0, unanswered: 0 };
            }
            const userAnswer = userAnswers[index];
            if (userAnswer === '') {
                sections[sectionName].unanswered++;
            } else if (q.correctOption === userAnswer) {
                sections[sectionName].correct++;
            } else {
                sections[sectionName].incorrect++;
            }
        });

        const sortedData = Object.entries(sections).map(([name, data]) => ({
            name,
            correct: data.correct,
            incorrect: data.incorrect,
            unanswered: data.unanswered,
        }));

        if (topic.name === 'Full Mock Test (Prelims)') {
           return sortedData.sort((a, b) => {
              const order = ['General English', 'General Studies', 'Maths'];
              return order.indexOf(a.name) - order.indexOf(b.name);
           });
        }
        return sortedData.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Fallback for tests without sections
    const correct = correctCount;
    const incorrect = incorrectCount;
    const unanswered = totalCount - correct - incorrect;
    const shortUnitName = topic.unit.split(':')[0];
    return [{ name: shortUnitName, correct, incorrect, unanswered }];
  }, [topic, questions, userAnswers, correctCount, incorrectCount, totalCount]);
  
  let lastRenderedContext: string | null = null;
  let lastRenderedFocusContext: string | null = null;
  
  const getMarkingScheme = () => {
      if (result.examType === 'Bank Exam') return <span>Marking Scheme: +1 for correct, -0.25 for incorrect.</span>;
      if (result.examType === 'Railway') return <span>Marking Scheme: +1 for correct, -1/3 for incorrect.</span>;
      if (result.examType === 'SSC') {
        const isTier1 = result.topic.name.toLowerCase().includes('tier-1');
        const marksPerQuestion = isTier1 ? 2 : 3;
        return <span>Marking Scheme: +{marksPerQuestion} for correct, -0.50 for incorrect.</span>;
      }
      return <span>Marking Scheme: +1 for correct. No negative marking.</span>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
              <linearGradient id={themeColor.barGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColor.barGradientStart} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={themeColor.barGradientEnd} stopOpacity={0.8}/>
              </linearGradient>
              <linearGradient id={themeColor.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={themeColor.gradientStart} />
                <stop offset="100%" stopColor={themeColor.gradientEnd} />
              </linearGradient>
          </defs>
      </svg>
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/20 p-6 md:p-8 rounded-2xl shadow-xl border border-white/10 text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Test Complete!</h2>
          <p className="mt-2 text-gray-400">Here's your performance analysis.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center">
               <div ref={scoreRef} className="relative w-80 h-80">
                <ResponsiveContainer>
                  <RadialBarChart
                    innerRadius="80%"
                    outerRadius="100%"
                    data={scoreData}
                    startAngle={90}
                    endAngle={-270}
                    barSize={20}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar 
                        background={{ fill: themeColor.trackColor }} 
                        dataKey="value" 
                        cornerRadius={10} 
                        fill={`url(#${themeColor.gradientId})`}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={`text-8xl font-bold ${themeColor.text}`}>
                    {animatedScore.toFixed(0)}%
                  </span>
                </div>
              </div>
               <div className="mt-4 w-full px-4">
                  <div className="grid grid-cols-3 gap-2 text-center border-b border-white/10 pb-4 mb-4">
                      <div>
                          <p className="font-bold text-green-400 text-3xl">{correctCount}</p>
                          <p className="text-sm text-gray-400 font-semibold">Correct</p>
                      </div>
                      <div>
                          <p className="font-bold text-red-400 text-3xl">{incorrectCount}</p>
                          <p className="text-sm text-gray-400 font-semibold">Incorrect</p>
                      </div>
                      <div>
                          <p className="font-bold text-gray-300 text-3xl">{unansweredCount}</p>
                          <p className="text-sm text-gray-400 font-semibold">Unanswered</p>
                      </div>
                  </div>
                  <div className="text-center">
                      <p className="text-sm font-semibold text-gray-400">Total Marks Obtained</p>
                      <p className={`text-4xl font-extrabold ${themeColor.text}`}>
                          {marks.toFixed(2)}
                          <span className="text-2xl text-gray-400 font-semibold"> / {totalMarks.toFixed(2)}</span>
                      </p>
                      <div className="mt-2 flex items-center justify-center text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {getMarkingScheme()}
                      </div>
                  </div>
              </div>
            </div>
            <div className="w-full h-80">
              <h3 className="text-xl font-bold text-white text-center mb-4">
                 Performance by Section
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart 
                    data={performanceData} 
                    layout="vertical" 
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                 >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100} 
                        tick={{ fill: '#d1d5db', fontSize: 12 }} 
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{fill: themeColor.tooltipCursor}}
                        contentStyle={{ background: 'rgba(13, 12, 21, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem', backdropFilter: 'blur(4px)' }}
                        labelStyle={{ color: '#e5e7eb', fontWeight: 'bold' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Bar dataKey="correct" stackId="a" name="Correct" fill="#22c55e" />
                    <Bar dataKey="incorrect" stackId="a" name="Incorrect" fill="#ef4444" />
                    <Bar dataKey="unanswered" stackId="a" name="Unanswered" fill="#6b7280" />
                 </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-8 text-center flex justify-center items-center gap-4">
             {onGoBack && (
                 <button onClick={onGoBack} className="btn btn-secondary text-base">
                    &larr; Back to History
                 </button>
             )}
            <button onClick={() => onDownloadPdf(result)} className="btn btn-secondary text-base inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download PDF
            </button>
            <button onClick={onTryAgain} className="btn btn-primary text-base">
              {onGoBack ? 'Home' : 'Take Another Test'}
            </button>
          </div>
        </div>

        {performanceData.length > 1 && (
            <div className="my-12">
                <h3 className="text-2xl font-bold text-white mb-6">Section-wise Breakdown</h3>
                <div className="space-y-4">
                    {performanceData.map((section, index) => {
                        const totalAnswered = section.correct + section.incorrect;
                        const accuracy = totalAnswered > 0 ? (section.correct / totalAnswered) * 100 : 0;
                        return (
                            <div key={index} className="bg-black/20 p-4 rounded-xl border border-white/10 item-animated-entry" style={{ animationDelay: `${index * 100}ms` }}>
                                <h4 className="font-bold text-lg text-white">{section.name}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-center">
                                    <div>
                                        <p className="font-bold text-green-400 text-2xl">{section.correct}</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">Correct</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-red-400 text-2xl">{section.incorrect}</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">Incorrect</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-300 text-2xl">{section.unanswered}</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">Unanswered</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-purple-400 text-2xl">{accuracy.toFixed(0)}%</p>
                                        <p className="text-xs text-gray-400 font-semibold uppercase">Accuracy</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        <div>
            <StudyPlanView 
              result={result}
              frequentlyMissedQuestions={frequentlyMissedQuestions}
              onStartPracticeTest={onStartPracticeTest}
            />
        </div>
        
        {frequentlyMissedQuestions && frequentlyMissedQuestions.length > 0 && (
          <div className="my-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${themeColor.text}`} viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
              </svg>
              Focus Area: Your Most Missed Questions
            </h3>
            <div className="space-y-6">
              {frequentlyMissedQuestions.map(({ question, missedCount }, index) => {
                 if (!question) return null;
                 const shouldRenderFocusContext = question.commonContext && question.commonContext !== lastRenderedFocusContext;
                 if (shouldRenderFocusContext) {
                    lastRenderedFocusContext = question.commonContext!;
                 }

                 return (
                    <div key={`focus-${index}`}>
                        {shouldRenderFocusContext && (
                            <div className="p-4 mb-6 bg-black/20 rounded-xl border border-white/10">
                                <h4 className="text-md font-bold text-gray-300 mb-2">Common Context:</h4>
                                {question.commonContextDiagramSvg && (
                                    <div className="my-2 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: question.commonContextDiagramSvg }} />
                                )}
                                <div className="text-gray-300 prose prose-sm prose-invert max-w-none">
                                    {renderTextWithMarkdown(question.commonContext)}
                                </div>
                            </div>
                        )}
                        <div className="bg-black/20 rounded-2xl shadow-lg border border-white/10">
                          <div className="p-6">
                            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </div>
                                <h4 className="text-lg font-bold text-white">Focus Question</h4>
                              </div>
                              <span className="text-xs font-bold bg-red-500/20 text-red-300 px-2 py-1 rounded-full whitespace-nowrap">
                                  Missed {missedCount} time{missedCount > 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="font-semibold text-gray-200 mb-3">
                                {renderQuestionText(question, themeColor)}
                            </div>

                            <div className="mt-4 p-4 bg-black/30 rounded-lg">
                              <p className="font-semibold text-gray-300 mb-2">
                                  Correct Answer: <span className="text-green-400 font-bold">{question.correctOption}. {renderTextWithMarkdown(question.options[question.correctOption as keyof typeof question.options] as string)}</span>
                              </p>
                              <p className="font-bold text-white mt-3">Explanation:</p>
                              {question.explanationDiagramSvg && (
                                  <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: question.explanationDiagramSvg }} />
                              )}
                              <div className="text-gray-300 prose prose-sm prose-invert max-w-none">
                                  {question.explanation ? renderTextWithMarkdown(question.explanation) : <p className="italic text-gray-500">Explanation not available.</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                 );
              })}
            </div>
          </div>
        )}

        <div className="mt-12">
           <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${themeColor.text}`} viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
              Detailed Question Analysis
           </h3>
           <div className="space-y-8">
              {questions.map((question, index) => {
                if (!question) return null;
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctOption;
                const isIncorrect = userAnswer !== '' && !isCorrect;
                
                const shouldRenderContext = question.commonContext && question.commonContext !== lastRenderedContext;
                if (shouldRenderContext) {
                    lastRenderedContext = question.commonContext!;
                }

                return (
                  <div key={index}>
                    {shouldRenderContext && (
                        <div className="p-6 mb-6 bg-black/20 rounded-2xl border border-white/10 shadow-sm">
                            <h4 className="text-md font-bold text-gray-300 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h1z" /></svg>
                              Common Context for the following questions:
                            </h4>
                             {question.commonContextDiagramSvg && (
                                <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: question.commonContextDiagramSvg }} />
                            )}
                            <div className="text-gray-300 prose prose-sm prose-invert max-w-none">
                                {renderTextWithMarkdown(question.commonContext)}
                            </div>
                        </div>
                    )}
                    <div className="bg-black/20 rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                        <div className="p-6">
                           <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg text-white ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {index + 1}
                                  </div>
                                  <h4 className="text-lg font-bold text-white">Question {index + 1}</h4>
                              </div>
                              <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {isCorrect ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        Correct
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                        Incorrect
                                    </>
                                )}
                              </span>
                            </div>

                            <div className="font-semibold text-gray-200 mb-4">{renderQuestionText(question, themeColor)}</div>
                            <div className="space-y-2">
                                {Object.entries(question.options).map(([key, value]) => {
                                    const isUserAnswer = userAnswer === key;
                                    const isCorrectAnswer = question.correctOption === key;

                                    let optionStyle = 'bg-black/20 text-gray-500 border-transparent opacity-60';
                                    let icon = null;

                                    if (isCorrectAnswer) {
                                        optionStyle = 'bg-green-500/10 text-green-200 border-green-500/30 font-semibold';
                                        icon = (
                                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                        );
                                    } else if (isUserAnswer) { // This condition implies !isCorrectAnswer
                                        optionStyle = 'bg-red-500/10 text-red-200 border-red-500/30 font-semibold';
                                        icon = (
                                            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-300" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={key} className={`p-3 rounded-lg flex items-center gap-3 border transition-opacity duration-300 ${optionStyle}`}>
                                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                                                {icon}
                                            </div>
                                            <div className="font-bold text-sm flex-shrink-0">{key}.</div>
                                            <div className="text-base flex-grow">{renderTextWithMarkdown(value as string)}</div>
                                            {isUserAnswer && <span className="ml-auto text-xs font-bold text-gray-400 flex-shrink-0 pl-2">(Your Answer)</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6">
                                <div className={`p-4 rounded-lg ${themeColor.explanationBg}`}>
                                  <div className="flex items-center gap-2 mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${themeColor.explanationIcon}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <h5 className="font-bold text-white">Explanation</h5>
                                  </div>
                                  {question.explanationDiagramSvg && (
                                      <div className="my-4 p-4 border rounded-lg bg-black/20 overflow-x-auto flex justify-center max-w-sm mx-auto diagram-container" dangerouslySetInnerHTML={{ __html: question.explanationDiagramSvg }} />
                                  )}
                                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                                      {question.explanation ? renderTextWithMarkdown(question.explanation) : <p className="italic text-gray-500">Explanation not available.</p>}
                                  </div>
                                </div>
                            </div>
                            
                            {isIncorrect && (
                                <div className="mt-4 text-right">
                                    <button 
                                        onClick={() => setQuestionToRetry(question)}
                                        className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 12A8 8 0 1012 4" /></svg>
                                        Retry Question
                                    </button>
                                </div>
                            )}

                            <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-end gap-2">
                                <p className="text-sm text-gray-400 mr-2">Was this explanation helpful?</p>
                                <button onClick={() => handleFeedback(index, 'good')} className={`p-2 rounded-full transition-colors ${result.feedback?.[index] === 'good' ? 'bg-green-500/20 text-green-300' : 'hover:bg-green-500/10'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.758a1 1 0 00.97-1.22l-1.93-6.435a1 1 0 00-.97-.775H9V5.333a1 1 0 00-1-1h-.333a1 1 0 00-1 1v5z" /></svg>
                                </button>
                                <button onClick={() => handleFeedback(index, 'bad')} className={`p-2 rounded-full transition-colors ${result.feedback?.[index] === 'bad' ? 'bg-red-500/20 text-red-300' : 'hover:bg-red-500/10'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1h-6.758a1 1 0 00-.97 1.22l1.93 6.435a1 1 0 00.97.775H11v4.667a1 1 0 001 1h.333a1 1 0 001-1v-5z" /></svg>
                                </button>
                            </div>

                        </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
      <RetryQuestionModal
        isOpen={isRetryModalOpen}
        onClose={() => setQuestionToRetry(null)}
        questionToRetry={questionToRetry}
        testDifficulty={result.difficulty}
        examType={result.examType}
      />
    </div>
  );
}
