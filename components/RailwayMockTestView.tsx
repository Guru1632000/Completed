
import React, { useState } from 'react';
import { Difficulty, RailwayExamFilterType } from '../types';
import { 
    RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION, 
    RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION, 
    RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION, 
    RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION,
    RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION,
    RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION
} from '../constants';

interface RailwayMockTestViewProps {
    onStartTest: (exam: RailwayExamFilterType, stage: 'CBT-1' | 'CBT-2', difficulty: Difficulty) => void;
    onStartAlpPartBTest: (difficulty: Difficulty) => void;
    activeRailwayExamFilter: RailwayExamFilterType;
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


const RailwayMockTestView: React.FC<RailwayMockTestViewProps> = ({ onStartTest, onStartAlpPartBTest, activeRailwayExamFilter }) => {
    
    const renderMockTestCards = () => {
        switch (activeRailwayExamFilter) {
            case 'NTPC':
                const ntpc1_total = RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION.reduce((sum, s) => sum + s.questionCount, 0);
                const ntpc2_total = RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION.reduce((sum, s) => sum + s.questionCount, 0);
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <MockTestCard
                            title="NTPC CBT-1 Mock Test"
                            description="Prepare for the first stage of the NTPC exam."
                            sections={RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION}
                            totalQuestions={ntpc1_total}
                            onStartTest={(difficulty) => onStartTest('NTPC', 'CBT-1', difficulty)}
                        />
                        <MockTestCard
                            title="NTPC CBT-2 Mock Test"
                            description="Challenge yourself with the second stage NTPC exam pattern."
                            sections={RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION}
                            totalQuestions={ntpc2_total}
                            onStartTest={(difficulty) => onStartTest('NTPC', 'CBT-2', difficulty)}
                        />
                    </div>
                );
            case 'Group D':
                const gd_total = RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION.reduce((sum, s) => sum + s.questionCount, 0);
                return (
                     <div className="max-w-2xl mx-auto">
                        <MockTestCard
                            title="Group D Mock Test"
                            description="A comprehensive mock test designed for the Group D exam."
                            sections={RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION}
                            totalQuestions={gd_total}
                            onStartTest={(difficulty) => onStartTest('Group D', 'CBT-1', difficulty)}
                        />
                    </div>
                );
            case 'RRB ALP':
                const alp1_total = RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION.reduce((sum, s) => sum + s.questionCount, 0);
                const alp2_part_a_total = RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION.reduce((sum, s) => sum + s.questionCount, 0);
                const alp2_part_b_total = RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION.reduce((sum, s) => sum + s.questionCount, 0);
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <MockTestCard
                            title="ALP CBT-1 Mock Test"
                            description="Practice for the first stage of the Assistant Loco Pilot exam."
                            sections={RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION}
                            totalQuestions={alp1_total}
                            onStartTest={(difficulty) => onStartTest('RRB ALP', 'CBT-1', difficulty)}
                        />
                         <MockTestCard
                            title="ALP CBT-2 (Part A) Mock Test"
                            description="Test for Mathematics, Reasoning, and Basic Science & Engineering."
                            sections={RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION}
                            totalQuestions={alp2_part_a_total}
                            onStartTest={(difficulty) => onStartTest('RRB ALP', 'CBT-2', difficulty)}
                        />
                         <MockTestCard
                            title="ALP CBT-2 (Part B) Mock Test"
                            description="Qualifying test on your relevant trade syllabus (Mechanical)."
                            sections={RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION}
                            totalQuestions={alp2_part_b_total}
                            onStartTest={(difficulty) => onStartAlpPartBTest(difficulty)}
                        />
                    </div>
                );
        }
    };


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-white">Railway {activeRailwayExamFilter} - Full Mock Test</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                    Prepare for the Railway Recruitment Board (RRB) {activeRailwayExamFilter} exam with AI-generated mock tests that follow the latest exam patterns.
                </p>
            </div>
            {renderMockTestCards()}
        </div>
    );
};

export default RailwayMockTestView;
