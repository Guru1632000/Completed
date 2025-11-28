

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
  onDownloadPdf: (result: TestResult, options?: { showScore?: boolean }) => void;
}

// FIX: Changed component to a default exported function. This is a common pattern and can help resolve obscure module resolution errors related to default exports.
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
      // FIX: Added missing 'topicText' property required by the renderQuestionText utility function.
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
    if (questions.some(q => q.section)) {
        const sections: { [key: string]: { correct: number, incorrect: number, unanswered: number } } = {};
        questions.forEach((q, index) => {
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
                        labelStyle={{ color: '#e