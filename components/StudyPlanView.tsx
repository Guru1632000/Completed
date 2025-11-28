

import React, { useMemo } from 'react';
import { TestResult, MissedQuestion, Topic, Difficulty } from '../types';

interface StudyPlanViewProps {
  result: TestResult;
  frequentlyMissedQuestions: MissedQuestion[];
  onStartPracticeTest: (topic: Topic, numQuestions: number, difficulty: Difficulty) => void;
}

interface FocusArea {
    topic: Topic;
    reason: string;
    missed: number;
}

const StudyPlanView: React.FC<StudyPlanViewProps> = ({ result, frequentlyMissedQuestions, onStartPracticeTest }) => {

    const studyPlan = useMemo((): FocusArea[] => {
        const weakSubtopics = new Map<string, { unit: string; missedCount: number; }>();

        // 1. Analyze the last test for incorrect answers
        result.questions.forEach((q, index) => {
            const isIncorrect = result.userAnswers[index] !== q.correctOption;
            if (isIncorrect && q.questionSubtype) {
                const existing = weakSubtopics.get(q.questionSubtype) || { unit: q.section || 'General', missedCount: 0 };
                existing.missedCount += 1;
                weakSubtopics.set(q.questionSubtype, existing);
            }
        });
        
        // 2. Analyze frequently missed questions for recurring weaknesses
        frequentlyMissedQuestions.forEach(({ question, missedCount }) => {
            if (question.questionSubtype) {
                 const existing = weakSubtopics.get(question.questionSubtype) || { unit: question.section || 'General', missedCount: 0 };
                 // Add a heavier weight for topics that are frequently missed over time
                 existing.missedCount += missedCount; 
                 weakSubtopics.set(question.questionSubtype, existing);
            }
        });

        if (weakSubtopics.size === 0) {
            return [];
        }

        // 3. Sort by the highest number of mistakes and get the top 3 recommendations
        const sortedTopics = Array.from(weakSubtopics.entries())
            .sort(([, a], [, b]) => b.missedCount - a.missedCount)
            .slice(0, 3);
        
        // 4. Format the data for rendering
        return sortedTopics.map(([subtype, data]) => ({
            topic: { name: subtype, unit: data.unit },
            reason: `You've missed questions on this topic ${data.missedCount} time(s) recently. A focused practice session could help.`,
            missed: data.missedCount,
        }));

    }, [result, frequentlyMissedQuestions]);

    if (studyPlan.length === 0) {
        return null; // Don't render anything if there are no suggestions
    }

    return (
        <div className="my-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 2H5C3.9 2 3 2.9 3 4v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V6h10v2z"/>
                 </svg>
                Personalized Study Plan
            </h3>
            <p className="text-gray-400 mb-6 max-w-3xl">Based on your recent performance, we recommend focusing on these topics to improve your score.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyPlan.map((area, index) => (
                    <div 
                        key={index} 
                        className="bg-black/20 p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col justify-between item-animated-entry"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div>
                           <div className="flex items-center gap-2">
                                <span className="text-xs font-bold bg-red-500/20 text-red-300 px-2 py-1 rounded-full whitespace-nowrap">Focus Area</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mt-3">{area.topic.name}</h4>
                            <p className="text-sm text-gray-400 mb-4">{area.topic.unit}</p>
                            <p className="text-sm text-gray-300 leading-relaxed flex-grow">{area.reason}</p>
                        </div>
                        <button 
                            onClick={() => onStartPracticeTest(area.topic, 10, 'Medium')}
                            className="mt-6 w-full bg-white text-black font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20 apple-like-transition"
                        >
                            Practice Now (10 Qs)
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default StudyPlanView;