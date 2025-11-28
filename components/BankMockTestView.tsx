
import React, { useState } from 'react';
import { Difficulty, BankExamFilterType } from '../types';
import { 
    BANK_PRELIMS_EXAM_PATTERN, 
    BANK_MAINS_EXAM_PATTERN,
    RRB_BANK_PRELIMS_EXAM_PATTERN,
    RRB_BANK_MAINS_EXAM_PATTERN
} from '../constants';

interface BankMockTestViewProps {
    onStartTest: (testType: 'Prelims' | 'Mains', difficulty: Difficulty) => void;
    activeBankExamFilter: BankExamFilterType;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];

const MockTestCard: React.FC<{
    title: string;
    description: string;
    sections: { name: string; questionCount: number; }[];
    totalQuestions: number;
    onStartTest: (difficulty: Difficulty) => void;
}> = ({ title, description, sections, totalQuestions, onStartTest }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Medium');

    return (
        <div className="p-8 bg-black/20 rounded-2xl shadow-lg border border-white/10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">{title}</h3>
            <p className="text-gray-400 text-center mb-6 flex-grow">{description}</p>
            
            <div className="space-y-3 mb-6">
                {sections.map(section => (
                    <div key={section.name} className="p-3 rounded-lg flex justify-between items-center bg-purple-500/10 border-l-4 border-purple-400">
                        <p className="font-semibold text-purple-200">{section.name}</p>
                        <p className="font-bold text-purple-200">{section.questionCount} Qs</p>
                    </div>
                ))}
            </div>
            <div className="p-3 rounded-lg flex justify-between items-center bg-purple-500/20 border-t-2 border-purple-400">
                <p className="font-bold text-lg text-purple-100">Total</p>
                <p className="font-semibold text-xl text-purple-100">{totalQuestions} Questions</p>
            </div>

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


const BankMockTestView: React.FC<BankMockTestViewProps> = ({ onStartTest, activeBankExamFilter }) => {
    const isRRB = activeBankExamFilter === 'RRB BANK';

    const prelimsPattern = isRRB ? RRB_BANK_PRELIMS_EXAM_PATTERN : BANK_PRELIMS_EXAM_PATTERN;
    const mainsPattern = isRRB ? RRB_BANK_MAINS_EXAM_PATTERN : BANK_MAINS_EXAM_PATTERN;

    const prelimsTotal = prelimsPattern.reduce((sum, s) => sum + s.questions, 0);
    const prelimsSectionsSummary = prelimsPattern.map(s => ({ name: s.section, questionCount: s.questions }));

    const mainsTotal = mainsPattern.reduce((sum, s) => sum + s.questions, 0);
    const mainsSectionsSummary = mainsPattern.map(s => ({ name: s.section, questionCount: s.questions }));

    const examPrefix = activeBankExamFilter || 'Bank Exam';

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-white">{examPrefix} - Full Mock Test</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                    Prepare for both stages of the {examPrefix} exam with AI-generated mock tests that follow the latest exam patterns for Prelims and Mains.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <MockTestCard 
                    title={`${examPrefix} Prelims Mock Test`}
                    description={`Test your speed and accuracy with a test simulating the ${examPrefix} Prelims exam environment.`}
                    sections={prelimsSectionsSummary}
                    totalQuestions={prelimsTotal}
                    onStartTest={(difficulty) => onStartTest('Prelims', difficulty)}
                />
                 <MockTestCard 
                    title={`${examPrefix} Mains Mock Test`}
                    description={`Challenge yourself with a comprehensive ${examPrefix} Mains mock test.`}
                    sections={mainsSectionsSummary}
                    totalQuestions={mainsTotal}
                    onStartTest={(difficulty) => onStartTest('Mains', difficulty)}
                />
            </div>
        </div>
    );
};

export default BankMockTestView;
