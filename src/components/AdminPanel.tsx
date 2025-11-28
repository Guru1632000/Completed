
import React, { useState, useEffect, useMemo } from 'react';
import { SyllabusUnit, Topic, ExamType, ExamPatternConfig, ExamSectionConfig } from '../types';
import { TNPSC_FILTERS, BANK_FILTERS, RAILWAY_EXAM_FILTERS, SSC_EXAM_FILTERS, BANK_EXAM_FILTERS } from '../constants';

interface AdminPanelProps {
    syllabus: SyllabusUnit[];
    onUpdateSyllabus: (newSyllabus: SyllabusUnit[]) => void;
    activeExamType: ExamType;
    activeFilter: string;
    onGoBack: () => void;
    
    customExams: string[];
    onUpdateCustomExams: (exams: string[]) => void;
    customFilters: Record<ExamType, string[]>;
    onUpdateCustomFilters: (filters: Record<ExamType, string[]>) => void;
    customSpecificExams: Record<string, string[]>;
    onUpdateCustomSpecificExams: (specificExams: Record<string, string[]>) => void;

    onContextChange: (exam: ExamType, filter: string, specificExam?: string) => void;
    activeSpecificExam?: string;

    examPatterns: ExamPatternConfig[];
    onUpdateExamPattern: (pattern: ExamPatternConfig) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
    syllabus, onUpdateSyllabus, activeExamType, activeFilter, onGoBack,
    customExams, onUpdateCustomExams,
    customFilters, onUpdateCustomFilters,
    customSpecificExams, onUpdateCustomSpecificExams,
    onContextChange, activeSpecificExam,
    examPatterns, onUpdateExamPattern
}) => {
    const [units, setUnits] = useState<SyllabusUnit[]>([]);
    const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [showConfigPanel, setShowConfigPanel] = useState(false);

    const [newCustomExam, setNewCustomExam] = useState('');
    const [newFilter, setNewFilter] = useState('');
    const [newSpecificExam, setNewSpecificExam] = useState('');
    const [selectedConfigExam, setSelectedConfigExam] = useState<ExamType>(activeExamType);

    const [currentPattern, setCurrentPattern] = useState<ExamPatternConfig | null>(null);

    useEffect(() => {
        setUnits(JSON.parse(JSON.stringify(syllabus)));
        setIsDirty(false);
    }, [syllabus]);

    useEffect(() => {
        const existingPattern = examPatterns.find(p => 
            p.examType === activeExamType && 
            p.stage === activeFilter && 
            (p.subType === activeSpecificExam || (!p.subType && !activeSpecificExam))
        );

        if (existingPattern) {
            setCurrentPattern(existingPattern);
        } else {
            const defaultSections: ExamSectionConfig[] = units.length > 0 ? units.map(u => ({
                sectionName: u.title,
                questionCount: 10,
                marksPerQuestion: 1
            })) : [{ sectionName: 'General Section', questionCount: 50, marksPerQuestion: 1 }];
            
            setCurrentPattern({
                examType: activeExamType,
                subType: activeSpecificExam,
                stage: activeFilter,
                sections: defaultSections,
                totalTimeInMinutes: 60,
                negativeMarking: 0.25
            });
        }
    }, [activeExamType, activeFilter, activeSpecificExam, examPatterns]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const handleSave = () => {
        onUpdateSyllabus(units);
        if (currentPattern) {
             onUpdateExamPattern(currentPattern);
        }
        setIsDirty(false);
        showNotification('Changes saved successfully!', 'success');
    };

    const handleContextChangeRequest = (newExam: ExamType, newFilter: string, newSpecific?: string) => {
        if (isDirty) {
            if (!window.confirm("You have unsaved changes. Discard them and switch context?")) return;
        }
        onContextChange(newExam, newFilter, newSpecific);
    };

    const handleAddUnit = () => {
        const newUnit: SyllabusUnit = { id: `unit-${Date.now()}`, title: 'New Section', topics: [] };
        setUnits([...units, newUnit]);
        setExpandedUnitId(newUnit.id);
        setIsDirty(true);
    };

    const handleDeleteUnit = (unitId: string) => {
        if (window.confirm('Are you sure you want to delete this entire section?')) {
            setUnits(units.filter(u => u.id !== unitId));
            setIsDirty(true);
        }
    };

    const handleUpdateUnitTitle = (unitId: string, newTitle: string) => {
        setUnits(units.map(u => u.id === unitId ? { ...u, title: newTitle } : u));
        setIsDirty(true);
    };

    const handleAddTopic = (unitId: string) => {
        setUnits(units.map(u => {
            if (u.id === unitId) return { ...u, topics: [...u.topics, { name: 'New Topic', unit: u.title }] };
            return u;
        }));
        setIsDirty(true);
    };

    const handleDeleteTopic = (unitId: string, topicIndex: number) => {
        setUnits(units.map(u => {
            if (u.id === unitId) {
                const newTopics = [...u.topics];
                newTopics.splice(topicIndex, 1);
                return { ...u, topics: newTopics };
            }
            return u;
        }));
        setIsDirty(true);
    };

    const handleUpdateTopicName = (unitId: string, topicIndex: number, newName: string) => {
        setUnits(units.map(u => {
            if (u.id === unitId) {
                const newTopics = [...u.topics];
                newTopics[topicIndex] = { ...newTopics[topicIndex], name: newName };
                return { ...u, topics: newTopics };
            }
            return u;
        }));
        setIsDirty(true);
    };

    const handleAddCustomExam = () => {
        if (newCustomExam && !customExams.includes(newCustomExam)) {
            onUpdateCustomExams([...customExams, newCustomExam]);
            setNewCustomExam('');
            showNotification(`Added custom exam: ${newCustomExam}`, 'success');
        }
    };

    const handleRemoveCustomExam = (exam: string) => {
        if (window.confirm(`Delete custom exam "${exam}"? This action cannot be undone.`)) {
            onUpdateCustomExams(customExams.filter(e => e !== exam));
            if (selectedConfigExam === exam) setSelectedConfigExam('TNPSC');
        }
    };

    const handleAddFilter = () => {
        if (newFilter) {
            const currentFilters = customFilters[selectedConfigExam] || [];
            if (!currentFilters.includes(newFilter)) {
                onUpdateCustomFilters({ ...customFilters, [selectedConfigExam]: [...currentFilters, newFilter] });
                setNewFilter('');
                showNotification(`Added filter "${newFilter}" to ${selectedConfigExam}`, 'success');
            }
        }
    };

    const handleRemoveFilter = (filter: string) => {
        const currentFilters = customFilters[selectedConfigExam] || [];
        onUpdateCustomFilters({ ...customFilters, [selectedConfigExam]: currentFilters.filter(f => f !== filter) });
    };

    const handleAddSpecificExam = () => {
        if (newSpecificExam) {
            const currentSpecific = customSpecificExams[selectedConfigExam] || [];
            if (!currentSpecific.includes(newSpecificExam)) {
                onUpdateCustomSpecificExams({ ...customSpecificExams, [selectedConfigExam]: [...currentSpecific, newSpecificExam] });
                setNewSpecificExam('');
                showNotification(`Added specific exam "${newSpecificExam}" to ${selectedConfigExam}`, 'success');
            }
        }
    };

    const handleRemoveSpecificExam = (examName: string) => {
        const currentSpecific = customSpecificExams[selectedConfigExam] || [];
        onUpdateCustomSpecificExams({ ...customSpecificExams, [selectedConfigExam]: currentSpecific.filter(e => e !== examName) });
    };

    // --- Dropdown Data Logic ---
    const allExams = ['TNPSC', 'Bank Exam', 'Railway', 'SSC', ...customExams] as ExamType[];

    const getAvailableFilters = (exam: ExamType): string[] => {
        let standardFilters: string[] = [];
        if (exam === 'TNPSC') standardFilters = TNPSC_FILTERS.map(f => f.id);
        else if (exam === 'Bank Exam') standardFilters = BANK_FILTERS.map(f => f.id);
        else if (exam === 'Railway') standardFilters = ['CBT-1', 'CBT-2', 'Part B']; 
        else if (exam === 'SSC') standardFilters = ['Tier-1', 'Tier-2'];
        const custom = customFilters[exam] || [];
        return Array.from(new Set([...standardFilters, ...custom]));
    };

    const getAvailableSpecificExams = (exam: ExamType): string[] => {
        let standardSpecific: string[] = [];
        if (exam === 'Railway') standardSpecific = RAILWAY_EXAM_FILTERS.map(f => f.id);
        else if (exam === 'SSC') standardSpecific = SSC_EXAM_FILTERS.map(f => f.id);
        else if (exam === 'Bank Exam') standardSpecific = BANK_EXAM_FILTERS.map(f => f.id);
        
        const custom = customSpecificExams[exam] || [];
        return Array.from(new Set([...standardSpecific, ...custom]));
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 page-transition-wrapper">
            
            {/* Header & Controls */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-white">Admin Panel</h1>
                    <div className="flex gap-3">
                         <button onClick={handleSave} disabled={!isDirty} className={`btn ${isDirty ? 'btn-primary' : 'bg-gray-700 text-gray-400 cursor-not-allowed border-transparent'}`}>Save Syllabus</button>
                         <button onClick={onGoBack} className="btn btn-secondary">Exit</button>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-white/10 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Exam Selector */}
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 font-semibold mb-1">Exam Type</label>
                            <select 
                                value={activeExamType} 
                                onChange={(e) => handleContextChangeRequest(e.target.value as ExamType, getAvailableFilters(e.target.value as ExamType)[0])}
                                className="p-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {allExams.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>

                        {/* Specific Exam Selector (Conditional) */}
                        {getAvailableSpecificExams(activeExamType).length > 0 && (
                             <div className="flex flex-col">
                                <label className="text-xs text-gray-400 font-semibold mb-1">Specific Exam</label>
                                <select 
                                    value={activeSpecificExam || ''} 
                                    onChange={(e) => handleContextChangeRequest(activeExamType, activeFilter, e.target.value)}
                                    className="p-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {getAvailableSpecificExams(activeExamType).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Filter/Stage Selector */}
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 font-semibold mb-1">Filter / Stage</label>
                            <select 
                                value={activeFilter} 
                                onChange={(e) => handleContextChangeRequest(activeExamType, e.target.value, activeSpecificExam)}
                                className="p-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {getAvailableFilters(activeExamType).map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowConfigPanel(!showConfigPanel)} 
                        className={`btn ${showConfigPanel ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'btn-secondary'}`}
                    >
                        {showConfigPanel ? 'Hide Configuration' : '⚙️ Manage Global Config'}
                    </button>
                </div>
            </div>

            {notification && (
                <div className={`fixed top-24 right-8 p-4 rounded-lg shadow-lg z-50 animate-bounce ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {notification.message}
                </div>
            )}

            {/* Collapsible Configuration Panel */}
            {showConfigPanel && (
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-8 item-animated-entry">
                    <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Global Configuration</h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 1. Custom Exams */}
                        <div>
                             <h3 className="text-md font-bold text-purple-300 mb-3">Custom Exams</h3>
                             <div className="flex gap-2 mb-3">
                                <input 
                                    type="text" 
                                    value={newCustomExam} 
                                    onChange={(e) => setNewCustomExam(e.target.value)}
                                    placeholder="New Exam Name"
                                    className="flex-grow p-2 bg-white/5 border border-white/10 rounded text-sm text-white"
                                />
                                <button onClick={handleAddCustomExam} className="btn btn-secondary !py-1 !px-3 text-sm">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {customExams.map(exam => (
                                    <span key={exam} className="inline-flex items-center px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-gray-300">
                                        {exam}
                                        <button onClick={() => handleRemoveCustomExam(exam)} className="ml-2 text-red-400 hover:text-red-300 font-bold">&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Config Context Selection for Filters/Specifics */}
                        <div className="lg:col-span-2 bg-white/5 p-4 rounded-lg">
                            <div className="mb-4 flex items-center gap-2">
                                <span className="text-sm text-gray-400">Configure Filters & Specifics for:</span>
                                <select 
                                    value={selectedConfigExam} 
                                    onChange={(e) => setSelectedConfigExam(e.target.value as ExamType)}
                                    className="p-1 bg-black/50 border border-white/20 rounded text-white text-sm"
                                >
                                    {allExams.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 2. Filters */}
                                <div>
                                    <h3 className="text-md font-bold text-purple-300 mb-3">Custom Filters / Stages</h3>
                                    <div className="flex gap-2 mb-3">
                                        <input 
                                            type="text" 
                                            value={newFilter} 
                                            onChange={(e) => setNewFilter(e.target.value)}
                                            placeholder="New Filter Name"
                                            className="flex-grow p-2 bg-white/5 border border-white/10 rounded text-sm text-white"
                                        />
                                        <button onClick={handleAddFilter} className="btn btn-secondary !py-1 !px-3 text-sm">Add</button>
                                    </div>
                                    <ul className="space-y-1 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                        {(customFilters[selectedConfigExam] || []).map(filter => (
                                            <li key={filter} className="flex justify-between items-center px-2 py-1 bg-white/5 rounded text-xs text-gray-300">
                                                <span>{filter}</span>
                                                <button onClick={() => handleRemoveFilter(filter)} className="text-red-400 hover:text-red-300">&times;</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 3. Specific Exams */}
                                <div>
                                    <h3 className="text-md font-bold text-purple-300 mb-3">Specific Exam Types</h3>
                                    <div className="flex gap-2 mb-3">
                                        <input 
                                            type="text" 
                                            value={newSpecificExam} 
                                            onChange={(e) => setNewSpecificExam(e.target.value)}
                                            placeholder="New Specific Exam"
                                            className="flex-grow p-2 bg-white/5 border border-white/10 rounded text-sm text-white"
                                        />
                                        <button onClick={handleAddSpecificExam} className="btn btn-secondary !py-1 !px-3 text-sm">Add</button>
                                    </div>
                                    <ul className="space-y-1 max