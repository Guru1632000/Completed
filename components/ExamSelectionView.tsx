
import React, { useState } from 'react';
import { ExamType } from '../types';

interface ExamSelectionViewProps {
    onSelectExam: (exam: ExamType) => void;
}

const TNPSC_ICON = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor"><path d="M11 2v4.59L6.71 11H4v9h16v-9h-2.71L13 6.59V2h-2zm-2 16H7v-5h2v5zm4 0h-2v-5h2v5zm4 0h-2v-5h2v5zM12 8.69l2.13 3.31H9.87L12 8.69z"/></svg>;
const BANK_ICON = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v2h20V7L12 2zM5.947 8L12 4.236 18.053 8H5.947zM19 19H5v-8h14v8z"/><path d="M7 13h2v4H7zm4 0h2v4h-2zm4 0h2v4h-2z"/></svg>;
const RAILWAY_ICON = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4.42 0-8 3.13-8 7v7c0 1.65 1.35 3 3 3h1.34c-.21.65-.21 1.39 0 2.04.28.87 1.09 1.46 2.06 1.46s1.78-.59 2.06-1.46c.21-.65.21-1.39 0-2.04H15c1.65 0 3-1.35 3-3v-7c0-3.87-3.58-7-8-7zm-1.5 15c-.83 0-1.5-.67-1.5-1.5S9.67 14 10.5 14s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 14H6V9h12v5z" /></svg>;
const SSC_ICON = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9v12h16V9L12 3zm0 2.236L17.535 9H6.465L12 5.236zM6 19v-8h2v8H6zm4 0v-8h4v8h-4zm6 0v-8h2v8h-2z"/></svg>;

const EXAM_DETAILS: any = {
    'TNPSC': {
        id: 'TNPSC',
        label: 'TNPSC',
        icon: <TNPSC_ICON />,
        description: 'Prepare for various Tamil Nadu Public Service Commission exams including Group I, II, and IV.',
        stages: [
            { name: 'Prelims', subjects: ['General Studies', 'Aptitude & Reasoning', 'General English/Tamil'] },
            { name: 'Mains', subjects: ['Descriptive Papers', 'General Studies', 'Tamil Society & Heritage'] }
        ]
    },
    'Bank Exam': {
        id: 'Bank Exam',
        label: 'Bank Exam',
        icon: <BANK_ICON />,
        description: 'Practice for Probationary Officer (PO) and Clerk exams for major banks like SBI, IBPS.',
        stages: [
            { name: 'Prelims', subjects: ['Reasoning Ability', 'Quantitative Aptitude', 'English Language'] },
            { name: 'Mains', subjects: ['Reasoning & Computer', 'Data Analysis & Interpretation', 'English', 'General Awareness'] }
        ]
    },
    'Railway': {
        id: 'Railway',
        label: 'Railway',
        icon: <RAILWAY_ICON />,
        description: 'Covering major Railway Recruitment Board (RRB) exams like NTPC, Group D, and ALP.',
        stages: [
            { name: 'CBT-1', subjects: ['Mathematics', 'General Intelligence & Reasoning', 'General Awareness'] },
            { name: 'CBT-2', subjects: ['Varies by exam', 'Includes Basic Science & Engineering for ALP'] }
        ]
    },
    'SSC': {
        id: 'SSC',
        label: 'SSC',
        icon: <SSC_ICON />,
        description: 'Get ready for Staff Selection Commission exams such as CGL and CHSL (Tier 1 & 2).',
        stages: [
            { name: 'Tier-1', subjects: ['Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English'] },
            { name: 'Tier-2', subjects: ['Maths', 'Reasoning', 'English', 'GA', 'Computer Knowledge'] }
        ]
    }
};

const EXAM_ORDER: ExamType[] = ['TNPSC', 'Bank Exam', 'Railway', 'SSC'];

const ExamSelectionView: React.FC<ExamSelectionViewProps> = ({ onSelectExam }) => {
    const [expandedExam, setExpandedExam] = useState<ExamType | null>(null);

    const handleToggleExpand = (examId: ExamType) => {
        setExpandedExam(prev => (prev === examId ? null : examId));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Select Your Exam</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                        Expand a card to see details, then select an exam to begin practicing.
                    </p>
                </div>
                
                <div className="space-y-6">
                    {/* Standard Exams */}
                    {EXAM_ORDER.map((examId, index) => {
                        const exam = EXAM_DETAILS[examId as keyof typeof EXAM_DETAILS];
                        const isExpanded = expandedExam === exam.id;
                        
                        return (
                            <div key={exam.id} className={`bg-black/20 border rounded-2xl transition-all duration-500 ease-in-out item-animated-entry ${isExpanded ? 'border-purple-500/50' : 'border-white/10'}`} style={{ animationDelay: `${index * 100}ms` }}>
                                <button
                                    className="w-full p-6 text-left flex items-center justify-between"
                                    onClick={() => handleToggleExpand(exam.id as ExamType)}
                                    aria-expanded={isExpanded}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 text-purple-400 flex-shrink-0 transition-transform duration-300 ease-out" style={{ transform: isExpanded ? 'scale(1.1)' : 'scale(1)' }}>
                                            {exam.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{exam.label}</h2>
                                            <p className="text-gray-400 mt-1">{exam.description}</p>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                
                                <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-6 pt-4 border-t border-white/10">
                                            <h3 className="text-lg font-semibold text-purple-300 mb-4">Exam Stages & Core Subjects</h3>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                {exam.stages.map((stage: any) => (
                                                    <div key={stage.name} className="bg-slate-800/50 p-4 rounded-lg">
                                                        <h4 className="font-bold text-white">{stage.name}</h4>
                                                        <ul className="mt-2 text-sm text-gray-400 space-y-1">
                                                            {stage.subjects.map((subject: any) => (
                                                                <li key={subject} className="flex items-start"><span className="text-purple-400 mr-2 mt-1">&#8227;</span><span>{subject}</span></li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-6 text-right">
                                                <button
                                                    onClick={() => onSelectExam(exam.id as ExamType)}
                                                    className="btn btn-primary"
                                                >
                                                    Start Practicing for {exam.label}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ExamSelectionView;
