

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SyllabusUnit, ExamType, StudyPlanItem } from '../types';
import Loader from './Loader';
import { generateStudyPlan } from '../services/aiService';
import { 
    SYLLABUS, 
    BANK_PRELIMS_SYLLABUS, 
    BANK_MAINS_SYLLABUS,
    RAILWAY_NTPC_CBT1_SYLLABUS,
    RAILWAY_NTPC_CBT2_SYLLABUS,
    RAILWAY_GROUP_D_SYLLABUS,
    RAILWAY_ALP_CBT1_SYLLABUS,
    RAILWAY_ALP_CBT2_SYLLABUS,
    SSC_CGL_TIER1_SYLLABUS,
    SSC_CGL_TIER2_SYLLABUS,
    SSC_CHSL_TIER1_SYLLABUS,
    SSC_CHSL_TIER2_SYLLABUS
} from '../constants';

interface WorkPlanViewProps {
    onGoBack: () => void;
}

const STORAGE_KEY_PREFIX = 'ai-exam-work-plans';

interface PlanInfo {
    storageKey: string;
    exam: string;
    unit: SyllabusUnit; // For single plans
    fullExamKey?: string; // For full exam plans
    planName: string; // Display name
    plan: StudyPlanItem[];
}

const buildUnitMap = (): Map<string, SyllabusUnit> => {
    const allSyllabuses = [
        ...SYLLABUS, ...BANK_PRELIMS_SYLLABUS, ...BANK_MAINS_SYLLABUS,
        ...RAILWAY_NTPC_CBT1_SYLLABUS, ...RAILWAY_NTPC_CBT2_SYLLABUS, ...RAILWAY_GROUP_D_SYLLABUS,
        ...RAILWAY_ALP_CBT1_SYLLABUS, ...RAILWAY_ALP_CBT2_SYLLABUS, ...SSC_CGL_TIER1_SYLLABUS,
        ...SSC_CGL_TIER2_SYLLABUS, ...SSC_CHSL_TIER1_SYLLABUS, ...SSC_CHSL_TIER2_SYLLABUS
    ];
    const map = new Map<string, SyllabusUnit>();
    allSyllabuses.forEach(unit => {
        if (!map.has(unit.id)) {
            map.set(unit.id, unit);
        }
    });
    return map;
};


const WorkPlanView: React.FC<WorkPlanViewProps> = ({ onGoBack }) => {
    const [allPlans, setAllPlans] = useState<PlanInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewingPlan, setViewingPlan] = useState<PlanInfo | null>(null);

    const [isCreatingPlan, setIsCreatingPlan] = useState(false);
    const [planScope, setPlanScope] = useState<'unit' | 'full'>('unit');
    const [selectedExam, setSelectedExam] = useState<ExamType>('TNPSC');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [selectedFullExamKey, setSelectedFullExamKey] = useState('');
    
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 29); // Default 30 days
        return d.toISOString().split('T')[0];
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const generationController = useRef<AbortController | null>(null);

    const fullExamSyllabusGroups = useMemo(() => ({
        'Bank Exam - Prelims': { syllabus: BANK_PRELIMS_SYLLABUS, examType: 'Bank Exam' as ExamType },
        'Bank Exam - Mains': { syllabus: BANK_MAINS_SYLLABUS, examType: 'Bank Exam' as ExamType },
        'SSC CGL - Tier 1': { syllabus: SSC_CGL_TIER1_SYLLABUS, examType: 'SSC' as ExamType },
        'SSC CGL - Tier 2': { syllabus: SSC_CGL_TIER2_SYLLABUS, examType: 'SSC' as ExamType },
        'SSC CHSL - Tier 1': { syllabus: SSC_CHSL_TIER1_SYLLABUS, examType: 'SSC' as ExamType },
        'SSC CHSL - Tier 2': { syllabus: SSC_CHSL_TIER2_SYLLABUS, examType: 'SSC' as ExamType },
        'Railway NTPC - CBT-1': { syllabus: RAILWAY_NTPC_CBT1_SYLLABUS, examType: 'Railway' as ExamType },
        'Railway NTPC - CBT-2': { syllabus: RAILWAY_NTPC_CBT2_SYLLABUS, examType: 'Railway' as ExamType },
        'Railway Group D': { syllabus: RAILWAY_GROUP_D_SYLLABUS, examType: 'Railway' as ExamType },
        'Railway ALP - CBT-1': { syllabus: RAILWAY_ALP_CBT1_SYLLABUS, examType: 'Railway' as ExamType },
        'Railway ALP - CBT-2': { syllabus: RAILWAY_ALP_CBT2_SYLLABUS, examType: 'Railway' as ExamType },
        'TNPSC - Prelims (All)': { syllabus: SYLLABUS.filter(u => !u.id.startsWith('mains-')), examType: 'TNPSC' as ExamType },
        'TNPSC - Mains (All)': { syllabus: SYLLABUS.filter(u => u.id.startsWith('mains-')), examType: 'TNPSC' as ExamType },
    }), []);

    const syllabusMap: Record<ExamType, SyllabusUnit[]> = useMemo(() => ({
        'TNPSC': SYLLABUS.filter(u => u.topics.length > 0 && !u.id.includes('english')),
        'Bank Exam': [...BANK_PRELIMS_SYLLABUS, ...BANK_MAINS_SYLLABUS],
        'Railway': [...RAILWAY_NTPC_CBT1_SYLLABUS, ...RAILWAY_NTPC_CBT2_SYLLABUS, ...RAILWAY_GROUP_D_SYLLABUS, ...RAILWAY_ALP_CBT1_SYLLABUS, ...RAILWAY_ALP_CBT2_SYLLABUS],
        'SSC': [...SSC_CGL_TIER1_SYLLABUS, ...SSC_CGL_TIER2_SYLLABUS, ...SSC_CHSL_TIER1_SYLLABUS, ...SSC_CHSL_TIER2_SYLLABUS],
    }), []);

    const availableUnitsForSinglePlan = syllabusMap[selectedExam];

     const studyDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) return 0;
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }, [startDate, endDate]);

    useEffect(() => {
        setIsLoading(true);
        try {
            const unitMap = buildUnitMap();
            const loadedPlans: PlanInfo[] = [];

            const keys = Object.keys(localStorage).filter(key => key.startsWith(STORAGE_KEY_PREFIX));
            
            for (const key of keys) {
                const examInfo = key.replace(`${STORAGE_KEY_PREFIX}_`, '').replace(/_/g, ' ');
                const plansData = JSON.parse(localStorage.getItem(key)!);
                
                for (const planId in plansData) {
                    const planData = plansData[planId];
                    if (planId.startsWith('full_exam_')) {
                        const fullExamKey = planId.replace('full_exam_', '');
                        const group = fullExamSyllabusGroups[fullExamKey as keyof typeof fullExamSyllabusGroups];
                        if (group && Array.isArray(planData)) {
                             loadedPlans.push({
                                storageKey: key,
                                exam: examInfo,
                                planName: fullExamKey,
                                unit: { id: planId, title: fullExamKey, topics: [] }, // Dummy unit
                                fullExamKey: planId,
                                // FIX: Cast planData to StudyPlanItem[] to ensure type safety from localStorage.
                                plan: planData as StudyPlanItem[],
                            });
                        }
                    } else {
                        const unit = unitMap.get(planId);
                        if (unit && Array.isArray(planData)) {
                            loadedPlans.push({
                                storageKey: key,
                                exam: examInfo,
                                planName: unit.title,
                                unit: unit,
                                // FIX: Cast planData to StudyPlanItem[] to ensure type safety from localStorage.
                                plan: planData as StudyPlanItem[],
                            });
                        }
                    }
                }
            }
            setAllPlans(loadedPlans.sort((a,b) => a.exam.localeCompare(b.exam) || a.planName.localeCompare(b.planName)));
        } catch (e) {
            console.error("Failed to load work plans", e);
        } finally {
            setIsLoading(false);
        }
    }, [fullExamSyllabusGroups]);
    
    const plansByExam = useMemo<{ [key: string]: PlanInfo[] }>(() => {
        return allPlans.reduce((acc, planInfo) => {
            const exam = planInfo.exam;
            if (!acc[exam]) acc[exam] = [];
            acc[exam].push(planInfo);
            return acc;
        }, {} as { [exam: string]: PlanInfo[] });
    }, [allPlans]);

    const handleGeneratePlan = async () => {
        if (studyDays < 1) {
             setGenerationError("End date must be after start date.");
             return;
        }

        if (generationController.current) generationController.current.abort();
        const controller = new AbortController();
        generationController.current = controller;

        setIsGenerating(true);
        setGenerationError(null);

        try {
            let unitsToPlan: SyllabusUnit[] = [];
            let planId: string = '';
            let examForAI: ExamType;
            let planName: string;
            
            if (planScope === 'unit') {
                if (!selectedUnitId) { setGenerationError("Please select a syllabus unit."); setIsGenerating(false); return; }
                const unit = availableUnitsForSinglePlan.find(u => u.id === selectedUnitId);
                if (!unit) throw new Error("Selected syllabus unit not found.");
                unitsToPlan = [unit];
                planId = unit.id;
                examForAI = selectedExam;
                planName = unit.title;
            } else { // 'full'
                if (!selectedFullExamKey) { setGenerationError("Please select an exam syllabus."); setIsGenerating(false); return; }
                const group = fullExamSyllabusGroups[selectedFullExamKey as keyof typeof fullExamSyllabusGroups];
                if (!group) throw new Error("Selected exam group not found.");
                unitsToPlan = group.syllabus;
                planId = `full_exam_${selectedFullExamKey}`;
                examForAI = group.examType;
                planName = selectedFullExamKey;
            }
            
            const planToAdd = await generateStudyPlan(unitsToPlan, studyDays, examForAI, controller.signal);

            if (controller.signal.aborted) return;
            
            if (!Array.isArray(planToAdd) || planToAdd.length === 0) {
                throw new Error("The AI failed to generate a study plan. Please try again or adjust the duration.");
            }
            
            const storageKey = `${STORAGE_KEY_PREFIX}_${examForAI.replace(/ /g, '_')}`;
            const existingPlansForExamRaw = localStorage.getItem(storageKey);
            const existingPlansForExam = existingPlansForExamRaw ? JSON.parse(existingPlansForExamRaw) : {};
            
            existingPlansForExam[planId] = planToAdd;
            localStorage.setItem(storageKey, JSON.stringify(existingPlansForExam));

            const newPlanInfo: PlanInfo = {
                storageKey,
                exam: examForAI,
                unit: planScope === 'unit' ? unitsToPlan[0] : { id: planId, title: planName, topics: [] },
                fullExamKey: planScope === 'full' ? planId : undefined,
                planName: planName,
                plan: planToAdd,
            };

            setAllPlans(prev => [...prev, newPlanInfo].sort((a,b) => a.exam.localeCompare(b.exam) || a.planName.localeCompare(b.planName)));
            setIsCreatingPlan(false);
            setViewingPlan(newPlanInfo);

        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setGenerationError(err.message);
            }
        } finally {
            if (!generationController.current?.signal.aborted) {
                setIsGenerating(false);
            }
        }
    };


    const handleStatusChange = (itemIndex: number, newStatus: StudyPlanItem['status']) => {
        if (!viewingPlan) return;

        const currentPlan = viewingPlan.plan;
        if (!Array.isArray(currentPlan)) return;

        const updatedPlanItems = currentPlan.map((item, index) => {
            if (index === itemIndex) {
                return { ...item, status: newStatus };
            }
            return item;
        });
        
        const newViewingPlan: PlanInfo = { ...viewingPlan, plan: updatedPlanItems };
        setViewingPlan(newViewingPlan);
        
        setAllPlans(prev => prev.map(p => 
            p.storageKey === viewingPlan.storageKey && (p.unit.id === viewingPlan.unit.id || p.fullExamKey === viewingPlan.fullExamKey)
            ? newViewingPlan 
            : p
        ));
        
        try {
            const allPlansForThisKeyRaw = localStorage.getItem(viewingPlan.storageKey);
            const allPlansForThisKey = allPlansForThisKeyRaw ? JSON.parse(allPlansForThisKeyRaw) : {};
            const planId = viewingPlan.fullExamKey || viewingPlan.unit.id;
            allPlansForThisKey[planId] = updatedPlanItems;
            localStorage.setItem(viewingPlan.storageKey, JSON.stringify(allPlansForThisKey));
        } catch (e) {
            console.error("Failed to save updated plan", e);
        }
    };
    
    const handleDeletePlan = (planToDelete: PlanInfo) => {
        setAllPlans(prev => prev.filter(p => !(p.storageKey === planToDelete.storageKey && (p.unit.id === planToDelete.unit.id || p.fullExamKey === planToDelete.fullExamKey))));
        setViewingPlan(null);

        try {
            const allPlansForThisKeyRaw = localStorage.getItem(planToDelete.storageKey);
            if (allPlansForThisKeyRaw) {
                const allPlansForThisKey = JSON.parse(allPlansForThisKeyRaw);
                const planId = planToDelete.fullExamKey || planToDelete.unit.id;
                delete allPlansForThisKey[planId];
                if (Object.keys(allPlansForThisKey).length === 0) {
                    localStorage.removeItem(planToDelete.storageKey);
                } else {
                    localStorage.setItem(planToDelete.storageKey, JSON.stringify(allPlansForThisKey));
                }
            }
        } catch (e) {
            console.error("Failed to delete plan from storage", e);
        }
    };
    
    const getStatusStyles = (status: StudyPlanItem['status']) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/30';
            case 'In Progress': return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
            default: return 'bg-slate-700/20 text-gray-400 border-slate-600/30';
        }
    };
    
    const getPriorityStyles = (priority: StudyPlanItem['priority']) => {
        switch (priority) {
            case 'High': return 'bg-red-500/20 text-red-300';
            case 'Medium': return 'bg-amber-500/20 text-amber-300';
            default: return 'bg-green-500/20 text-green-300';
        }
    };
    
    if (isLoading) {
        return <div className="py-24"><Loader message="Loading your work plans..." activeExamType="TNPSC" /></div>;
    }

    if (viewingPlan) {
        const { plan, planName, exam } = viewingPlan;
        const overallProgress = (Array.isArray(plan) && plan.length > 0) ? (plan.filter(i => i.status === 'Completed').length / plan.length) * 100 : 0;
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 page-transition-wrapper">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
                        <div>
                            <p className="text-sm font-semibold text-purple-400">{exam}</p>
                            <h1 className="text-3xl font-extrabold text-white">Study Plan: {planName}</h1>
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                             <button onClick={() => setViewingPlan(null)} className="btn btn-secondary">← All Plans</button>
                             <button onClick={() => handleDeletePlan(viewingPlan)} className="btn btn-secondary !bg-red-500/10 !border-red-500/20 text-red-300 hover:!bg-red-500/20 hover:text-red-200">Delete</button>
                        </div>
                    </div>
                    <div className="mb-8 p-4 bg-black/20 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-semibold text-purple-300">Overall Progress</span>
                             <span className="text-sm font-bold text-white">{overallProgress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-3 border border-white/10"><div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }} /></div>
                    </div>
                    <div className="space-y-4">
                        {Array.isArray(viewingPlan.plan) && viewingPlan.plan.map((item, index) => (
                            <div key={index} className="bg-slate-900/50 p-5 rounded-2xl border border-white/10">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-6"><p className="text-xs text-gray-400 font-bold">Day {item.startDay} - {item.endDay}</p><h3 className="text-xl font-bold text-white mt-1">{item.topicName}</h3><p className="text-sm text-gray-400 mt-2">{item.justification}</p></div>
                                    <div className="md:col-span-2 flex flex-col items-start md:items-center"><p className="text-xs text-gray-500 mb-1">Duration</p><span className="text-sm font-semibold bg-white/10 px-2 py-1 rounded-md">{item.durationDays} days</span></div>
                                    <div className="md:col-span-2 flex flex-col items-start md:items-center"><p className="text-xs text-gray-500 mb-1">Priority</p><span className={`text-sm font-semibold px-2 py-1 rounded-md ${getPriorityStyles(item.priority)}`}>{item.priority}</span></div>
                                    <div className="md:col-span-2"><p className="text-xs text-gray-500 mb-1">Status</p><select value={item.status} onChange={(e) => handleStatusChange(index, e.target.value as StudyPlanItem['status'])} className={`w-full p-2 text-sm font-semibold rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${getStatusStyles(item.status)}`}><option value="Not Started">Not Started</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 page-transition-wrapper">
             <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white">My Work Plans</h1>
                    <div className="flex items-center gap-4">
                         <button onClick={() => setIsCreatingPlan(prev => !prev)} className="btn btn-primary">{isCreatingPlan ? 'Cancel' : 'Create New Plan'}</button>
                         <button onClick={onGoBack} className="btn btn-secondary">← Back</button>
                    </div>
                </div>
                
                {isCreatingPlan && (
                    <div className="bg-slate-900/70 p-8 rounded-2xl border border-white/10 mb-12 item-animated-entry">
                        <h2 className="text-2xl font-bold text-white mb-6">Create New Study Plan</h2>
                        {isGenerating ? (
                             <Loader message="Generating your personalized plan..." activeExamType={selectedExam} />
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">1. Select Plan Scope</label>
                                    <div className="flex gap-4">
                                        <button onClick={() => setPlanScope('unit')} className={`flex-1 text-center p-3 rounded-lg border-2 font-semibold transition-colors ${planScope === 'unit' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:border-purple-600'}`}>Single Unit</button>
                                        <button onClick={() => setPlanScope('full')} className={`flex-1 text-center p-3 rounded-lg border-2 font-semibold transition-colors ${planScope === 'full' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:border-purple-600'}`}>Full Exam Syllabus</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {planScope === 'unit' ? (
                                        <>
                                            <div>
                                                <label htmlFor="exam-select" className="block text-sm font-semibold text-gray-300 mb-2">2. Select Exam</label>
                                                <select id="exam-select" value={selectedExam} onChange={e => {setSelectedExam(e.target.value as ExamType); setSelectedUnitId('');}} className="w-full p-3 bg-slate-800/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    {(Object.keys(syllabusMap) as string[]).map(exam => <option key={exam} value={exam}>{exam}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="unit-select" className="block text-sm font-semibold text-gray-300 mb-2">3. Select Syllabus Unit</label>
                                                <select id="unit-select" value={selectedUnitId} onChange={e => setSelectedUnitId(e.target.value)} className="w-full p-3 bg-slate-800/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" disabled={availableUnitsForSinglePlan.length === 0}>
                                                    <option value="">-- Choose a unit --</option>
                                                    {(availableUnitsForSinglePlan as SyllabusUnit[]).map(unit => <option key={unit.id} value={unit.id}>{unit.title}</option>)}
                                                </select>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="sm:col-span-2">
                                            <label htmlFor="full-exam-select" className="block text-sm font-semibold text-gray-300 mb-2">2. Select Full Exam Syllabus</label>
                                            <select id="full-exam-select" value={selectedFullExamKey} onChange={e => setSelectedFullExamKey(e.target.value)} className="w-full p-3 bg-slate-800/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                <option value="">-- Choose an exam syllabus --</option>
                                                {Object.keys(fullExamSyllabusGroups).map(key => <option key={key} value={key}>{key}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">4. Select Study Duration</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="start-date" className="text-xs text-gray-400">Start Date</label>
                                            <input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-3 mt-1 bg-slate-800/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                        <div>
                                            <label htmlFor="end-date" className="text-xs text-gray-400">End Date</label>
                                            <input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 mt-1 bg-slate-800/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                        </div>
                                    </div>
                                    {studyDays > 0 && <p className="text-center text-sm text-purple-300 mt-3 font-semibold">{studyDays} Day Plan</p>}
                                </div>
                                {generationError && <p className="text-red-400 text-sm font-semibold">{generationError}</p>}
                                <div className="text-right">
                                    <button onClick={handleGeneratePlan} className="btn btn-primary" disabled={studyDays < 1 || (planScope === 'unit' && !selectedUnitId) || (planScope === 'full' && !selectedFullExamKey)}>Generate Plan</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                {allPlans.length === 0 && !isCreatingPlan ? (
                     <div className="text-center py-16 bg-black/20 rounded-2xl border border-dashed border-white/10">
                        <p className="text-lg text-gray-400">You haven't created any study plans yet.</p>
                        <p className="text-sm text-gray-500 mt-2">Click "Create New Plan" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(plansByExam).map(([exam, planInfos]) => (
                            <div key={exam}>
                                <h2 className="text-2xl font-bold text-purple-300 mb-4 border-b-2 border-purple-500/30 pb-2">{exam}</h2>
                                <div className="space-y-4">
                                    {(planInfos as PlanInfo[]).map((planInfo) => {
                                        const progress = (Array.isArray(planInfo.plan) && planInfo.plan.length > 0) ? (planInfo.plan.filter(i => i.status === 'Completed').length / planInfo.plan.length) * 100 : 0;
                                        return (
                                            <div key={planInfo.fullExamKey || planInfo.unit.id} className="bg-slate-900/50 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold text-white">{planInfo.planName}</h3>
                                                    <div className="mt-2"><div className="flex justify-between items-center text-xs text-gray-400 mb-1"><span>Progress</span><span>{progress.toFixed(0)}%</span></div><div className="w-full bg-black/30 rounded-full h-1.5"><div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full" style={{ width: `${progress}%` }} /></div></div>
                                                </div>
                                                <div className="flex-shrink-0 flex gap-3 w-full sm:w-auto">
                                                    <button onClick={() => setViewingPlan(planInfo)} className="btn btn-secondary w-full sm:w-auto">View Plan</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkPlanView;
