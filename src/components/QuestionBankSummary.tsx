import React, { useMemo, useState, useEffect } from 'react';
import { TestTopic, ExamType } from '../types';

interface QuestionBankSummaryProps {
    testTopics: TestTopic[];
}

const QuestionBankSummary: React.FC<QuestionBankSummaryProps> = ({ testTopics }) => {
    const summary = useMemo(() => {
        const summaryData: {
            [exam in ExamType]?: { [topic: string]: number }
        } = {};

        testTopics.forEach(topic => {
            if (topic.generationStatus === 'completed' && topic.generatedQuestions) {
                topic.generatedQuestions.forEach(q => {
                    const exam = topic.examType;
                    const subtype = q.questionSubtype || q.section || 'Uncategorized';

                    if (!summaryData[exam]) {
                        summaryData[exam] = {};
                    }
                    if (!summaryData[exam]![subtype]) {
                        summaryData[exam]![subtype] = 0;
                    }
                    summaryData[exam]![subtype]++;
                });
            }
        });

        const sortedSummary: {
            [exam in ExamType]?: { topic: string; count: number }[]
        } = {};

        for (const exam in summaryData) {
            if (Object.prototype.hasOwnProperty.call(summaryData, exam)) {
                sortedSummary[exam as ExamType] = Object.entries(summaryData[exam as ExamType]!)
                    .map(([topic, count]) => ({ topic, count }))
                    .sort((a, b) => b.count - a.count);
            }
        }

        return sortedSummary;
    }, [testTopics]);

    const availableExams = useMemo(() => Object.keys(summary) as ExamType[], [summary]);
    const [activeTab, setActiveTab] = useState<ExamType | 'All'>('All');
    
    useEffect(() => {
        if (availableExams.length > 0 && !availableExams.includes(activeTab as ExamType) && activeTab !== 'All') {
            setActiveTab('All');
        }
    }, [availableExams, activeTab]);

    const displayedData = useMemo(() => {
        if (activeTab === 'All') {
            const allTopics: { [topic: string]: number } = {};
            for (const key in summary) {
                if (Object.prototype.hasOwnProperty.call(summary, key)) {
                    const examData = summary[key as ExamType];
                    if (examData) {
                        examData.forEach(({ topic, count }) => {
                            if (!allTopics[topic]) {
                                allTopics[topic] = 0;
                            }
                            allTopics[topic] += count;
                        });
                    }
                }
            }
            return Object.entries(allTopics)
                .map(([topic, count]) => ({ topic, count }))
                .sort((a, b) => b.count - a.count);
        }
        return summary[activeTab] || [];
    }, [activeTab, summary]);

    if (Object.keys(summary).length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-900/70 p-6 rounded-2xl border border-white/10 item-animated-entry h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4">Question Bank Inventory</h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('All')}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === 'All' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/60 text-gray-300 hover:bg-slate-700'}`}
                >
                    All
                </button>
                {availableExams.map(exam => (
                    <button
                        key={exam}
                        onClick={() => setActiveTab(exam)}
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === exam ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/60 text-gray-300 hover:bg-slate-700'}`}
                    >
                        {exam}
                    </button>
                ))}
            </div>

            {displayedData.length > 0 ? (
                 <div className="flex-grow overflow-y-auto space-y-3 pr-2 no-scrollbar">
                    {displayedData.map(({ topic, count }) => (
                        <div key={topic} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                            <p className="font-semibold text-gray-200 truncate" title={topic}>{topic}</p>
                            <span className="flex-shrink-0 ml-4 font-bold text-lg text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full">{count}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-center text-gray-500">
                    <p>No questions generated for this exam type yet.</p>
                </div>
            )}
        </div>
    );
};

export default QuestionBankSummary;
