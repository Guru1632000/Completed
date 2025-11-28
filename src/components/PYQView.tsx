import React, { useState, useRef, useEffect } from 'react';
import { ExamType } from '../types';
import { PYQ_EXAM_GROUPS } from '../constants';

interface PYQViewProps {
    onGenerateTest: (year: number, group: string, numQuestions: number, isSimulated: boolean, examType: ExamType) => void;
    activeExamType: ExamType;
}

const currentYear = new Date().getFullYear();
const endYear = currentYear + 1;
const startYear = 2015;
const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);


const PYQView: React.FC<PYQViewProps> = ({ onGenerateTest, activeExamType }) => {
    const groups = PYQ_EXAM_GROUPS[activeExamType as keyof typeof PYQ_EXAM_GROUPS] || [];
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedGroup, setSelectedGroup] = useState<string>(groups[0] || '');
    const [numQuestions, setNumQuestions] = useState<number>(10);
    const [isSimulated, setIsSimulated] = useState<boolean>(false);
    const [error, setError] = useState('');
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Reset selected group when the available groups change (i.e., when examType changes)
        setSelectedGroup(groups[0] || '');
    }, [groups]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!selectedYear || !selectedGroup || !numQuestions) {
            setError('Please fill out all fields.');
            return;
        }
        setError('');
        onGenerateTest(selectedYear, selectedGroup, numQuestions, isSimulated, activeExamType);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-white">Practice with Previous Year Questions</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Select the exam year and type to generate a test from authentic past papers.</p>
                </div>
                <div className="p-8 bg-black/20 rounded-2xl shadow-lg border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="year-select-button" className="block text-lg font-semibold text-gray-200 mb-2">
                                Exam Year
                            </label>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    id="year-select-button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex justify-between items-center p-3 bg-black/20 text-gray-200 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 focus:ring-purple-500"
                                    aria-haspopup="listbox"
                                    aria-expanded={isDropdownOpen}
                                >
                                    <span>{selectedYear}</span>
                                    <svg
                                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {isDropdownOpen && (
                                    <ul
                                        className="absolute z-10 mt-2 w-full bg-slate-800/80 backdrop-blur-md border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto explanation-animate"
                                        role="listbox"
                                        aria-labelledby="year-select-button"
                                    >
                                        {years.map(year => (
                                            <li
                                                key={year}
                                                role="option"
                                                aria-selected={year === selectedYear}
                                                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                                                    year === selectedYear
                                                        ? 'bg-purple-600 text-white font-bold'
                                                        : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                                                }`}
                                                onClick={() => {
                                                    setSelectedYear(year);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {year}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-lg font-semibold text-gray-200 mb-3">
                                Exam / Group
                            </label>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {groups.map((group) => (
                                    <button
                                        key={group}
                                        type="button"
                                        onClick={() => setSelectedGroup(group)}
                                        className={`w-full font-semibold rounded-lg px-4 py-3 text-sm transition-colors duration-200 border ${
                                            selectedGroup === group
                                            ? 'bg-white text-black border-white'
                                            : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-purple-400'
                                        }`}
                                    >
                                        {group}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                           <label htmlFor="question-slider-pyq" className="block text-lg font-semibold text-gray-200 mb-2">
                                Number of Questions: <span className="font-extrabold text-purple-300">{numQuestions}</span>
                            </label>
                            <input
                                id="question-slider-pyq"
                                type="range"
                                min="5"
                                max="50"
                                step="5"
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>5</span>
                                <span>50</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center justify-between cursor-pointer p-3 bg-black/20 rounded-lg border border-white/20">
                                <span className="text-md font-semibold text-gray-200">
                                    Generate AI-Simulated Questions
                                    <span className="block text-sm text-gray-400 font-normal">For extra practice if official questions are unavailable.</span>
                                </span>
                                <div className="relative">
                                    <input type="checkbox" checked={isSimulated} onChange={(e) => setIsSimulated(e.target.checked)} className="sr-only peer" id="ai-simulated-toggle" />
                                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </div>
                            </label>
                        </div>

                        {error && <p className="text-red-400 text-center font-semibold">{error}</p>}
                        
                        <div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full text-lg"
                            >
                                Start PYQ Test
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PYQView;
