

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
// FIX: Replaced non-existent TNPSC_MOCK_TEST_UNIT_DISTRIBUTION with TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION
import { SYLLABUS, TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION, BANK_PRELIMS_SYLLABUS, BANK_MAINS_SYLLABUS, BANK_PRELIMS_EXAM_PATTERN, BANK_MAINS_EXAM_PATTERN, RRB_BANK_PRELIMS_SYLLABUS, RRB_BANK_MAINS_SYLLABUS, RRB_BANK_PRELIMS_EXAM_PATTERN, RRB_BANK_MAINS_EXAM_PATTERN, RAILWAY_NTPC_CBT1_SYLLABUS, RAILWAY_NTPC_CBT2_SYLLABUS, RAILWAY_GROUP_D_SYLLABUS, RAILWAY_ALP_CBT1_SYLLABUS, RAILWAY_ALP_CBT2_SYLLABUS, RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION, RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION, RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION, RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION, RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION, RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION, SSC_CGL_TIER1_SYLLABUS, SSC_CGL_TIER2_SYLLABUS, SSC_CGL_TIER1_EXAM_PATTERN, SSC_CGL_TIER2_EXAM_PATTERN, SSC_CHSL_TIER1_SYLLABUS, SSC_CHSL_TIER2_SYLLABUS, SSC_CHSL_TIER1_EXAM_PATTERN, SSC_CHSL_TIER2_EXAM_PATTERN, TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION, TNPSC_GROUP1_PRELIMS_SYLLABUS, TNPSC_GROUP2_PRELIMS_SYLLABUS, TNPSC_GROUP4_PRELIMS_SYLLABUS, TNPSC_MAINS_SYLLABUS, SSC_JE_PAPER1_SYLLABUS, SSC_JE_PAPER1_EXAM_PATTERN } from './constants';
import { Question, Topic, SyllabusUnit, TestResult, Difficulty, DescriptiveQuestion, UserAnswer, Evaluation, Marks, MissedQuestion, MissedQuestionsStorage, ExamType, BankFilterType, RailwayExamFilterType, RailwayStageFilterType, TestMode, FileInfo, TestTopic, TopicQuestion, ResumableTest, SSCExamFilterType, SSCStageFilterType, BankExamFilterType, TNPSCGroupFilterType, TNPSCStageFilterType } from './types';
import { 
    generateMCQQuestions, generateDescriptiveQuestion, evaluateAnswer, generatePYQQuestions, 
    generateBankMCQQuestions, generateRailwayMCQQuestions, generateTNPSCMockTestQuestions, 
    generateBankMockTestQuestions, generateQuestionsFromPDFContent, extractTextFromPDF, 
    generateSSCMCQQuestions, generateSSCMockTestQuestions,
    generateRailwayMockTestQuestions
} from './services/aiService';
import * as dbService from './services/dbService';
import Sidebar from './components/Header';
import SyllabusView from './components/SyllabusView';
import TestView from './components/TestView';
import ResultsView from './components/ResultsView';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Footer from './components/Footer';
import DescriptiveTestView from './components/DescriptiveTestView';
import DescriptiveResultsView from './components/DescriptiveResultsView';
import PYQView from './components/PYQView';
import MockTestView from './components/MockTestView';
import BankMockTestView from './components/BankMockTestView';
import HistoryView from './components/HistoryView';
import RailwayMockTestView from './components/RailwayMockTestView';
import WeeklyPerformanceView from './components/WeeklyPerformanceView';
import SSCMockTestView from './components/SSCMockTestView';
import AiStudyNotesView from './components/AiStudyNotesView';
import FileUploadView from './components/FileUploadView';
import DownloadsView from './components/DownloadsModal';
import PdfScanningView from './components/PdfScanningView';
import TextExtractionsView from './components/TextExtractionsModal';
import ExamSelectionView from './components/ExamSelectionView';
import FilterNav from './components/FilterNav';
import StorageView from './components/StorageView';
import DashboardView from './components/DashboardView';

type View = 'home' | 'loading' | 'test' | 'results' | 'descriptiveTest' | 'descriptiveResults' | 'evaluating' | 'history' | 'aiStudyNotes' | 'textExtractions' | 'downloads' | 'examSelection' | 'weeklyPerformance' | 'storage' | 'dashboard';

declare global {
  interface Window {
    pdfjsLib: any;
    jspdf: any;
    html2canvas: any;
  }
}

const generateQuestionHash = (text: string): string => {
    let hash = 0;
    if (text.length === 0) return 'q_0';
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return `q_${hash}`;
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentTestTopicId, setCurrentTestTopicId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [resumableTest, setResumableTest] = useState<ResumableTest | null>(null);
  const [frequentlyMissed, setFrequentlyMissed] = useState<MissedQuestion[]>([]);
  const [testMode, setTestMode] = useState<TestMode>('test');
  const [testDuration, setTestDuration] = useState<number | undefined>(undefined);
  const [testDifficulty, setTestDifficulty] = useState<Difficulty>('Medium');

  const [isMainsTest, setIsMainsTest] = useState(false);
  const [descriptiveQuestion, setDescriptiveQuestion] = useState<DescriptiveQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<Evaluation | null>(null);

  const [activeExamType, setActiveExamType] = useState<ExamType | null>(null);
  // TNPSC Filters
  const [activeTNPSCGroupFilter, setActiveTNPSCGroupFilter] = useState<TNPSCGroupFilterType>('Group I');
  const [activeTNPSCStageFilter, setActiveTNPSCStageFilter] = useState<TNPSCStageFilterType>('PYQ');
  // Bank Filters
  const [activeBankFilter, setActiveBankFilter] = useState<BankFilterType>('Prelims');
  const [activeBankExamFilter, setActiveBankExamFilter] = useState<BankExamFilterType>('SBI');
  // Railway Filters
  const [activeRailwayExamFilter, setActiveRailwayExamFilter] = useState<RailwayExamFilterType>('NTPC');
  const [activeRailwayStageFilter, setActiveRailwayStageFilter] = useState<RailwayStageFilterType>('CBT-1');
  // SSC Filters
  const [activeSSCExamFilter, setActiveSSCExamFilter] = useState<SSCExamFilterType>('CGL');
  const [activeSSCStageFilter, setActiveSSCStageFilter] = useState<SSCStageFilterType>('Tier-1');
  
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);
  const [viewingHistoryResult, setViewingHistoryResult] = useState<TestResult | null>(null);

  const [loaderMessage, setLoaderMessage] = useState<string>('');
  const [testTopics, setTestTopics] = useState<TestTopic[]>([]);
  const [displayedSyllabus, setDisplayedSyllabus] = useState<SyllabusUnit[]>([]);
  const [scanningInfo, setScanningInfo] = useState<{ jobId: string; files: FileInfo[] } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const generationControllers = useRef<Map<string, AbortController>>(new Map());

  const handleSSCExamFilterChange = (filter: SSCExamFilterType) => {
    setActiveSSCExamFilter(filter);
    // When switching between CGL/CHSL and JE, reset the stage filter to a valid default.
    if (filter === 'JE') {
      setActiveSSCStageFilter('Paper-I');
    } else { // CGL, CHSL
      setActiveSSCStageFilter('Tier-1');
    }
  };
  
  const getSyllabusStorageKey = useCallback(() => {
    if (activeExamType === 'TNPSC') return `customSyllabus_${activeExamType}_${activeTNPSCGroupFilter}_${activeTNPSCStageFilter}`;
    if (activeExamType === 'Bank Exam') return `customSyllabus_${activeExamType}_${activeBankExamFilter}_${activeBankFilter}`;
    if (activeExamType === 'Railway') return `customSyllabus_${activeExamType}_${activeRailwayExamFilter}_${activeRailwayStageFilter}`;
    if (activeExamType === 'SSC') return `customSyllabus_${activeExamType}_${activeSSCExamFilter}_${activeSSCStageFilter}`;
    return `customSyllabus_${activeExamType}`;
  }, [activeExamType, activeTNPSCGroupFilter, activeTNPSCStageFilter, activeBankFilter, activeBankExamFilter, activeRailwayExamFilter, activeRailwayStageFilter, activeSSCExamFilter, activeSSCStageFilter]);

  const defaultSyllabusForView = useMemo(() => {
    if (!activeExamType) return [];
    if (activeExamType === 'Bank Exam') {
        if (activeBankExamFilter === 'RRB BANK') {
            return activeBankFilter === 'Mains' ? RRB_BANK_MAINS_SYLLABUS : RRB_BANK_PRELIMS_SYLLABUS;
        }
        return activeBankFilter === 'Mains' ? BANK_MAINS_SYLLABUS : BANK_PRELIMS_SYLLABUS;
    }
    if (activeExamType === 'Railway') {
        if (activeRailwayExamFilter === 'NTPC') {
            return activeRailwayStageFilter === 'CBT-2' ? RAILWAY_NTPC_CBT2_SYLLABUS : RAILWAY_NTPC_CBT1_SYLLABUS;
        }
        if (activeRailwayExamFilter === 'Group D') {
            return RAILWAY_GROUP_D_SYLLABUS;
        }
        if (activeRailwayExamFilter === 'RRB ALP') {
            return activeRailwayStageFilter.startsWith('CBT-2') ? RAILWAY_ALP_CBT2_SYLLABUS : RAILWAY_ALP_CBT1_SYLLABUS;
        }
        return []; // Custom/Unknown Railway Specific Exam
    }
    if (activeExamType === 'SSC') {
        if (activeSSCExamFilter === 'CGL') {
            return activeSSCStageFilter === 'Tier-2' ? SSC_CGL_TIER2_SYLLABUS : SSC_CGL_TIER1_SYLLABUS;
        }
        if (activeSSCExamFilter === 'CHSL') {
            return activeSSCStageFilter === 'Tier-2' ? SSC_CHSL_TIER2_SYLLABUS : SSC_CHSL_TIER1_SYLLABUS;
        }
        if (activeSSCExamFilter === 'JE') {
            return SSC_JE_PAPER1_SYLLABUS;
        }
        return []; // Custom/Unknown SSC Specific Exam
    }
    if (activeExamType === 'TNPSC') {
        if (activeTNPSCStageFilter === 'Mains') {
            return TNPSC_MAINS_SYLLABUS;
        }
        if (['PYQ', 'Full Mock Test', 'Upload Files'].includes(activeTNPSCStageFilter)) {
            return []; // No syllabus view for these modes
        }
        // Prelims logic
        if (activeTNPSCGroupFilter === 'Group I') {
            return TNPSC_GROUP1_PRELIMS_SYLLABUS;
        }
        if (activeTNPSCGroupFilter === 'Group II') {
            return TNPSC_GROUP2_PRELIMS_SYLLABUS;
        }
        if (activeTNPSCGroupFilter === 'Group IV') {
            return TNPSC_GROUP4_PRELIMS_SYLLABUS;
        }
        // Default to a comprehensive prelims syllabus if group is not set (e.g., for custom groups)
        return TNPSC_GROUP2_PRELIMS_SYLLABUS;
    }
    // Custom Exam Type
    return [];
  }, [activeExamType, activeTNPSCStageFilter, activeTNPSCGroupFilter, activeBankFilter, activeBankExamFilter, activeRailwayExamFilter, activeRailwayStageFilter, activeSSCExamFilter, activeSSCStageFilter]);

  useEffect(() => {
    const storageKey = getSyllabusStorageKey();
    try {
        const savedSyllabusRaw = localStorage.getItem(storageKey);
        if (savedSyllabusRaw) {
            const savedSyllabus = JSON.parse(savedSyllabusRaw);
            // Basic validation to ensure data structure is correct
            if (Array.isArray(savedSyllabus) && savedSyllabus.every(u => u.id && u.title && Array.isArray(u.topics))) {
                 setDisplayedSyllabus(savedSyllabus);
                 return;
            }
        }
    } catch (e) {
        console.error("Failed to load custom syllabus from localStorage", e);
    }
    setDisplayedSyllabus(defaultSyllabusForView);
  }, [defaultSyllabusForView, getSyllabusStorageKey]);

  const handleUpdateSyllabus = (newSyllabus: SyllabusUnit[]) => {
      setDisplayedSyllabus(newSyllabus);
      const storageKey = getSyllabusStorageKey();
      try {
          localStorage.setItem(storageKey, JSON.stringify(newSyllabus));
      } catch (e) {
          console.error("Failed to save custom syllabus", e);
          setError("Could not save syllabus changes. Your browser's storage might be full.");
      }
  };


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);

      const xOffset = -(clientX - innerWidth / 2) / 50;
      const yOffset = -(clientY - innerHeight / 2) / 50;
      document.documentElement.style.setProperty('--mouse-bg-x', `${xOffset}px`);
      document.documentElement.style.setProperty('--mouse-bg-y', `${yOffset}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  useEffect(() => {
    const loadDataFromDB = async () => {
        try {
            const loadedTopics = await dbService.getTestTopics();
            const restoredTopics = loadedTopics.map(topic => {
                const isGenerationInterrupted = topic.generationStatus === 'processing';
                const files = topic.files ? topic.files.map(file => {
                    if (file.status === 'uploading') {
                        return { ...file, status: 'error' as const, errorMessage: 'Upload interrupted.', progress: 0 };
                    }
                    return file;
                }) : undefined;

                return {
                    ...topic,
                    examType: topic.examType || 'TNPSC', // Assign default for older data
                    files,
                    generationStatus: isGenerationInterrupted ? 'error' : (topic.generationStatus || 'idle'),
                    generationError: isGenerationInterrupted ? 'Process was interrupted. Please retry.' : topic.generationError,
                    generationProgress: isGenerationInterrupted ? 0 : topic.generationProgress,
                };
            });
            setTestTopics(restoredTopics);
        } catch (e) {
            console.error("Failed to load saved topics from IndexedDB:", e);
            setError("Could not load your saved documents. Your browser might be in private mode or has storage disabled.");
        }
    };
    loadDataFromDB();
  }, []);


  useEffect(() => {
    try {
      const savedTestSession = localStorage.getItem('aiexam-test-session');
      if (savedTestSession) {
        const parsedSession = JSON.parse(savedTestSession);
        if (parsedSession && parsedSession.topic && parsedSession.topic.name) {
          setResumableTest(parsedSession);
        } else {
          localStorage.removeItem('aiexam-test-session');
          localStorage.removeItem('aiexam-test-progress');
        }
      }
    } catch (e) {
      console.error("Failed to parse saved test session", e);
      localStorage.removeItem('aiexam-test-session');
      localStorage.removeItem('aiexam-test-progress');
    }

    try {
      const savedMissedQuestions = localStorage.getItem('aiexam-missed-questions');
      if (savedMissedQuestions) {
        const missedQuestionsData: MissedQuestionsStorage = JSON.parse(savedMissedQuestions);
        const sortedMissed = Object.values(missedQuestionsData)
          .sort((a: MissedQuestion, b: MissedQuestion) => b.missedCount - a.missedCount)
          .slice(0, 10);
        setFrequentlyMissed(sortedMissed);
      }
    } catch (e) {
      console.error("Failed to parse missed questions", e);
      localStorage.removeItem('aiexam-missed-questions');
    }

    try {
        const savedHistory = localStorage.getItem('aiexam-test-history');
        if (savedHistory) {
            const parsedHistory: TestResult[] = JSON.parse(savedHistory);
            
            const migratedHistory = parsedHistory
            .filter(res => res && res.topic && res.topic.name && res.topic.unit && Array.isArray(res.questions) && res.questions.length > 0)
            .map(res => {
                const totalCount = res.totalCount ?? res.questions?.length ?? 0;
                
                const correctCount = res.correctCount ?? (Array.isArray(res.questions) && Array.isArray(res.userAnswers) ? res.questions.reduce((acc, q, i) => (res.userAnswers[i] === q.correctOption ? acc + 1 : acc), 0) : 0);

                const incorrectCount = res.incorrectCount ?? (Array.isArray(res.questions) && Array.isArray(res.userAnswers) ? res.questions.reduce((acc, q, i) => (res.userAnswers[i] && res.userAnswers[i] !== q.correctOption ? acc + 1 : acc), 0) : 0);

                const examType: ExamType = (res.examType as ExamType) || 
                    (res.topic.name.toLowerCase().includes('bank') ? 'Bank Exam' : 
                    (res.topic.name.toLowerCase().includes('railway') ? 'Railway' : 
                    (res.topic.name.toLowerCase().includes('ssc') ? 'SSC' : 'TNPSC')));
                
                const score = (res.score === null || res.score === undefined) 
                    ? (totalCount > 0 ? (correctCount / totalCount) * 100 : 0) 
                    : res.score;
                
                let marks = 0;
                let totalMarks = totalCount * 1;

                if (examType === 'Bank Exam') {
                    marks = (correctCount * 1) - (incorrectCount * 0.25);
                    totalMarks = totalCount * 1;
                } else if (examType === 'Railway') {
                    marks = (correctCount * 1) - (incorrectCount * (1/3));
                    totalMarks = totalCount * 1;
                } else if (examType === 'SSC') {
                    const isTier1 = res.topic.name.toLowerCase().includes('tier-1');
                    const marksPerQuestion = isTier1 ? 2 : 3;
                    const negativeMark = isTier1 ? 0.50 : 1.0;
                    marks = (correctCount * marksPerQuestion) - (incorrectCount * negativeMark);
                    totalMarks = totalCount * marksPerQuestion;
                } else { // TNPSC
                    marks = correctCount * 1;
                    totalMarks = totalCount * 1;
                }
                
                return {
                    ...res,
                    score: Number.isFinite(score) ? score : 0,
                    correctCount: correctCount || 0,
                    incorrectCount: incorrectCount || 0,
                    totalCount: totalCount || 0,
                    examType,
                    bookmarks: res.bookmarks || new Array(totalCount).fill(false),
                    marks: Number.isFinite(res.marks) ? res.marks : marks,
                    totalMarks: Number.isFinite(res.totalMarks) ? res.totalMarks : totalMarks,
                    timeTakenInSeconds: res.timeTakenInSeconds ?? totalCount * 60,
                };
            });

            setTestHistory(migratedHistory);
        }
    } catch(e) {
        console.error("Failed to parse test history", e);
        localStorage.removeItem('aiexam-test-history');
    }
  }, []);

  const handleShowDownloads = useCallback(() => setView('downloads'), []);
  const handleShowTextExtractions = useCallback(() => setView('textExtractions'), []);

  const handleDownloadPdf = useCallback(async (result: TestResult, options?: { showScore?: boolean }) => {
    setIsGeneratingPdf(true);
    setError(null);
    const showScore = options?.showScore ?? true;

    if (typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') {
        setError("PDF libraries not loaded. Please try again later.");
        setIsGeneratingPdf(false);
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a3', hotfixes: ['px_scaling'] });

    const renderMarkdownToString = (text: string | undefined): string => {
        if (!text) return '';
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
    };
    
    const css = `
        body { font-family: 'Helvetica', 'Arial', sans-serif; background: #fff; color: #1f2937; margin: 0; padding: 0; }
        .page { width: 1100px; padding: 60px; margin: 0 auto; page-break-after: always; display: flex; flex-direction: column; }
        .title-page { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; flex-grow: 1; }
        .title-page h1 { font-size: 96px; font-weight: 900; color: #111827; margin: 0 0 40px 0; line-height: 1.1; max-width: 90%; }
        .title-page h2 { font-size: 40px; font-weight: 700; color: #4b5563; margin: 0 0 20px 0; }
        .title-page p { font-size: 28px; color: #6b7280; margin: 15px 0; }
        .title-page .score { font-size: 150px; font-weight: 900; color: #4f46e5; margin-top: 80px; line-height: 1; }
        .question-card { border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; background: #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; }
        .q-info { display: flex; align-items: center; gap: 16px; }
        .q-badge-box { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 22px; }
        .q-title { font-size: 22px; font-weight: 700; color: #111827; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 9999px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
        .status-icon { width: 16px; height: 16px; }
        .q-text { font-size: 20px; font-weight: 600; margin-bottom: 24px; line-height: 1.7; color: #1f2937; }
        .context-box { background: #fffbeb; border-left: 5px solid #f59e0b; padding: 20px; margin-bottom: 24px; font-size: 16px; color: #92400e; border-radius: 4px; line-height: 1.6; }
        .options-grid { display: flex; flex-direction: column; gap: 12px; }
        .option { padding: 16px 20px; border: 1px solid #e5e7eb; border-radius: 10px; font-size: 17px; display: flex; justify-content: space-between; align-items: center; background: #fff; }
        .opt-content { display: flex; align-items: center; gap: 14px; flex-grow: 1; }
        .option-label { font-weight: 700; color: #374151; font-size: 16px; }
        .option-text { color: #374151; line-height: 1.5; }
        .icon-wrapper { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .opt-icon { width: 24px; height: 24px; }
        .opt-icon-neutral { width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 50%; }
        .opt-correct { background: #f0fdf4; border-color: #22c55e; color: #14532d; }
        .opt-incorrect { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
        .user-marker { font-size: 12px; font-weight: 800; color: #6b7280; text-transform: uppercase; white-space: nowrap; margin-left: 12px; }
        .explanation { margin-top: 28px; background: #f9fafb; border-radius: 10px; padding: 24px; border: 1px solid #e5e7eb; }
        .exp-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .exp-icon { width: 24px; height: 24px; color: #6366f1; }
        .exp-title { font-weight: 700; font-size: 18px; color: #1e293b; }
        .exp-text { font-size: 16px; color: #475569; line-height: 1.7; }
        .diagram-container svg { max-width: 100%; height: auto; }
        .diagram-container svg path, .diagram-container svg line, .diagram-container svg polyline, .diagram-container svg circle, .diagram-container svg rect, .diagram-container svg ellipse { stroke: #374151 !important; fill: none !important; }
        .diagram-container svg text, .diagram-container svg tspan { fill: #1f2937 !important; stroke: none !important; font-family: sans-serif; font-size: 14px; }
    `;

    const createHtmlForSingleQuestion = (q: Question, index: number): string => {
       const userAnswer = result.userAnswers[index];
        const isCorrect = userAnswer === q.correctOption;
        const isSkipped = !userAnswer;
        
        let statusColor = isSkipped ? '#6b7280' : isCorrect ? '#16a34a' : '#dc2626';
        let statusBg = isSkipped ? '#f3f4f6' : isCorrect ? '#dcfce7' : '#fee2e2';
        
        let optionItems = '';
        Object.entries(q.options).forEach(([key, val]) => {
            let optClass = 'option'; let icon = ''; let marker = '';
            const isUserAnswer = key === userAnswer; const isCorrectAnswer = key === q.correctOption;
            if (isCorrectAnswer) { optClass += ' opt-correct'; icon = `<svg class="opt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="color: #16a34a;"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`; }
            else if (isUserAnswer) { optClass += ' opt-incorrect'; icon = `<svg class="opt-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="color: #dc2626;"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.697a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`; }
            else { icon = `<div class="opt-icon-neutral"></div>`; }
            if (isUserAnswer) marker = '<span class="user-marker">(Your Answer)</span>';
            optionItems += `<div class="${optClass}"><div class="opt-content"><div class="icon-wrapper">${icon}</div><span class="option-label">${key}.</span><span class="option-text">${renderMarkdownToString(val)}</span></div>${marker}</div>`;
        });

        return `
        <div class="page">
            <div class="question-card">
                <div class="q-header"><div class="q-info"><div class="q-badge-box" style="background-color: ${statusBg}; color: ${statusColor};">${index + 1}</div><span class="q-title">Question ${index + 1}</span></div><span class="status-badge" style="background-color: ${statusBg}; color: ${statusColor};">${isCorrect ? '<svg class="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>' : '<svg class="status-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>'}${isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}</span></div>
                ${q.commonContext ? `<div class="context-box"><strong>Context:</strong><br/>${renderMarkdownToString(q.commonContext)}</div>` : ''}
                <div class="q-text">${renderMarkdownToString(q.questionText)}</div>
                ${q.commonContextDiagramSvg ? `<div class="diagram-container" style="text-align:center; margin-bottom:20px;">${q.commonContextDiagramSvg}</div>` : ''}
                <div class="options-grid">${optionItems}</div>
                <div class="explanation"><div class="exp-header"><svg class="exp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg><span class="exp-title">Explanation</span></div><div class="exp-text">${renderMarkdownToString(q.explanation)}${q.explanationDiagramSvg ? `<div class="diagram-container" style="text-align:center; margin-top:10px;">${q.explanationDiagramSvg}</div>` : ''}</div></div>
            </div>
        </div>`;
    };
    
    try {
        const titlePageHtml = `
            <div class="page">
                <div class="title-page">
                    <h2>AI Exam Prep</h2>
                    <h1>${result.topic.name}</h1>
                    <p>Generated on: ${new Date(result.date).toLocaleDateString()}</p>
                    ${showScore ? `<div class="score">${result.score.toFixed(0)}%</div>` : ''}
                </div>
            </div>`;
        
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '1100px';
        tempContainer.innerHTML = `<style>${css}</style>${titlePageHtml}`;
        document.body.appendChild(tempContainer);
        
        const titlePageElement = tempContainer.querySelector('.page') as HTMLElement;
        if (titlePageElement) {
            const a3Ratio = 1.414; // sqrt(2)
            titlePageElement.style.height = `${titlePageElement.offsetWidth * a3Ratio}px`;
        }

        const titleCanvas = await window.html2canvas(tempContainer.querySelector('.page') as HTMLElement, { scale: 2, useCORS: true });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        let canvasHeight = titleCanvas.height;
        let canvasWidth = titleCanvas.width;
        let ratio = canvasWidth / pdfWidth;
        let projectedImgHeight = canvasHeight / ratio;

        pdf.addImage(titleCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, projectedImgHeight);
        document.body.removeChild(tempContainer);

        for (const [index, q] of result.questions.entries()) {
            pdf.addPage();
            const questionHtml = createHtmlForSingleQuestion(q, index);

            const qContainer = document.createElement('div');
            qContainer.style.position = 'absolute';
            qContainer.style.left = '-9999px';
            qContainer.style.width = '1100px';
            qContainer.innerHTML = `<style>${css}</style>${questionHtml}`;
            document.body.appendChild(qContainer);

            const qCardElement = qContainer.querySelector('.question-card') as HTMLElement;

            const images = Array.from(qCardElement.querySelectorAll('img, image'));
            await Promise.all(images.map(img => new Promise<void>(resolve => {
                const handleLoad = () => resolve();
                const handleError = () => { img.remove(); resolve(); };
                if ((img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0) {
                     handleLoad();
                } else if ((img as HTMLImageElement).complete) {
                     handleError();
                } else {
                    img.addEventListener('load', handleLoad);
                    img.addEventListener('error', handleError);
                }
            })));

            const qCanvas = await window.html2canvas(qCardElement, { scale: 2, useCORS: true });
            canvasHeight = qCanvas.height;
            canvasWidth = qCanvas.width;
            ratio = canvasWidth / pdfWidth;
            projectedImgHeight = canvasHeight / ratio;

            const yPosition = (pdfHeight > projectedImgHeight) ? (pdfHeight - projectedImgHeight) / 2 : 0;
            pdf.addImage(qCanvas.toDataURL('image/png'), 'PNG', 0, yPosition, pdfWidth, projectedImgHeight);
            
            document.body.removeChild(qContainer);
        }

        pdf.save(`AI-Exam-Prep-${result.topic.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

    } catch (e) {
        console.error("Error generating PDF:", e);
        setError("Sorry, there was an issue creating the PDF file. This can happen with complex diagrams.");
    } finally {
        setIsGeneratingPdf(false);
    }
  }, []);

  const handleUpdateTestHistory = (updater: React.SetStateAction<TestResult[]>) => {
      const newHistory = typeof updater === 'function' ? updater(testHistory) : updater;
      setTestHistory(newHistory);
      localStorage.setItem('aiexam-test-history', JSON.stringify(newHistory));
  };

  const handleUpdateSingleResult = (updatedResult: TestResult) => {
    const newHistory = testHistory.map(res => res.id === updatedResult.id ? updatedResult : res);
    handleUpdateTestHistory(newHistory);
    if (viewingHistoryResult?.id === updatedResult.id) {
        setViewingHistoryResult(updatedResult);
    }
  };

  const handleUpdateTestTopics = (updater: React.SetStateAction<TestTopic[]>) => {
    setTestTopics(prevTopics => {
        const newTopics = typeof updater === 'function' ? updater(prevTopics) : updater;
        
        const prevIds = new Set(prevTopics.map(t => t.id));
        const newIds = new Set(newTopics.map(t => t.id));

        const addedOrUpdated = newTopics;
        const deleted = prevTopics.filter(t => !newIds.has(t.id));

        Promise.all([
            ...addedOrUpdated.map(t => dbService.saveTestTopic(t)),
            ...deleted.map(t => dbService.deleteTestTopic(t.id))
        ]).catch(err => {
            console.error("DB Sync failed", err);
            setError("Failed to save changes to your documents.");
        });

        return newTopics;
    });
  };
  
  const handleClearAllData = async () => {
      await dbService.clearAllTopics();
      localStorage.removeItem('aiexam-test-session');
      localStorage.removeItem('aiexam-test-progress');
      localStorage.removeItem('aiexam-missed-questions');
      localStorage.removeItem('aiexam-test-history');
      window.location.reload();
  };

  const handleCancelGeneration = (topicId: string) => {
    const controller = generationControllers.current.get(topicId);
    if (controller) {
        controller.abort();
    }
  };
  
  const runGenerationProcess = async (
    jobId: string,
    generationFn: (updateProgress: (progress: number, text: string, currentStepIndex?: number) => void, signal: AbortSignal) => Promise<Question[]>,
    initialProgressText: string = 'Initializing...',
    generationSteps?: string[]
  ) => {
    const controller = new AbortController();
    generationControllers.current.set(jobId, controller);

    const updateProgress = (progress: number, text: string, currentStepIndex?: number) => {
        handleUpdateTestTopics(prev => prev.map(t => {
            if (t.id === jobId) {
                return { ...t, generationProgress: progress, progressText: text, ...(currentStepIndex !== undefined && { currentStepIndex }) };
            }
            return t;
        }));
    };

    try {
        handleUpdateTestTopics(prev => prev.map(t => t.id === jobId ? { ...t, generationProgress: 2, progressText: initialProgressText, generationSteps, currentStepIndex: 0 } : t));
        
        const generatedQuestions = await generationFn(updateProgress, controller.signal);
        
        if (controller.signal.aborted) {
             const abortError = new Error('Aborted by user');
             abortError.name = 'AbortError';
             throw abortError;
        }
        
        if (!generatedQuestions || generatedQuestions.length === 0) {
            throw new Error("AI failed to generate questions. The topic may not be suitable or the service may be busy.");
        }
        
        updateProgress(100, 'Completed!', generationSteps ? generationSteps.length - 1 : undefined);
        handleUpdateTestTopics(prev => prev.map(t => t.id === jobId ? { ...t, generationStatus: 'completed', generatedQuestions } : t));

    } catch (err) {
        if ((err as Error).name === 'AbortError') {
            handleUpdateTestTopics(prev => prev.map(t => t.id === jobId ? { ...t, generationStatus: 'error', generationError: 'Generation cancelled by user.', progressText: 'Cancelled', generationProgress: 0 } : t));
        } else {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            handleUpdateTestTopics(prev => prev.map(t => t.id === jobId ? { ...t, generationStatus: 'error', generationError: errorMessage, progressText: 'Error', generationProgress: 0 } : t));
        }
    } finally {
        generationControllers.current.delete(jobId);
    }
  };

  const handleStartFileGeneration = useCallback(async (topicId: string, numQuestions: number, difficulty: Difficulty, mode: TestMode) => {
    const sourceTopic = testTopics.find(t => t.id === topicId);
    if (!sourceTopic || sourceTopic.sourceType !== 'pdf' || !sourceTopic.files) {
        setError("Could not start test generation: source topic is invalid.");
        return;
    }

    const newJob: TestTopic = {
        id: `job_${Date.now()}`,
        topicName: sourceTopic.topicName,
        sourceType: 'pdf',
        createdAt: new Date().toISOString(),
        examType: sourceTopic.examType,
        sourceDetails: {
            description: `Custom Test from ${sourceTopic.files.length} file(s)`,
            sourcePdfTopicId: sourceTopic.id,
        },
        generationStatus: 'processing',
        generationProgress: 0,
        progressText: 'Initializing...',
        generationConfig: { numQuestions, difficulty, mode },
    };

    handleUpdateTestTopics(prev => [newJob, ...prev]);
    setView('history');
    
    setScanningInfo({ jobId: newJob.id, files: sourceTopic.files });
    setTimeout(() => {
        setScanningInfo(null);
    }, 10000);
    
    const generationFn = async (updateProgress: (progress: number, text: string) => void, signal: AbortSignal): Promise<Question[]> => {
        let combinedRawText = '';
        const pdfFiles = sourceTopic.files!.filter(file => 
            file.mimeType === 'application/pdf' || file.fileName.toLowerCase().endsWith('.pdf')
        );

        if (pdfFiles.length === 0) {
            throw new Error("No PDF files found in this topic to generate questions from.");
        }

        for (const [index, file] of pdfFiles.entries()) {
            const progress = 10 + Math.round(((index + 1) / pdfFiles.length) * 20);
            updateProgress(progress, `Extracting text from ${file.fileName}...`);
            let fileContent = file.fileContentBase64;
            if (!fileContent) {
                 const fullTopicFromDB = await dbService.getTestTopics().then(topics => topics.find(t => t.id === sourceTopic.id));
                 const fullFile = fullTopicFromDB?.files?.find(f => f.id === file.id);
                 if (fullFile?.fileContentBase64) {
                     fileContent = fullFile.fileContentBase64;
                 } else {
                     throw new Error(`File content for "${file.fileName}" is missing. Please re-upload.`);
                 }
            }
            const text = await extractTextFromPDF(fileContent);
            combinedRawText += text + '\n\n---\n\n';
        }
        
        if (!combinedRawText.trim()) {
            throw new Error("PDF documents appear to be empty or contain no readable text.");
        }
        
        const topicForAI: Topic = { 
            name: sourceTopic.topicName, 
            unit: `Custom Topic` 
        };
        return generateQuestionsFromPDFContent(combinedRawText, topicForAI, numQuestions, difficulty, sourceTopic.examType, updateProgress, signal);
    };
    
    runGenerationProcess(newJob.id, generationFn as any, 'Analyzing files...');
  }, [testTopics]);

  const handleStartGeneratedTest = (topicId: string) => {
    setCurrentTestTopicId(topicId);
    const topic = testTopics.find(t => t.id === topicId);
    if (topic && topic.generatedQuestions && topic.generationConfig) {
        const testTopic: Topic = {
            name: topic.topicName,
            unit: topic.sourceDetails?.description || `Custom Test`
        };
        handleGenerationComplete(topic.generatedQuestions, testTopic, topic.generationConfig);
    }
  };
  
  const handleStartMCQTest = (topicOrTopics: Topic | Topic[], numQuestions: number, difficulty: Difficulty, mode: TestMode, examTypeForTopic: ExamType, durationInMinutes?: number) => {
      const topics = Array.isArray(topicOrTopics) 
        ? (topicOrTopics as Topic[]) 
        : [topicOrTopics as Topic];

      if (topics.length === 0) {
        console.error("handleStartMCQTest called with no topics.");
        return;
      }
      
      const isCombined = topics.length > 1;
      
      const topicName = isCombined ? 'Combined Test' : topics[0].name;
      const description = isCombined ? `${topics.length} topics selected` : topics[0].unit;

      const generationSteps = isCombined 
        ? ['Initializing', ...(topicOrTopics as Topic[]).map(t => `Topic ${t.name.substring(0, 10)}...`), 'Finalizing']
        : undefined;

      const newJob: TestTopic = {
          id: `job_${Date.now()}`,
          topicName: topicName,
          sourceType: 'syllabus',
          createdAt: new Date().toISOString(),
          examType: examTypeForTopic,
          sourceDetails: {
              description,
              sourceTopics: topicOrTopics,
          },
          generationStatus: 'processing',
          generationProgress: 0,
          progressText: 'Initializing...',
          generationConfig: { numQuestions, difficulty, mode, durationInMinutes },
          generationSteps,
      };

      handleUpdateTestTopics(prev => [newJob, ...prev]);
      setView('history');

      let questionGenerator;
      if (examTypeForTopic === 'Bank Exam') questionGenerator = generateBankMCQQuestions;
      else if (examTypeForTopic === 'Railway') questionGenerator = generateRailwayMCQQuestions;
      else if (examTypeForTopic === 'SSC') questionGenerator = generateSSCMCQQuestions;
      else questionGenerator = generateMCQQuestions;
      
      const generationFn = async (updateProgress: (progress: number, text: string, currentStepIndex?: number) => void, signal: AbortSignal): Promise<Question[]> => {
          if (isCombined) {
              const allQuestions: Question[] = [];
              const numTopics = topics.length;
              const baseQuestionsPerTopic = Math.floor(numQuestions / numTopics);
              let remainder = numQuestions % numTopics;

              for (const [index, topic] of topics.entries()) {
                  if (signal.aborted) {
                    const abortError = new Error('Aborted by user');
                    abortError.name = 'AbortError';
                    throw abortError;
                  }
                  const numForThisTopic = baseQuestionsPerTopic + (remainder > 0 ? 1 : 0);
                  if (remainder > 0) remainder--;
                  if (numForThisTopic === 0) continue;
                  
                  const stepIndex = index + 1;
                  const progress = 10 + Math.round(((stepIndex) / (numTopics + 1)) * 80);
                  updateProgress(progress, `Generating: ${topic.name}...`, stepIndex);
                  
                  const questions = await questionGenerator(topic, numForThisTopic, difficulty, undefined, signal);
                  allQuestions.push(...questions.map(q => ({...q, section: q.section || topic.unit})));
              }
              return allQuestions;
          } else {
              updateProgress(50, `Generating: ${newJob.topicName}...`);
              return questionGenerator(topicOrTopics, numQuestions, difficulty, undefined, signal);
          }
      };

      runGenerationProcess(newJob.id, generationFn as any, 'Initializing...', generationSteps);
  };
  
  const handleGenerationComplete = (generatedQuestions: Question[], topic: Topic, config: TestTopic['generationConfig']) => {
    if (generatedQuestions.length === 0) {
        setError('The AI could not generate questions from the provided file(s).');
        setView('home');
        return;
    }
    
    setSelectedTopic(topic);
    setQuestions(generatedQuestions);
    setUserAnswers(new Array(generatedQuestions.length).fill(''));
    setTestMode(config?.mode || 'practice');
    setTestDuration(config?.durationInMinutes);
    setTestDifficulty(config?.difficulty || 'Medium');
    setView('test');
    
    localStorage.removeItem('aiexam-test-session');
    localStorage.removeItem('aiexam-test-progress');
  };

  const handleStartPYQTest = (year: number, group: string, numQuestions: number, isSimulated: boolean, examType: ExamType) => {
      const topicName = `PYQ: ${group} - ${year} ${isSimulated ? '(Simulated)' : ''}`;
      
      const newJob: TestTopic = {
          id: `job_${Date.now()}`,
          topicName: topicName,
          sourceType: 'pyq',
          createdAt: new Date().toISOString(),
          examType: examType,
          sourceDetails: {
              description: 'Previous Year Questions',
              pyqConfig: { year, group, isSimulated },
          },
          generationStatus: 'processing',
          generationProgress: 0,
          progressText: 'Initializing...',
          generationConfig: { numQuestions, difficulty: 'Mixed', mode: 'test', durationInMinutes: numQuestions * 1 },
      };

      handleUpdateTestTopics(prev => [newJob, ...prev]);
      setView('history');

      runGenerationProcess(newJob.id, (updateProgress, signal) => {
        updateProgress(50, `Generating: ${newJob.topicName}...`);
        return generatePYQQuestions(year, group, numQuestions, isSimulated, examType, signal);
      });
  };
  
  const handleStartMockTest = (difficulty: Difficulty) => {
      const isGroup1 = activeTNPSCGroupFilter === 'Group I';
      const topicName = isGroup1 ? 'Full Mock Test (Group I Prelims)' : 'Full Mock Test (Prelims)';
      // FIX: Replace non-existent TNPSC_MOCK_TEST_UNIT_DISTRIBUTION with TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION.
      const distribution = isGroup1 ? TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION : TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION;
      const numQuestions = distribution.reduce((sum, s) => sum + s.questionCount, 0);
      const duration = 180;

      const generationSteps = ['Init', ...distribution.map(s => s.name.split(' ')[0]), 'Finalizing'];
      const newJob: TestTopic = {
          id: `job_${Date.now()}`,
          topicName,
          sourceType: 'mock',
          createdAt: new Date().toISOString(),
          examType: 'TNPSC',
          sourceDetails: {
              description: `TNPSC ${isGroup1 ? 'Group I' : ''} Full Syllabus`,
              mockConfig: { examType: 'TNPSC', type: 'Prelims', group: activeTNPSCGroupFilter },
          },
          generationStatus: 'processing',
          generationProgress: 0,
          progressText: 'Initializing...',
          generationConfig: { numQuestions, difficulty, mode: 'test', durationInMinutes: duration },
          generationSteps,
      };
      handleUpdateTestTopics(prev => [newJob, ...prev]);
      setView('history');
      runGenerationProcess(newJob.id, (updateProgress, signal) => 
        generateTNPSCMockTestQuestions(difficulty, updateProgress, signal, undefined, activeTNPSCGroupFilter),
        'Initializing Mock Test...',
        generationSteps
      );
  };

  const handleStartBankMockTest = (type: 'Prelims' | 'Mains', difficulty: Difficulty) => {
      const isRRB = activeBankExamFilter === 'RRB BANK';
      const topicName = `${activeBankExamFilter} ${type} Full Mock Test`;
      let duration: number;
      let numQuestions: number;
      let examPattern: any[];
      let generationSteps: string[];

      if (type === 'Prelims') {
          if (isRRB) {
              duration = 45;
              examPattern = RRB_BANK_PRELIMS_EXAM_PATTERN;
          } else {
              duration = 60;
              examPattern = BANK_PRELIMS_EXAM_PATTERN;
          }
      } else { // Mains
          if (isRRB) {
              duration = 120; // 2 hours
              examPattern = RRB_BANK_MAINS_EXAM_PATTERN;
          } else {
              duration = 180;
              examPattern = BANK_MAINS_EXAM_PATTERN;
          }
      }

      numQuestions = examPattern.reduce((s, u) => s + u.questions, 0);
      generationSteps = ['Init', ...examPattern.map(p => p.section.split(' ')[0]), 'Done'];

      const newJob: TestTopic = {
          id: `job_${Date.now()}`,
          topicName,
          sourceType: 'mock',
          createdAt: new Date().toISOString(),
          examType: 'Bank Exam',
          sourceDetails: {
              description: `${activeBankExamFilter} ${type} Syllabus`,
              mockConfig: { examType: 'Bank Exam', type, examName: activeBankExamFilter },
          },
          generationStatus: 'processing',
          generationProgress: 0,
          progressText: 'Initializing...',
          generationConfig: { numQuestions, difficulty, mode: 'test', durationInMinutes: duration },
          generationSteps,
      };
      handleUpdateTestTopics(prev => [newJob, ...prev]);
      setView('history');

      runGenerationProcess(newJob.id, (updateProgress, signal) => 
        generateBankMockTestQuestions(type, difficulty, updateProgress, signal),
        'Initializing Mock Test...',
        generationSteps
      );
  };
  
  const handleStartRailwayMockTest = (exam: RailwayExamFilterType, stage: 'CBT-1' | 'CBT-2' | 'Part B', difficulty: Difficulty) => {
      const stageName = stage === 'CBT-2' ? 'CBT-2 (Part A)' : stage;
      const topicName = `Railway ${exam} ${stageName} Mock Test`;

      let duration = 90;
      let distribution: any[] = [];
      
      if (exam === 'RRB ALP') {
          if (stage === 'CBT-1') { duration = 75; distribution = RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION; }
          if (stage === 'CBT-2') { duration = 90; distribution = RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION; }
          if (stage === 'Part B') { duration = 60; distribution = RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION; }
      } else if (exam === 'NTPC') {
          distribution = stage === 'CBT-1' ? RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION : RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION;
      } else if (exam === 'Group D') {
          distribution = RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION;
      }
      
      const numQuestions = distribution.reduce((s, u) => s + u.questionCount, 0);
      const generationSteps = ['Init', ...distribution.map(s => s.name.split(' ')[0]), 'Done'];

      const newJob: TestTopic = {
          id: `job_${Date.now()}`,
          topicName,
          sourceType: 'mock',
          createdAt: new Date().toISOString(),
          examType: 'Railway',
          sourceDetails: {
              description: `RRB ${exam} Syllabus`,
              mockConfig: { examType: 'Railway', type: stage, examName: exam },
          },
          generationStatus: 'processing',
          generationProgress: 0,
          progressText: 'Initializing...',
          generationConfig: { numQuestions, difficulty, mode: 'test', durationInMinutes: duration },
          generationSteps,
      };
      handleUpdateTestTopics(prev => [newJob, ...prev]);
      setView('history');
      runGenerationProcess(newJob.id, (updateProgress, signal) =>
        generateRailwayMockTestQuestions(exam, stage, difficulty, updateProgress, signal),
        'Initializing Mock Test...',
        generationSteps
      );
  };

    // FIX: Narrowed the 'tier' parameter to a more specific type to resolve the TypeScript error.
    const handleStartSSCMockTest = (exam: SSCExamFilterType, tier: 'Tier-1' | 'Tier-2' | 'Paper-I', difficulty: Difficulty) => {
        const topicName = `SSC ${exam} ${tier} Full Mock Test`;
        
        let duration = 60;
        let numQuestions = 100;
        let examPattern: any[];

        if (exam === 'JE') {
            examPattern = SSC_JE_PAPER1_EXAM_PATTERN;
            duration = 120;
            numQuestions = examPattern.reduce((s, u) => s + u.questions, 0);
        } else if (exam === 'CGL') {
             if (tier === 'Tier-1') {
                examPattern = SSC_CGL_TIER1_EXAM_PATTERN;
                duration = 60;
                numQuestions = examPattern.reduce((s, u) => s + u.questions, 0);
            } else { // Tier-2
                examPattern = SSC_CGL_TIER2_EXAM_PATTERN.filter(p => p.session === 'Session I');
                duration = 150;
                numQuestions = examPattern.reduce((s, u) => s + (u.questions as number), 0);
            }
        } else { // CHSL
             if (tier === 'Tier-1') {
                examPattern = SSC_CHSL_TIER1_EXAM_PATTERN;
                duration = 60;
                numQuestions = examPattern.reduce((s, u) => s + u.questions, 0);
            } else { // Tier-2
                examPattern = SSC_CHSL_TIER2_EXAM_PATTERN.filter(p => p.session === 'Session I');
                duration = 60;
                numQuestions = examPattern.reduce((s, u) => s + (u.questions as number), 0);
            }
        }
        
        const generationSteps = ['Init', ...examPattern.map(p => (p.subject || p.section).split(' ')[0]), 'Done'];

        const newJob: TestTopic = {
            id: `job_${Date.now()}`,
            topicName,
            sourceType: 'mock',
            createdAt: new Date().toISOString(),
            examType: 'SSC',
            sourceDetails: {
                description: `SSC ${exam} ${tier} Syllabus`,
                mockConfig: { examType: 'SSC', type: tier, examName: exam },
            },
            generationStatus: 'processing',
            generationProgress: 0,
            progressText: 'Initializing...',
            generationConfig: { numQuestions, difficulty, mode: 'test', durationInMinutes: duration },
            generationSteps,
        };
        handleUpdateTestTopics(prev => [newJob, ...prev]);
        setView('history');
        runGenerationProcess(newJob.id, (updateProgress, signal) => 
            generateSSCMockTestQuestions(exam, tier, difficulty, updateProgress, signal),
            'Initializing Mock Test...',
            generationSteps
        );
    };

  const handleRetakeTest = (topicId: string) => {
    const originalJobTopic = testTopics.find(t => t.id === topicId);
    if (!originalJobTopic || !originalJobTopic.generationConfig) {
        setError("Could not find the original test configuration to generate a new test.");
        return;
    }

    const { generationConfig, sourceType, sourceDetails } = originalJobTopic;

    switch (sourceType) {
        case 'syllabus':
            if (sourceDetails?.sourceTopics) {
                handleStartMCQTest(sourceDetails.sourceTopics, generationConfig.numQuestions, generationConfig.difficulty, generationConfig.mode || 'test', originalJobTopic.examType, generationConfig.durationInMinutes);
            }
            break;
        case 'pyq':
            if (sourceDetails?.pyqConfig) {
                handleStartPYQTest(sourceDetails.pyqConfig.year, sourceDetails.pyqConfig.group, generationConfig.numQuestions, sourceDetails.pyqConfig.isSimulated, originalJobTopic.examType);
            }
            break;
        case 'mock':
            if (sourceDetails?.mockConfig) {
                const { examType, type, examName, group } = sourceDetails.mockConfig;
                // FIX: Handle TNPSC mock retake without race condition by duplicating generation logic.
                if (examType === 'TNPSC' && group) {
                    setActiveTNPSCGroupFilter(group);
                    
                    // Duplicating logic from handleStartMockTest to avoid race condition
                    const isGroup1 = group === 'Group I';
                    const topicName = isGroup1 ? 'Full Mock Test (Group I Prelims)' : 'Full Mock Test (Prelims)';
                    const distribution = isGroup1 ? TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION : TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION;
                    const numQuestions = distribution.reduce((sum, s) => sum + s.questionCount, 0);
                    const duration = 180;
                    const generationSteps = ['Init', ...distribution.map(s => s.name.split(' ')[0]), 'Finalizing'];
                    
                    const newJob: TestTopic = {
                        id: `job_${Date.now()}`,
                        topicName,
                        sourceType: 'mock',
                        createdAt: new Date().toISOString(),
                        examType: 'TNPSC',
                        sourceDetails: {
                            description: `TNPSC ${isGroup1 ? 'Group I' : ''} Full Syllabus`,
                            mockConfig: { examType: 'TNPSC', type: 'Prelims', group: group },
                        },
                        generationStatus: 'processing',
                        generationProgress: 0,
                        progressText: 'Initializing...',
                        generationConfig: { numQuestions, difficulty: generationConfig.difficulty, mode: 'test', durationInMinutes: duration },
                        generationSteps,
                    };
                    handleUpdateTestTopics(prev => [newJob, ...prev]);
                    setView('history');
                    runGenerationProcess(newJob.id, (updateProgress, signal) => 
                        generateTNPSCMockTestQuestions(generationConfig.difficulty, updateProgress, signal, undefined, group),
                        'Initializing Mock Test...',
                        generationSteps
                    );
                } else if (examType === 'Bank Exam' && (type === 'Prelims' || type === 'Mains')) {
                    if (examName) {
                        setActiveBankExamFilter(examName as BankExamFilterType);
                    }
                    handleStartBankMockTest(type, generationConfig.difficulty);
                } else if (examType === 'Railway' && (type === 'CBT-1' || type === 'CBT-2' || type === 'Part B')) {
                    const railwayExam = examName as RailwayExamFilterType;
                    handleStartRailwayMockTest(railwayExam, type, generationConfig.difficulty);
                } else if (examType === 'SSC' && (type === 'Tier-1' || type === 'Tier-2' || type === 'Paper-I')) {
                    const sscExam = examName as SSCExamFilterType;
                    handleStartSSCMockTest(sscExam, type, generationConfig.difficulty);
                }
            }
            break;
        case 'pdf':
            const sourcePdfTopicId = sourceDetails?.sourcePdfTopicId;
            const sourceTopic = testTopics.find(t => t.id === (sourcePdfTopicId || originalJobTopic.id));
            if (sourceTopic) {
                handleStartFileGeneration(sourceTopic.id, generationConfig.numQuestions, generationConfig.difficulty, generationConfig.mode || 'test');
            } else {
                setError("Could not find the source documents for this test retake.");
            }
            break;
    }
  };

  const handleResumeTest = () => {
    if (resumableTest) {
      setSelectedTopic(resumableTest.topic);
      setQuestions(resumableTest.questions);
      setTestMode('test');
      setTestDuration(resumableTest.durationInMinutes);
      setCurrentTestTopicId(resumableTest.testTopicId || null);
      setView('test');
    }
  };

  const handleFinishTest = (finalAnswers: string[], bookmarks: boolean[], timeTakenInSeconds: number) => {
    if (!selectedTopic) return;

    setUserAnswers(finalAnswers);
    let correct = 0;
    let incorrect = 0;
    
    questions.forEach((q, index) => {
        if (finalAnswers[index] !== '' && finalAnswers[index] === q.correctOption) {
            correct++;
        } else if(finalAnswers[index] !== '') {
            incorrect++;
        }
    });

    const score = questions.length > 0 ? (correct / questions.length) * 100 : 0;
    
    let marks = 0;
    let totalMarks = questions.length;

    if (activeExamType === 'Bank Exam') {
        marks = (correct * 1) - (incorrect * 0.25);
        totalMarks = questions.length * 1;
    } else if (activeExamType === 'Railway') {
        marks = (correct * 1) - (incorrect * (1/3));
        totalMarks = questions.length * 1;
    } else if (activeExamType === 'SSC') {
        const isTier1 = selectedTopic.name.toLowerCase().includes('tier-1');
        const marksPerQuestion = isTier1 ? 2 : 3;
        const negativeMark = isTier1 ? 0.50 : 1.0;
        marks = (correct * marksPerQuestion) - (incorrect * negativeMark);
        totalMarks = questions.length * marksPerQuestion;
    } else {
        marks = correct * 1;
        totalMarks = questions.length * 1;
    }

    const newResult: TestResult = {
      id: Date.now(),
      testTopicId: currentTestTopicId || undefined,
      date: new Date().toISOString(),
      topic: selectedTopic,
      examType: activeExamType!,
      questions: questions,
      userAnswers: finalAnswers,
      bookmarks: bookmarks,
      score: score,
      correctCount: correct,
      incorrectCount: incorrect,
      totalCount: questions.length,
      marks: marks,
      totalMarks: totalMarks,
      difficulty: testDifficulty,
      timeTakenInSeconds,
    };
    
    setLastTestResult(newResult);
    
    const newHistory = [newResult, ...testHistory];
    handleUpdateTestHistory(newHistory);

    try {
      const savedMissedRaw = localStorage.getItem('aiexam-missed-questions');
      const missedData: MissedQuestionsStorage = savedMissedRaw ? JSON.parse(savedMissedRaw) : {};
      
      questions.forEach((q, index) => {
        const hash = generateQuestionHash(q.questionText);
        if (finalAnswers[index] !== q.correctOption) {
            if (missedData[hash]) {
                missedData[hash].missedCount++;
            } else {
                missedData[hash] = { question: q, missedCount: 1 };
            }
        }
      });
      localStorage.setItem('aiexam-missed-questions', JSON.stringify(missedData));
      
      const sortedMissed = Object.values(missedData).sort((a: MissedQuestion, b: MissedQuestion) => b.missedCount - a.missedCount).slice(0, 10);
      setFrequentlyMissed(sortedMissed);

    } catch(e) {
      console.error("Failed to update missed questions", e);
    }

    localStorage.removeItem('aiexam-test-session');
    localStorage.removeItem('aiexam-test-progress');
    setResumableTest(null);
    setCurrentTestTopicId(null);
    setView('results');
  };

  const handleStartMainsTest = useCallback(async (topic: Topic, marks: Marks) => {
    setView('loading');
    setError(null);
    setIsMainsTest(true);
    setLoaderMessage('Generating your descriptive test...');
    try {
      const question = await generateDescriptiveQuestion(topic, marks);
      setDescriptiveQuestion(question);
      setView('descriptiveTest');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during question generation.");
      setView('home');
    }
  }, []);

  const handleSubmitDescriptiveAnswer = useCallback(async (answer: UserAnswer) => {
    if (!descriptiveQuestion) return;
    setView('evaluating');
    setUserAnswer(answer);
    try {
      const evaluation = await evaluateAnswer(descriptiveQuestion, answer);
      setEvaluationResult(evaluation);
      setView('descriptiveResults');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred during evaluation.");
      setView('home');
    }
  }, [descriptiveQuestion]);
  
  const handleGoHome = useCallback(() => {
    setView('home');
    setActiveExamType(null);
    setError(null);
    setViewingHistoryResult(null);
    setLastTestResult(null);
  }, []);

  const handleShowMyTests = () => {
      setView('history');
      setViewingHistoryResult(null);
      setLastTestResult(null);
  };
  
  const handleShowDashboard = () => {
    setView('dashboard');
    setViewingHistoryResult(null);
    setLastTestResult(null);
  };

  const handleShowAiNotes = useCallback(() => setView('aiStudyNotes'), []);
  const handleShowStorage = useCallback(() => { setView('storage'); setViewingHistoryResult(null); setLastTestResult(null); }, []);
  const handleShowWeeklyPerformance = () => { setView('weeklyPerformance'); setViewingHistoryResult(null); setLastTestResult(null); };
  const handleViewHistoryResult = (result: TestResult) => { setViewingHistoryResult(result); setView('results'); };
  const handleShowExams = useCallback(() => setView('examSelection'), []);
  
  const handleSelectExam = (exam: ExamType) => {
    setActiveExamType(exam);
    if (exam === 'TNPSC') {
        setActiveTNPSCGroupFilter('Group I');
        setActiveTNPSCStageFilter('PYQ');
    } else if (exam === 'Bank Exam') {
        setActiveBankFilter('Prelims');
        setActiveBankExamFilter('SBI');
    } else if (exam === 'Railway') {
        setActiveRailwayExamFilter('NTPC');
        setActiveRailwayStageFilter('CBT-1');
    } else if (exam === 'SSC') {
        setActiveSSCExamFilter('CGL');
        setActiveSSCStageFilter('Tier-1');
    }
    setView('home'); 
  };
  
  const allTopicNames = useMemo(() => testTopics.map(t => t.topicName), [testTopics]);

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <Loader message={loaderMessage} activeExamType={activeExamType || 'TNPSC'} />;
      case 'evaluating':
        return <Loader message="Evaluating your answer..." activeExamType={activeExamType || 'TNPSC'} />;
      case 'test':
        if (questions.length > 0 && selectedTopic) {
          return <TestView 
                    questions={questions} 
                    topic={selectedTopic} 
                    onFinishTest={handleFinishTest} 
                    activeExamType={activeExamType!}
                    mode={testMode}
                    durationInMinutes={testDuration}
                    currentTestTopicId={currentTestTopicId}
                  />;
        }
        return null;
      case 'results':
        const resultToShow = viewingHistoryResult || lastTestResult;
        if (resultToShow) {
          return <ResultsView 
                    result={resultToShow} 
                    onTryAgain={handleGoHome}
                    onGoBack={viewingHistoryResult ? () => setView('history') : undefined}
                    frequentlyMissedQuestions={frequentlyMissed}
                    activeExamType={activeExamType!}
                    onStartPracticeTest={(topic, num, diff) => handleStartMCQTest(topic, num, diff, 'practice', activeExamType!)}
                    onUpdateResult={handleUpdateSingleResult}
                    onDownloadPdf={handleDownloadPdf}
                 />;
        }
        return null;
      case 'descriptiveTest':
        if (descriptiveQuestion) {
          return <DescriptiveTestView question={descriptiveQuestion} onSubmit={handleSubmitDescriptiveAnswer} />;
        }
        return null;
      case 'descriptiveResults':
        if (descriptiveQuestion && userAnswer && evaluationResult) {
          return <DescriptiveResultsView
            question={descriptiveQuestion}
            answer={userAnswer}
            evaluation={evaluationResult}
            onTryAgain={handleGoHome}
            activeExamType={activeExamType!}
          />;
        }
        return null;
      case 'weeklyPerformance':
        return <WeeklyPerformanceView history={testHistory} onGoBack={handleShowMyTests} />;
      case 'dashboard':
          return <DashboardView history={testHistory} testTopics={testTopics} />;
      case 'history':
        return <HistoryView 
                  history={testHistory} 
                  testTopics={testTopics}
                  onViewResult={handleViewHistoryResult}
                  onStartGeneratedTest={handleStartGeneratedTest}
                  onRetakeTest={handleRetakeTest}
                  onUpdateTopics={handleUpdateTestTopics}
                  onUpdateHistory={handleUpdateTestHistory}
                  onCancelGeneration={handleCancelGeneration}
                  onClearAllData={handleClearAllData}
                />;
      case 'aiStudyNotes':
        return <AiStudyNotesView syllabus={displayedSyllabus} onGoBack={handleGoHome} />;
      case 'storage':
        return <StorageView testTopics={testTopics} onGoBack={handleGoHome} onDownloadPdf={handleDownloadPdf} />;
      case 'textExtractions':
        return <TextExtractionsView onGoBack={handleGoHome} />;
       case 'downloads':
        return <DownloadsView
                  history={testHistory}
                  testTopics={testTopics}
                  onDownloadPdf={handleDownloadPdf}
                  onGoBack={handleGoHome}
               />;
      case 'examSelection':
        return <ExamSelectionView onSelectExam={handleSelectExam} />;
      case 'home':
      default:
        if (!activeExamType) {
            return (
                <>
                    <Hero 
                        onResumeTest={resumableTest ? handleResumeTest : undefined} 
                        onShowWeeklyPerformance={handleShowWeeklyPerformance}
                        onShowExams={handleShowExams}
                        activeExamType={activeExamType || 'TNPSC'} 
                    />
                     {error && (
                      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
                        <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">An error occurred: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                      </div>
                    )}
                </>
            );
        }

        const showUploadView = 
            (activeExamType === 'TNPSC' && activeTNPSCStageFilter === 'Upload Files') ||
            (activeExamType === 'Bank Exam' && activeBankFilter === 'Upload Files') ||
            (activeExamType === 'Railway' && activeRailwayStageFilter === 'Upload Files') ||
            (activeExamType === 'SSC' && activeSSCStageFilter === 'Upload Files');
        
        const showPYQView = 
            (activeExamType === 'TNPSC' && activeTNPSCStageFilter === 'PYQ') ||
            (activeExamType === 'Bank Exam' && activeBankFilter === 'PYQ') ||
            (activeExamType === 'Railway' && activeRailwayStageFilter === 'PYQ') ||
            (activeExamType === 'SSC' && activeSSCStageFilter === 'PYQ');

        const showSyllabus = 
            !showUploadView && !showPYQView &&
            ((activeExamType === 'TNPSC' && !['Full Mock Test'].includes(activeTNPSCStageFilter)) ||
            (activeExamType === 'Bank Exam' && !['Full Mock Test'].includes(activeBankFilter)) ||
            (activeExamType === 'Railway' && !['Full Mock Test'].includes(activeRailwayStageFilter)) ||
            (activeExamType === 'SSC' && !['Full Mock Test'].includes(activeSSCStageFilter)) || 
            (!['TNPSC', 'Bank Exam', 'Railway', 'SSC'].includes(activeExamType))); // Always show syllabus for custom exams if not in special modes

        return (
          <>
             {error && (
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-8">
                <div className="max-w-3xl mx-auto bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                    <strong className="font-bold">An error occurred: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
              </div>
            )}
            <main>
              <FilterNav
                activeExamType={activeExamType}
                onExamTypeChange={handleSelectExam}
                activeTNPSCGroupFilter={activeTNPSCGroupFilter}
                onTNPSCGroupFilterChange={setActiveTNPSCGroupFilter}
                activeTNPSCStageFilter={activeTNPSCStageFilter}
                onTNPSCStageFilterChange={setActiveTNPSCStageFilter}
                activeBankFilter={activeBankFilter}
                onBankFilterChange={setActiveBankFilter}
                activeBankExamFilter={activeBankExamFilter}
                onBankExamFilterChange={setActiveBankExamFilter}
                activeRailwayExamFilter={activeRailwayExamFilter}
                onRailwayExamFilterChange={setActiveRailwayExamFilter}
                activeRailwayStageFilter={activeRailwayStageFilter}
                onRailwayStageFilterChange={setActiveRailwayStageFilter}
                activeSSCExamFilter={activeSSCExamFilter}
                onSSCExamFilterChange={handleSSCExamFilterChange}
                activeSSCStageFilter={activeSSCStageFilter}
                onSSCStageFilterChange={setActiveSSCStageFilter}
              />

              { showUploadView ? (
                  <FileUploadView 
                    testTopics={testTopics.filter(t => t.examType === activeExamType && t.sourceType === 'pdf' && !t.sourceDetails)}
                    allTopicNames={allTopicNames}
                    onUpdateTopics={handleUpdateTestTopics}
                    onStartGeneration={handleStartFileGeneration}
                    activeExamType={activeExamType}
                    onGoBack={handleGoHome}
                    syllabus={displayedSyllabus}
                  />
              ) : showPYQView ? (
                <PYQView onGenerateTest={handleStartPYQTest} activeExamType={activeExamType} />
              ) : activeExamType === 'TNPSC' && activeTNPSCStageFilter === 'Full Mock Test' ? (
                <MockTestView onStartTest={handleStartMockTest} activeTNPSCGroupFilter={activeTNPSCGroupFilter}/>
              ) : activeExamType === 'Bank Exam' && activeBankFilter === 'Full Mock Test' ? (
                <BankMockTestView onStartTest={handleStartBankMockTest} activeBankExamFilter={activeBankExamFilter} />
              ) : activeExamType === 'Railway' && activeRailwayStageFilter === 'Full Mock Test' ? (
                <RailwayMockTestView 
                    onStartTest={(exam, stage, diff) => handleStartRailwayMockTest(exam, stage, diff)} 
                    onStartAlpPartBTest={(diff) => handleStartRailwayMockTest('RRB ALP', 'Part B', diff)}
                    activeRailwayExamFilter={activeRailwayExamFilter}
                />
              ) : activeExamType === 'SSC' && activeSSCStageFilter === 'Full Mock Test' ? (
                <SSCMockTestView onStartTest={handleStartSSCMockTest} activeSSCExamFilter={activeSSCExamFilter} />
              ) : showSyllabus ? (
                <SyllabusView 
                  syllabus={displayedSyllabus}
                  onUpdateSyllabus={handleUpdateSyllabus}
                  onStartMCQTest={handleStartMCQTest}
                  onStartMainsTest={handleStartMainsTest}
                  activeExamType={activeExamType}
                />
              ) : null}
            </main>
          </>
        );
    }
  };

  return (
    <React.Fragment>
      <button 
        className="fixed top-4 left-4 z-[110] p-2 bg-slate-800/50 backdrop-blur-sm rounded-md md:hidden"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[99] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onGoHome={handleGoHome} 
        onShowMyTests={handleShowMyTests}
        onShowDashboard={handleShowDashboard}
        onShowAiNotes={handleShowAiNotes}
        onShowStorage={handleShowStorage}
        onShowDownloads={handleShowDownloads}
        onShowTextExtractions={handleShowTextExtractions}
        onShowWeeklyPerformance={handleShowWeeklyPerformance}
        onShowExams={handleShowExams}
        testTopics={testTopics}
        activeExamType={activeExamType}
      />
      <div className="main-content-wrapper flex flex-col min-h-screen">
        <div className="page-transition-wrapper flex-grow">
          {renderContent()}
        </div>
        {isGeneratingPdf && (
            <div className="fixed inset-0 bg-black/60 z-[200] flex flex-col items-center justify-center">
                <Loader message="Generating PDF, please wait..." activeExamType={activeExamType || 'TNPSC'} />
            </div>
        )}
        {scanningInfo && (
          <PdfScanningView
              files={scanningInfo.files}
              onClose={() => setScanningInfo(null)}
          />
        )}
        <Footer activeExamType={activeExamType || 'TNPSC'}/>
      </div>
    </React.Fragment>
  );
};

export default App;