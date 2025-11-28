import React, { useMemo } from 'react';
import { TestResult } from '../types';

interface TopicAnalysisViewProps {
    history: TestResult[];
}

interface TopicStats {
    topic: string;
    score: number;
    totalQuestions: number;
    correctQuestions: number;
}

const TopicItem: React.FC<{ topic: TopicStats, colorClass: string }> = ({ topic, colorClass }) => {
    return (
        <div className="bg-black/20 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-white flex-1">{topic.topic}</h4>
                <span className={`font-bold text-lg ${colorClass}`}>{topic.score.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3">
                <div className={`${colorClass.replace('text-', 'bg-')} h-1.5 rounded-full`} style={{ width: `${topic.score}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{topic.totalQuestions} questions attempted</p>
        </div>
    );
};

const TopicAnalysisView: React.FC<TopicAnalysisViewProps> = ({ history }) => {
    const { strongTopics, weakTopics } = useMemo(() => {
        const stats: Map<string, { correct: number; total: number }> = new Map();

        history.forEach(result => {
            result.questions.forEach((q, index) => {
                const topicName = q.questionSubtype || q.section || result.topic.name;
                if (!topicName || topicName.trim() === '') return;

                if (!stats.has(topicName)) {
                    stats.set(topicName, { correct: 0, total: 0 });
                }

                const topicStat = stats.get(topicName)!;
                topicStat.total += 1;
                if (result.userAnswers[index] === q.correctOption) {
                    topicStat.correct += 1;
                }
            });
        });
        
        const MIN_QUESTIONS = 5;
        const allTopics: TopicStats[] = Array.from(stats.entries())
            .filter(([, data]) => data.total >= MIN_QUESTIONS)
            .map(([topic, data]) => ({
                topic,
                totalQuestions: data.total,
                correctQuestions: data.correct,
                score: (data.correct / data.total) * 100,
            }));

        const strongTopics = allTopics
            .filter(t => t.score >= 75)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5); // Show top 5

        const weakTopics = allTopics
            .filter(t => t.score <= 50)
            .sort((a, b) => a.score - b.score)
            .slice(0, 5); // Show top 5

        return { strongTopics, weakTopics };
    }, [history]);
    
    const hasData = strongTopics.length > 0 || weakTopics.length > 0;

    return (
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1e1a3b] to-[#0d0c15] p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 mt-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Topic-wise Analysis</h2>
                <p className="text-gray-400 mt-1">Your top strengths and areas for improvement.</p>
            </div>
            
            {hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Strengths */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.93L5.5 8m7 2H5" /></svg>
                           </div>
                           <h3 className="text-2xl font-bold text-white">Strengths</h3>
                        </div>
                        <div className="space-y-4">
                            {strongTopics.length > 0 ? (
                                strongTopics.map((topic, index) => (
                                    <div key={`strong-${index}`} className="item-animated-entry" style={{ animationDelay: `${index * 100}ms` }}>
                                        <TopicItem topic={topic} colorClass="text-green-400" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No strong topics identified yet. Keep practicing!</p>
                            )}
                        </div>
                    </div>
                    {/* Areas for Improvement */}
                    <div>
                         <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                           </div>
                           <h3 className="text-2xl font-bold text-white">Areas for Improvement</h3>
                        </div>
                        <div className="space-y-4">
                           {weakTopics.length > 0 ? (
                                weakTopics.map((topic, index) => (
                                    <div key={`weak-${index}`} className="item-animated-entry" style={{ animationDelay: `${index * 100}ms` }}>
                                        <TopicItem topic={topic} colorClass="text-amber-400" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No specific weak areas found. Great work!</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-400">Take more tests (at least 5 questions per topic) to see your topic-wise analysis.</p>
                </div>
            )}
        </div>
    );
};

export default TopicAnalysisView;