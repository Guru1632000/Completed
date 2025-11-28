

// All type definitions are now correctly defined and exported.

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
export type Marks = 5 | 10 | 15;
export type ExamType = 'TNPSC' | 'Bank Exam' | 'Railway' | 'SSC' | (string & {});
export type TestMode = 'test' | 'practice';

// Basic Question Structure
export interface Question {
  questionText: string;
  options: { [key: string]: string };
  correctOption: string;
  explanation: string;
  isPYQ: boolean;
  questionType: 'MCQ' | 'AssertionReasoning';
  questionSubtype?: string;
  section?: string;
  commonContext?: string;
  commonContextDiagramSvg?: string;
  explanationDiagramSvg?: string;
  sources?: { uri: string; title: string; }[];
}

// Topic & Syllabus
export interface Topic {
  name: string;
  unit: string;
  description?: string;
}

export interface SyllabusUnit {
  id: string;
  title: string;
  topics: Topic[];
}

// Test & Results
export interface TestResult {
  id: number;
  date: string;
  topic: Topic;
  examType: ExamType;
  questions: Question[];
  userAnswers: string[];
  bookmarks: boolean[];
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalCount: number;
  marks: number;
  totalMarks: number;
  difficulty: Difficulty;
  testTopicId?: string;
  feedback?: ('good' | 'bad' | null)[];
  timeTakenInSeconds?: number;
}

export interface ResumableTest {
    topic: Topic;
    questions: Question[];
    durationInMinutes?: number;
    testTopicId?: string;
}

// Descriptive Test
export interface DescriptiveQuestion {
  questionText: string;
  marks: Marks;
}

export interface UserAnswer {
  text?: string;
  fileBase64?: string;
  fileName?: string;
}

export interface Evaluation {
  score: number;
  feedback: string;
  suggestions: string;
  modelAnswer: string;
}

// History & Analysis
export interface MissedQuestion {
  question: Question;
  missedCount: number;
}

export interface MissedQuestionsStorage {
  [hash: string]: MissedQuestion;
}

export interface CoachFeedback {
    greeting: string;
    overall_summary: string;
    strength_areas: { topic: string; reason: string; }[];
    weakness_areas: { topic: string; reason: string; }[];
    study_plan_intro: string;
    study_plan: { step: number; title: string; description: string; }[];
    motivational_quote: string;
}

export interface DashboardCoachSummary {
    greeting: string;
    one_line_summary: string;
    tip_for_today: string;
    motivational_quote: string;
}


// Filters
// FIX: Corrected casing to match constants and added 'Prelims' for consistency.
export type FilterType = 'PYQ' | 'Full Mock Test' | 'Group I' | 'Group II' | 'Group IV' | 'Mains' | 'Upload Files' | 'Sample Questions' | 'Prelims' | (string & {});
// FIX: Added missing TNPSC filter types
export type TNPSCGroupFilterType = 'Group I' | 'Group II' | 'Group IV' | (string & {});
export type TNPSCStageFilterType = 'PYQ' | 'Prelims' | 'Mains' | 'Full Mock Test' | 'Upload Files' | (string & {});
export type BankFilterType = 'PYQ' | 'Prelims' | 'Mains' | 'Full Mock Test' | 'Upload Files' | 'Sample Questions' | (string & {});
// FIX: Corrected RRB to RRB BANK to match constants
export type BankExamFilterType = 'SBI' | 'IBPS' | 'RRB BANK' | (string & {});
export type RailwayExamFilterType = 'NTPC' | 'Group D' | 'RRB ALP' | (string & {});
export type RailwayStageFilterType = 'PYQ' | 'CBT-1' | 'CBT-2' | 'CBT-2 (Part A)' | 'CBT-2 (Part B)' | 'Part B' | 'Full Mock Test' | 'Upload Files' | 'Sample Questions' | (string & {});
// FIX: Add 'JE' to SSCExamFilterType for consistency.
export type SSCExamFilterType = 'CGL' | 'CHSL' | 'JE' | (string & {});
// FIX: Add 'Paper-I' and 'Paper-II' to SSCStageFilterType for consistency.
export type SSCStageFilterType = 'PYQ' | 'Tier-1' | 'Tier-2' | 'Paper-I' | 'Paper-II' | 'Full Mock Test' | 'Upload Files' | 'Sample Questions' | (string & {});

// Exam Pattern Configuration
export interface ExamSectionConfig {
    sectionName: string;
    questionCount: number;
    marksPerQuestion: number;
}

export interface ExamPatternConfig {
    examType: ExamType;
    subType?: string; // e.g., 'CGL', 'NTPC', 'SBI'
    stage: string; // e.g., 'Tier-1', 'Prelims', 'CBT-1'
    sections: ExamSectionConfig[];
    totalTimeInMinutes: number;
    negativeMarking: number;
}

// File Upload & Generated Topics
export interface FileInfo {
    id: string;
    fileName: string;
    mimeType: string;
    fileContentBase64: string;
    status: 'uploading' | 'completed' | 'error' | 'processed';
    progress: number;
    errorMessage?: string;
}

export interface TestTopic {
    id: string;
    topicName: string;
    sourceType: 'pdf' | 'syllabus' | 'pyq' | 'mock';
    createdAt: string;
    examType: ExamType;
    files?: FileInfo[];
    generationStatus: 'idle' | 'processing' | 'completed' | 'error';
    generationProgress?: number;
    progressText?: string;
    generationError?: string;
    generatedQuestions?: Question[];
    generationConfig?: {
        numQuestions: number;
        difficulty: Difficulty;
        mode: TestMode;
        durationInMinutes?: number;
        customPattern?: ExamPatternConfig;
    };
    sourceDetails?: {
        description: string;
        sourceTopics?: Topic | Topic[];
        sourcePdfTopicId?: string;
        pyqConfig?: {
            year: number;
            group: string;
            isSimulated: boolean;
        };
        mockConfig?: {
            examType: ExamType;
// FIX: Broadened the mock config type to include all specific stages, resolving type mismatches.
            type: 'Prelims' | 'Mains' | 'CBT-1' | 'CBT-2' | 'Part B' | 'CBT-2 (Part A)' | 'CBT-2 (Part B)' | 'Tier-1' | 'Tier-2' | 'Paper-I' | 'Paper-II';
            examName?: SSCExamFilterType | RailwayExamFilterType | BankExamFilterType;
            // FIX: Added 'group' property to allow storing TNPSC group context for mock tests.
            group?: TNPSCGroupFilterType;
        };
    };
    generationSteps?: string[];
    currentStepIndex?: number;
}

export interface TopicQuestion {
  topic: Topic;
  question: Question | null;
  error?: string;
}

export interface SubjectWeightage {
  name: string;
  topics: Topic[];
  questionCount: number;
}

export interface StudyNotes {
    topic: string;
    introduction: string;
    keyPoints: string[];
    example: {
        problem: string;
        solution: string;
    };
    summary: string;
}

export interface GeoFeature {
    name: string;
    description: string;
    type: 'point' | 'line';
    point?: [number, number];
    path?: [number, number][];
    layer?: string;
}

export interface StudyPlanItem {
    topicName: string;
    startDay: number;
    endDay: number;
    durationDays: number;
    priority: 'High' | 'Medium' | 'Low';
    justification: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
}
