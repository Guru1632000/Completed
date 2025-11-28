import React, { useState } from 'react';
// FIX: The SSCStageFilterType is too broad, so we narrow it down to the specific mock test types.
import { Difficulty, SSCExamFilterType, SSCStageFilterType } from '../types';
import { 
    SSC_CGL_TIER1_EXAM_PATTERN, 
    SSC_CGL_TIER2_EXAM_PATTERN, 
    SSC_CHSL_TIER1_EXAM_PATTERN, 
    SSC_CHSL_TIER2_EXAM_PATTERN,
    SSC_JE_PAPER1_EXAM_PATTERN
} from '../constants';

interface SSCMockTestViewProps {
// FIX: Narrow the type of 'testType' to only include valid stages for mock tests, resolving the type error.
    onStartTest: (exam: SSCExamFilterType, testType: 'Tier-1' | 'Tier-2' | 'Paper-I', difficulty: Difficulty) => void;
    activeSSCExamFilter: SSCExamFilterType;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];

const MockTestCard: React.FC<{
    title: string;
    description: string;
    sections: { subject: string; questions: number | string }[];
    totalQuestions: number;
    onStartTest: (difficulty: Difficulty) => void;
    negativeMarking?: string;
}> = ({ title, description, sections, totalQuestions, onStartTest, negativeMarking }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Medium');

    return (
        <div className="p-8 bg-black/20 rounded-2xl shadow-lg border border-white/10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">{title}</h3>
            <p className="text-gray-400 text-center mb-6 flex-grow">{description}</p>
            
            <div className="space-y-3 mb-6">
                {sections.map(section => (
                    <div key={section.subject} className="p-3 rounded-lg flex justify-between items-center bg-purple-500/10 border-l-4 border-purple-400">
                        <p className="font-semibold text-purple-200">{section.subject}</p>
                        <p className="font-bold text-purple-200">{section.questions} Qs</p>
                    </div>
                ))}
            </div>
            <div className="p-3 rounded-lg flex justify-between items-center bg-purple-500/20 border-t-2 border-purple-400">
                <p className="font-bold text-lg text-purple-100">Total</p>
                <p className="font-semibold text-xl text-purple-100">{totalQuestions} Questions</p>
            </div>

            {negativeMarking && (
                <div className="mt-4 text-center text-xs text-red-400 font-semibold flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Negative Marking: {negativeMarking}
                </div>
            )}

            <div className="mt-8">
                <label className="block text-md font-semibold text-gray-300 mb-3 text-center">
                    Select Difficulty Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                    {difficulties.map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedDifficulty(level)}
                            className={`w-full font-semibold rounded-lg px-4 py-2 text-sm transition-colors duration-200 border ${
                            selectedDifficulty === level
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => onStartTest(selectedDifficulty)}
                    className="btn btn-primary w-full text-lg"
                >
                    Start Test
                </button>
            </div>
        </div>
    );
};


const SSCMockTestView: React.FC<SSCMockTestViewProps> = ({ onStartTest, activeSSCExamFilter }) => {
    
    if (activeSSCExamFilter === 'JE') {
        const paper1Total = SSC_JE_PAPER1_EXAM_PATTERN.reduce((sum, s) => sum + s.questions, 0);
        const paper1Sections = SSC_JE_PAPER1_EXAM_PATTERN.map(s => ({ subject: s.section, questions: s.questions }));
        const negativeMarking = "0.25 marks per wrong answer";
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-white">SSC {activeSSCExamFilter} - Full Mock Test</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                        Prepare for the SSC Junior Engineer exam with AI-generated mock tests.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <MockTestCard 
                        title="Paper-I Mock Test"
                        description={`Simulate the Paper-I exam covering Reasoning, General Awareness, and General Engineering.`}
                        sections={paper1Sections}
                        totalQuestions={paper1Total}
                        onStartTest={(difficulty) => onStartTest(activeSSCExamFilter, 'Paper-I', difficulty)}
                        negativeMarking={negativeMarking}
                    />
                    <div className="p-8 bg-black/20 rounded-2xl shadow-lg border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Paper-II Mock Test</h3>
                        <p className="text-gray-400">Paper-II mock tests are coming soon.</p>
                    </div>
                </div>
            </div>
        )
    }

    const tier1Pattern = activeSSCExamFilter === 'CGL' ? SSC_CGL_TIER1_EXAM_PATTERN : SSC_CHSL_TIER1_EXAM_PATTERN;
    const tier1Total = tier1Pattern.reduce((sum, s) => sum + s.questions, 0);
    const tier1Sections = tier1Pattern.map(s => ({ subject: s.section, questions: s.questions }));

    const tier2Pattern = activeSSCExamFilter === 'CGL' ? SSC_CGL_TIER2_EXAM_PATTERN : SSC_CHSL_TIER2_EXAM_PATTERN;
    const tier2Total = tier2Pattern.filter(p => p.session === 'Session I' && typeof p.questions === 'number').reduce((sum, s) => sum + (s.questions as number), 0);
    const tier2Sections = tier2Pattern.filter(p => p.session === 'Session I').map(s => ({ subject: s.subject, questions: s.questions }));

    const tier1NegativeMarking = "0.50 marks per wrong answer";
    const tier2NegativeMarking = "1 mark per wrong answer";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-white">SSC {activeSSCExamFilter} - Full Mock Test</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                    Prepare for the SSC {activeSSCExamFilter} exam with AI-generated mock tests that follow the latest exam patterns for Tier 1 and Tier 2.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <MockTestCard 
                    title="Tier 1 Mock Test"
                    description={`Simulate the Tier 1 exam with randomly selected questions based on topic weights for ${activeSSCExamFilter}.`}
                    sections={tier1Sections}
                    totalQuestions={tier1Total}
                    onStartTest={(difficulty) => onStartTest(activeSSCExamFilter, 'Tier-1', difficulty)}
                    negativeMarking={tier1NegativeMarking}
                />
                 <MockTestCard 
                    title="Tier 2 (Paper 1) Mock Test"
                    description={`Challenge yourself with a comprehensive mock test covering all modules of Paper 1 for ${activeSSCExamFilter}.`}
                    sections={tier2Sections}
                    totalQuestions={tier2Total}
                    onStartTest={(difficulty) => onStartTest(activeSSCExamFilter, 'Tier-2', difficulty)}
                    negativeMarking={tier2NegativeMarking}
                />
            </div>
        </div>
    );
};

export default SSCMockTestView;