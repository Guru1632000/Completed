

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { TestResult, TestTopic, ExamType, DashboardCoachSummary } from '../types';
import { generateDashboardCoachSummary } from '../services/aiService';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import StudyActivityHeatmap from './StudyActivityHeatmap';
import Leaderboard from './Leaderboard';
import HexagonPerformanceChart from './HexagonPerformanceChart';

interface DashboardViewProps {
    history: TestResult[];
    testTopics: TestTopic[];
}

const TabGroup: React.FC<{
  items: { id: string; label: string; disabled?: boolean }[];
  activeItem: string;
  onItemChange: (id: string) => void;
  sliderClass: string;
  activeButtonClass: string;
  inactiveButtonClass: string;
  ringClass: string;
}> = ({ items, activeItem, onItemChange, sliderClass, activeButtonClass, inactiveButtonClass, ringClass }) => {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });

    useEffect(() => {
        const activeTabIndex = items.findIndex(item => item.id === activeItem);
        const activeTabElement = tabRefs.current[activeTabIndex];
        
        if (activeTabElement) {
            setSliderStyle({
                left: activeTabElement.offsetLeft,
                width: activeTabElement.offsetWidth,
                opacity: 1,
            });
        }
    }, [activeItem, items]);

    return (
        <div className="relative bg-black/20 p-1 rounded-xl inline-flex items-center space-x-1 overflow-x-auto no-scrollbar">
            <div 
                className={`absolute top-1 bottom-1 rounded-lg apple-like-transition ${sliderClass}`}
                style={{ left: sliderStyle.left, width: sliderStyle.width, opacity: sliderStyle.opacity }}
            />
            {items.map((item, index) => (
                <button
                    ref={el => { tabRefs.current[index] = el; }}
                    key={item.id}
                    onClick={() => onItemChange(item.id)}
                    disabled={item.disabled}
                    className={`relative z-10 py-2 px-4 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 ${activeItem === item.id ? activeButtonClass : inactiveButtonClass} ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${ringClass}`}
                    aria-current={activeItem === item.id ? 'page' : undefined}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; colorClass: string, animationDelay: string }> = ({ title, value, icon, colorClass, animationDelay }) => (
    <div className={`bg-slate-900/70 p-6 rounded-2xl border border-white/10 stat-card animate-in`} style={{ animationDelay }}>
        <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-gray-400">{title}</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                {icon}
            </div>
        </div>
        <p className="text-4xl font-bold text-white mt-2">{value}</p>
    </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ history, testTopics }) => {
    const [activeExamFilter, setActiveExamFilter] = useState<ExamType | 'All'>('All');
    const [coachSummary, setCoachSummary] = useState<DashboardCoachSummary | null>(null);
    const [isCoachLoading, setIsCoachLoading] = useState(false);
    const [coachError, setCoachError] = useState<string | null>(null);

    const availableExams = useMemo(() => {
        const exams = new Set<ExamType>();
        history.forEach(r => exams.add(r.examType));
        testTopics.forEach(t => exams.add(t.examType));
        return Array.from(exams).sort();
    }, [history, testTopics]);

    const filteredHistory = useMemo(() => {
        if (activeExamFilter === 'All') {
            return history;
        }
        return history.filter(r => r.examType === activeExamFilter);
    }, [history, activeExamFilter]);

    // FIX: Filter test topics by the active exam filter.
    const filteredTestTopics = useMemo(() => {
        if (activeExamFilter === 'All') {
            return testTopics;
        }
        return testTopics.filter(t => t.examType === activeExamFilter);
    }, [testTopics, activeExamFilter]);

    useEffect(() => {
        if (filteredHistory.length >= 2) {
            setIsCoachLoading(true);
            setCoachError(null);
            generateDashboardCoachSummary(filteredHistory)
                .then(summary => setCoachSummary(summary))
                .catch(err => {
                    setCoachError("Could not load AI Coach tip.");
                    console.error(err);
                })
                .finally(() => setIsCoachLoading(false));
        } else {
            setCoachSummary(null);
            setIsCoachLoading(false);
            setCoachError(null);
        }
    }, [filteredHistory]);

    const { avgScore, accuracy, totalTests, totalQuestions, totalStudyTimeDisplay } = useMemo(() => {
        const totalTests = filteredHistory.length;
        if (totalTests === 0) {
            return { avgScore: 0, accuracy: 0, totalTests: 0, totalQuestions: 0, totalStudyTimeDisplay: '0h 0m' };
        }
        const totalScore = filteredHistory.reduce((acc, r) => acc + (r.score || 0), 0);
        const avgScore = totalScore / totalTests;
        const totalCorrect = filteredHistory.reduce((acc, r) => acc + (r.correctCount || 0), 0);
        const totalAttempted = filteredHistory.reduce((acc, r) => acc + (r.correctCount || 0) + (r.incorrectCount || 0), 0);
        const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
        const totalQuestions = filteredHistory.reduce((acc, r) => acc + (r.totalCount || 0), 0);

        const totalStudyTimeInSeconds = filteredHistory.reduce((acc, r) => acc + (r.timeTakenInSeconds || 0), 0);
        const hours = Math.floor(totalStudyTimeInSeconds / 3600);
        const minutes = Math.floor((totalStudyTimeInSeconds % 3600) / 60);
        const totalStudyTimeDisplay = `${hours}h ${minutes}m`;

        return { avgScore, accuracy, totalTests, totalQuestions, totalStudyTimeDisplay };
    }, [filteredHistory]);
    
    const { testsGenerated, questionsAvailable } = useMemo(() => {
        const readyTopics = filteredTestTopics.filter(t => t.generationStatus === 'completed' && t.generatedQuestions && t.generatedQuestions.length > 0);
        const testsGenerated = readyTopics.length;
        const questionsAvailable = readyTopics.reduce((acc, t) => acc + (t.generatedQuestions?.length || 0), 0);
        return { testsGenerated, questionsAvailable };
    }, [filteredTestTopics]);

    const scoreOverTime = useMemo(() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const dataByDay: { [key: string]: { scores: number[]; count: number } } = {};

        filteredHistory.forEach(result => {
            const dateStr = new Date(result.date).toISOString().split('T')[0];
            if (last30Days.includes(dateStr)) {
                if (!dataByDay[dateStr]) {
                    dataByDay[dateStr] = { scores: [], count: 0 };
                }
                dataByDay[dateStr].scores.push(result.score);
                dataByDay[dateStr].count++;
            }
        });

        return last30Days.map(dateStr => {
            const date = new Date(dateStr);
            const dayData = dataByDay[dateStr];
            return {
                date: `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`,
                'Avg Score': dayData ? dayData.scores.reduce((a, b) => a + b, 0) / dayData.count : null,
                'Tests Taken': dayData ? dayData.count : 0
            };
        });
    }, [filteredHistory]);

    const topicPerformance = useMemo(() => {
        const topicStats = new Map<string, { correct: number; total: number }>();
        filteredHistory.forEach(r => {
            r.questions.forEach((q, i) => {
                const topicName = q.questionSubtype || q.section || r.topic.name;
                if (!topicName || topicName.trim() === '') return;
                const stats = topicStats.get(topicName) || { correct: 0, total: 0 };
                stats.total++;
                if (r.userAnswers[i] === q.correctOption) stats.correct++;
                topicStats.set(topicName, stats);
            });
        });
        
        return Array.from(topicStats.entries())
            .map(([name, data]) => ({ name, size: data.total, score: data.total > 0 ? (data.correct / data.total) * 100 : 0 }))
            .filter(t => t.size > 3)
            .sort((a,b) => b.size - a.size)
            .slice(0, 19);
    }, [filteredHistory]);

     const topTopics = useMemo(() => {
        return [...topicPerformance]
            .sort((a,b) => b.score - a.score)
            .slice(0, 5)
            .map((topic, index) => ({
                rank: index + 1,
                title: topic.name,
                value: `${topic.score.toFixed(0)}%`,
                valueLabel: `(${topic.size} Qs)`,
            }));
    }, [topicPerformance]);


    if (history.length === 0 && testTopics.length === 0) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-white">Dashboard is Empty</h2>
                <p className="mt-4 text-lg text-gray-400">Complete a test to get started.</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 item-animated-entry">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">My Dashboard</h1>

            {availableExams.length > 0 && (
                 <div className="mb-8 flex justify-center">
                    <TabGroup
                        items={[{ id: 'All', label: 'All' }, ...availableExams.map(exam => ({ id: exam, label: exam }))]}
                        activeItem={activeExamFilter}
                        onItemChange={(id) => setActiveExamFilter(id as ExamType | 'All')}
                        sliderClass="bg-white/5"
                        activeButtonClass="text-white"
                        inactiveButtonClass="text-gray-400 hover:text-white"
                        ringClass="focus:ring-purple-500"
                    />
                </div>
            )}
            
            {filteredHistory.length === 0 && (testsGenerated === 0 || activeExamFilter === 'All') ? (
                <div className="text-center py-24 bg-slate-900/70 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white">No Completed Tests for {activeExamFilter}</h2>
                    <p className="mt-2 text-gray-400">Complete a test for this exam type to see your dashboard.</p>
                </div>
            ) : filteredHistory.length === 0 && testsGenerated > 0 ? (
                 <div className="text-center py-16 bg-slate-900/70 rounded-2xl border border-white/10">
                    <h2 className="text-2xl font-bold text-white">Analysis for {activeExamFilter} Locked</h2>
                    <p className="mt-2 text-gray-400 max-w-xl mx-auto">Complete a test for this exam to unlock your detailed performance dashboard.</p>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
                        <StatCard title="Tests Generated" value={`${testsGenerated}`} colorClass="bg-sky-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} animationDelay="100ms" />
                        <StatCard title="Questions to Practice" value={`${questionsAvailable}`} colorClass="bg-amber-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} animationDelay="200ms" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <StatCard title="Average Score" value={`${avgScore.toFixed(1)}%`} colorClass="bg-purple-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>} animationDelay="100ms" />
                        <StatCard title="Overall Accuracy" value={`${accuracy.toFixed(1)}%`} colorClass="bg-green-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} animationDelay="200ms" />
                        <StatCard title="Tests Taken" value={`${totalTests}`} colorClass="bg-sky-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} animationDelay="300ms" />
                        <StatCard title="Questions Practiced" value={`${totalQuestions}`} colorClass="bg-amber-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} animationDelay="400ms" />
                        <StatCard title="Total Study Time" value={totalStudyTimeDisplay} colorClass="bg-indigo-500/20" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} animationDelay="500ms" />
                    </div>
                    
                     { (isCoachLoading || coachSummary || coachError) && (
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800/50 p-6 rounded-2xl border border-purple-500/30 shadow-lg item-animated-entry mb-8">
                            <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                AI Coach Quick-Tip
                            </h3>
                            {isCoachLoading ? (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-purple-400"></div>
                                    Analyzing your performance...
                                </div>
                            ) : coachError ? (
                                <p className="text-red-400">{coachError}</p>
                            ) : coachSummary ? (
                                <div className="space-y-4">
                                    <p className="text-gray-200 text-lg">{coachSummary.greeting} {coachSummary.one_line_summary}</p>
                                    <div>
                                        <p className="font-semibold text-purple-300">Tip for Today:</p>
                                        <p className="text-gray-300">{coachSummary.tip_for_today}</p>
                                    </div>
                                    <blockquote className="border-l-4 border-purple-500/50 pl-4 italic text-gray-400">
                                        "{coachSummary.motivational_quote}"
                                    </blockquote>
                                </div>
                            ) : null}
                        </div>
                    )}

                    <StudyActivityHeatmap history={filteredHistory} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        <div className="bg-slate-900/70 p-6 rounded-2xl border border-white/10 h-[450px] flex flex-col item-animated-entry" style={{ animationDelay: '600ms' }}>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Performance Hotspots</h3>
                                <p className="text-sm text-gray-400 mb-4">Topic accuracy visualized. Color indicates score, from dark purple (low) to light lavender (high).</p>
                            </div>
                            <div className="flex-grow min-h-0">
                                <HexagonPerformanceChart data={topicPerformance} />
                            </div>
                        </div>

                        <div className="h-[450px] item-animated-entry" style={{ animationDelay: '700ms' }}>
                             <Leaderboard items={topTopics} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardView;
