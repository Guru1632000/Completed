// FIX: Add FilterType to imports for the new TNPSC_FILTERS constant.
import { SyllabusUnit, Topic, SubjectWeightage, ExamType, FilterType, BankFilterType, RailwayExamFilterType, RailwayStageFilterType, SSCExamFilterType, SSCStageFilterType, BankExamFilterType, TNPSCGroupFilterType, TNPSCStageFilterType } from './types';
import { SSC_CGL_TIER1_SYLLABUS, SSC_CGL_TIER2_SYLLABUS } from './SSC_Exam/SSC_CGL/syllabus';
import { 
    SSC_CGL_TIER1_EXAM_PATTERN, 
    SSC_CGL_TIER2_EXAM_PATTERN 
} from './SSC_Exam/SSC_CGL/examPattern';
import { SSC_CHSL_TIER1_SYLLABUS, SSC_CHSL_TIER2_SYLLABUS } from './SSC_Exam/SSC_CHSL/syllabus';
import { 
    SSC_CHSL_TIER1_EXAM_PATTERN,
    SSC_CHSL_TIER2_EXAM_PATTERN
} from './SSC_Exam/SSC_CHSL/examPattern';
import { 
    SSC_CGL_TIER1_TOPIC_DISTRIBUTION,
    SSC_CGL_TIER2_TOPIC_DISTRIBUTION
} from './SSC_Exam/SSC_CGL/topicDistribution';
import { 
    SSC_CHSL_TIER1_TOPIC_DISTRIBUTION,
    SSC_CHSL_TIER2_TOPIC_DISTRIBUTION
} from './SSC_Exam/SSC_CHSL/topicDistribution';
import { BANK_PRELIMS_SYLLABUS, BANK_MAINS_SYLLABUS } from './Bankexam/syllabus';
import { BANK_PRELIMS_TOPIC_DISTRIBUTION, BANK_MAINS_TOPIC_DISTRIBUTION } from './Bankexam/topicDistribution';
import { BANK_PRELIMS_EXAM_PATTERN, BANK_MAINS_EXAM_PATTERN, BANK_PRELIMS_SECTION_MAP } from './Bankexam/examPattern';
import { SSC_JE_PAPER1_SYLLABUS } from './SSC_Exam/SSC_JE/syllabus';
import { SSC_JE_PAPER1_EXAM_PATTERN } from './SSC_Exam/SSC_JE/examPattern';
import { SSC_JE_PAPER1_TOPIC_DISTRIBUTION } from './SSC_Exam/SSC_JE/topicDistribution';

// --- RRB BANK IMPORTS ---
import {
    RRB_BANK_PRELIMS_SYLLABUS,
    RRB_BANK_MAINS_SYLLABUS
} from './Bankexam/RRB_Exam/syllabus';
import {
    RRB_BANK_PRELIMS_EXAM_PATTERN,
    RRB_BANK_MAINS_EXAM_PATTERN
} from './Bankexam/RRB_Exam/examPattern';
import {
    RRB_BANK_PRELIMS_TOPIC_DISTRIBUTION,
    RRB_BANK_MAINS_TOPIC_DISTRIBUTION
} from './Bankexam/RRB_Exam/topicDistribution';

// --- TNPSC IMPORTS (NEW STRUCTURE) ---
import { TNPSC_GROUP_FILTERS, TNPSC_STAGE_FILTERS } from './TNPSC_Exam/common/filters';
import { TNPSC_MAINS_SYLLABUS } from './TNPSC_Exam/common/mains_syllabus';
import { TNPSC_GROUP1_PRELIMS_SYLLABUS } from './TNPSC_Exam/Group1/syllabus';
import { TNPSC_GROUP2_PRELIMS_SYLLABUS } from './TNPSC_Exam/Group2/syllabus';
import { TNPSC_GROUP4_PRELIMS_SYLLABUS } from './TNPSC_Exam/Group4/syllabus';
import { TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION } from './TNPSC_Exam/Group1/mockTest';
import { TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION } from './TNPSC_Exam/Group2/mockTest';
import { TNPSC_GROUP4_MOCK_TEST_UNIT_DISTRIBUTION } from './TNPSC_Exam/Group4/mockTest';


// --- FILTER CONSTANTS ---
// FIX: Added TNPSC_FILTERS for backward compatibility with older components like AdminPanel.
export const TNPSC_FILTERS: {id: FilterType, label: string}[] = [
    {id:'PYQ', label:'PYQ'}, 
    {id:'Full Mock Test', label:'Full Mock Test'}, 
    {id:'Group I', label:'Group I'}, 
    {id:'Group II', label:'Group II'}, 
    {id:'Group IV', label:'Group IV'}, 
    {id:'Mains', label:'Mains'}, 
    {id:'Upload Files', label:'Upload Files'}
];

export const BANK_FILTERS: {id: BankFilterType, label: string}[] = [
    {id:'PYQ', label:'PYQ'}, 
    {id:'Prelims', label:'Prelims'}, 
    {id:'Mains', label:'Mains'}, 
    {id:'Full Mock Test', label:'Full Mock Test'}, 
    {id:'Upload Files', label:'Upload Files'}
];
export const BANK_EXAM_FILTERS: {id: BankExamFilterType, label: string}[] = [
    {id:'SBI', label:'SBI'},
    {id:'IBPS', label:'IBPS'},
    {id:'RRB BANK', label:'RRB Bank'}
];
export const RAILWAY_EXAM_FILTERS: {id: RailwayExamFilterType, label: string}[] = [
    {id:'NTPC', label:'NTPC'}, 
    {id:'Group D', label:'Group D'}, 
    {id:'RRB ALP', label:'RRB ALP'}
];
export const SSC_EXAM_FILTERS: {id: SSCExamFilterType, label: string}[] = [
    {id:'CGL', label:'CGL'}, 
    {id:'CHSL', label:'CHSL'},
    {id:'JE', label: 'JE'}
];
export const SSC_STAGE_FILTERS: {id: SSCStageFilterType, label: string}[] = [
    {id:'PYQ', label:'PYQ'}, 
    {id:'Tier-1', label:'Tier-1'}, 
    {id:'Tier-2', label:'Tier-2'}, 
    {id:'Paper-I', label:'Paper-I'},
    {id:'Paper-II', label:'Paper-II'},
    {id:'Full Mock Test', label:'Full Mock Test'}, 
    {id:'Upload Files', label:'Upload Files'}
];

// Reconstruct master syllabus from all individual syllabuses for backward compatibility
export const SYLLABUS: SyllabusUnit[] = [
    ...TNPSC_GROUP1_PRELIMS_SYLLABUS,
    ...TNPSC_GROUP2_PRELIMS_SYLLABUS, // Group 4 uses the same topics
    ...TNPSC_MAINS_SYLLABUS,
];


export const PYQ_EXAM_GROUPS: { [key: string]: string[] } = {
    'TNPSC': ['Group I', 'Group II', 'Group IV'],
    'Bank Exam': ['PO Prelims', 'Clerk Prelims', 'PO Mains', 'Clerk Mains'],
    'Railway': ['NTPC CBT-1', 'NTPC CBT-2', 'Group D', 'ALP CBT-1', 'ALP CBT-2'],
    'SSC': ['CGL Tier-1', 'CGL Tier-2', 'CHSL Tier-1', 'CHSL Tier-2'],
};


// --- RAILWAY EXAM SYLLABUS ---
const railwaySyllabusText = {
  mathematics: `
Mathematics
Number System
Simplification
Decimals and Fractions
LCM and HCF
Ratio and Proportion
Percentage
Profit and Loss
Simple and Compound Interest
Average
Time and Work
Time and Distance
Problems on Ages
Data Interpretation
Algebra
Geometry
Trigonometry
Mensuration
`,
  reasoning: `
General Intelligence and Reasoning
Analogies
Classification
Series (Number, Alphabet, and Mixed)
Coding and Decoding
Blood Relations
Direction Sense Test
Ordering and Ranking
Alphabetical and Number Series
Word Formation
Distance and Direction
Mathematical Operations
Venn Diagrams
Syllogism
Puzzle
Non-Verbal Reasoning
`,
  reasoningPuzzles: `
Reasoning Puzzles for Railway Exams
Seating Arrangement (Linear, Circular)
Simple Floor Puzzles
Ranking & Order Puzzles
Blood Relation Puzzles
Age-Based Puzzles
Box Arrangement Puzzles
`,
  generalAwareness: `
General Awareness
Current Affairs (National and International)
General Science
Indian History
Indian Polity
Indian Economy
Geography (Indian and the World)
Indian Culture and Heritage
Science and Technology
Sports
Books and Authors
Important Days and Events
Awards and Honors
Abbreviations
Major Financial and Economic News
Budget and Five Year Plans
Who's Who
Art and Culture
Polity
Important Organizations and their Headquarters
`,
  generalScience: `
General Science
Physics
Chemistry
Biology
Environmental Studies
`,
   basicScienceEngineering: `
Basic Science and Engineering
Engineering Drawing (Projections, Views, Drawing Instruments, Lines, Geometric figures, Symbolic Representation)
Units, Measurements, Mass, Weight and Density
Work, Power and Energy
Speed and Velocity
Heat and Temperature
Basic Electricity
Levers and Simple Machines
Occupational Safety and Health
Environment Education
IT Literacy
`,
  mechanicalEngineering: `
Mechanical Engineering
Turbo Machinery
Production Engineering
Automation Engineering
Energy, Materials
Energy Conservation
Management
Applied Mechanics
Kinetic Theory
The Strength Of The Material
Metal Handling
Metallurgical
Dimensions
Heat
Engines
Refrigerators And Air Conditioners
`
};

const parseRailwaySyllabusText = (text: string): string[] => {
    const lines = text.trim().split('\n');
    const topicLines = lines.slice(1);
    return topicLines.map(line => line.trim()).filter(line => line.length > 0);
};

// COMMON RAILWAY UNITS
const createTopicsForUnit = (unitTitle: string, topicNames: string[]): Topic[] => {
    return topicNames.map(name => ({ name, unit: unitTitle }));
};
const railwayMathTopics = parseRailwaySyllabusText(railwaySyllabusText.mathematics);
const railwayReasoningTopics = parseRailwaySyllabusText(railwaySyllabusText.reasoning);
const railwayGATopics = parseRailwaySyllabusText(railwaySyllabusText.generalAwareness);
const railwayGSTopics = parseRailwaySyllabusText(railwaySyllabusText.generalScience);
const railwayEngTopics = parseRailwaySyllabusText(railwaySyllabusText.basicScienceEngineering);
const railwayMechEngTopics = parseRailwaySyllabusText(railwaySyllabusText.mechanicalEngineering);
const railwayPuzzleTopics = parseRailwaySyllabusText(railwaySyllabusText.reasoningPuzzles);

const railwayMathUnit: SyllabusUnit = { id: 'rail-math', title: 'Mathematics', topics: createTopicsForUnit('Mathematics', railwayMathTopics) };
const railwayReasoningUnit: SyllabusUnit = { id: 'rail-reason', title: 'General Intelligence and Reasoning', topics: createTopicsForUnit('General Intelligence and Reasoning', railwayReasoningTopics) };
const railwayGAUnit: SyllabusUnit = { id: 'rail-ga', title: 'General Awareness & Current Affairs', topics: createTopicsForUnit('General Awareness & Current Affairs', railwayGATopics) };
const railwayGSUnit: SyllabusUnit = { id: 'rail-gs', title: 'General Science', topics: createTopicsForUnit('General Science', railwayGSTopics) };
const railwayEngUnit: SyllabusUnit = { id: 'rail-eng', title: 'Basic Science and Engineering', topics: createTopicsForUnit('Basic Science and Engineering', railwayEngTopics) };
const railwayMechEngUnit: SyllabusUnit = { id: 'rail-mech-eng', title: 'Mechanical Engineering (CBT-2 Part B)', topics: createTopicsForUnit('Mechanical Engineering (CBT-2 Part B)', railwayMechEngTopics) };
const railwayPuzzlesUnit: SyllabusUnit = { id: 'rail-puzzles', title: 'Reasoning Puzzles', topics: createTopicsForUnit('Reasoning Puzzles', railwayPuzzleTopics) };


// NTPC SYLLABUS
export const RAILWAY_NTPC_CBT1_SYLLABUS: SyllabusUnit[] = [railwayMathUnit, railwayReasoningUnit, railwayPuzzlesUnit, railwayGAUnit];
export const RAILWAY_NTPC_CBT2_SYLLABUS: SyllabusUnit[] = [railwayMathUnit, railwayReasoningUnit, railwayPuzzlesUnit, railwayGAUnit]; // Syllabus is same, pattern differs

// GROUP D SYLLABUS
export const RAILWAY_GROUP_D_SYLLABUS: SyllabusUnit[] = [railwayMathUnit, railwayReasoningUnit, railwayPuzzlesUnit, railwayGSUnit, railwayGAUnit];

// ALP SYLLABUS
export const RAILWAY_ALP_CBT1_SYLLABUS: SyllabusUnit[] = [railwayMathUnit, railwayReasoningUnit, railwayPuzzlesUnit, railwayGSUnit, railwayGAUnit];
export const RAILWAY_ALP_CBT2_SYLLABUS: SyllabusUnit[] = [railwayMathUnit, railwayReasoningUnit, railwayPuzzlesUnit, railwayEngUnit, railwayMechEngUnit];


// --- RAILWAY EXAM MOCK TEST SECTIONS ---

export const RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION = [
    { name: 'Mathematics', topics: railwayMathUnit.topics, questionCount: 30 },
    { name: 'General Intelligence and Reasoning', topics: railwayReasoningUnit.topics, questionCount: 20 },
    { name: 'Reasoning Puzzles', topics: railwayPuzzlesUnit.topics, questionCount: 10 },
    { name: 'General Awareness', topics: railwayGAUnit.topics, questionCount: 40 },
];
export const RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION = [
    { name: 'Mathematics', topics: railwayMathUnit.topics, questionCount: 35 },
    { name: 'General Intelligence and Reasoning', topics: railwayReasoningUnit.topics, questionCount: 25 },
    { name: 'Reasoning Puzzles', topics: railwayPuzzlesUnit.topics, questionCount: 10 },
    { name: 'General Awareness', topics: railwayGAUnit.topics, questionCount: 50 },
];

export const RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION = [
    { name: 'General Science', topics: railwayGSUnit.topics, questionCount: 25 },
    { name: 'Mathematics', topics: railwayMathUnit.topics, questionCount: 25 },
    { name: 'General Intelligence and Reasoning', topics: railwayReasoningUnit.topics, questionCount: 20 },
    { name: 'Reasoning Puzzles', topics: railwayPuzzlesUnit.topics, questionCount: 10 },
    { name: 'General Awareness and Current Affairs', topics: railwayGAUnit.topics, questionCount: 20 },
];

export const RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION = [
    { name: 'Mathematics', topics: railwayMathUnit.topics, questionCount: 20 },
    { name: 'General Intelligence and Reasoning', topics: railwayReasoningUnit.topics, questionCount: 15 },
    { name: 'Reasoning Puzzles', topics: railwayPuzzlesUnit.topics, questionCount: 10 },
    { name: 'General Science', topics: railwayGSUnit.topics, questionCount: 20 },
    { name: 'General Awareness and Current Affairs', topics: railwayGAUnit.topics, questionCount: 10 },
];

export const RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION = [ // Part A
    { name: 'Mathematics', topics: railwayMathUnit.topics, questionCount: 25 },
    { name: 'General Intelligence and Reasoning', topics: railwayReasoningUnit.topics, questionCount: 15 },
    { name: 'Reasoning Puzzles', topics: railwayPuzzlesUnit.topics, questionCount: 10 },
    { name: 'Basic Science and Engineering', topics: railwayEngUnit.topics, questionCount: 50 },
];

export const RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION = [
    { name: 'Mechanical Engineering', topics: railwayMechEngUnit.topics, questionCount: 75 },
];

export { 
    // Bank
    BANK_PRELIMS_SYLLABUS,
    BANK_MAINS_SYLLABUS,
    BANK_PRELIMS_TOPIC_DISTRIBUTION,
    BANK_MAINS_TOPIC_DISTRIBUTION,
    BANK_PRELIMS_EXAM_PATTERN,
    BANK_MAINS_EXAM_PATTERN,
    BANK_PRELIMS_SECTION_MAP,
    RRB_BANK_PRELIMS_SYLLABUS,
    RRB_BANK_MAINS_SYLLABUS,
    RRB_BANK_PRELIMS_TOPIC_DISTRIBUTION,
    RRB_BANK_MAINS_TOPIC_DISTRIBUTION,
    RRB_BANK_PRELIMS_EXAM_PATTERN,
    RRB_BANK_MAINS_EXAM_PATTERN,
    // TNPSC
    TNPSC_GROUP_FILTERS,
    TNPSC_STAGE_FILTERS,
    TNPSC_GROUP1_PRELIMS_SYLLABUS,
    TNPSC_GROUP2_PRELIMS_SYLLABUS,
    TNPSC_GROUP4_PRELIMS_SYLLABUS,
    TNPSC_MAINS_SYLLABUS,
    TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION,
    TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION,
    TNPSC_GROUP4_MOCK_TEST_UNIT_DISTRIBUTION,
    // SSC
    SSC_CGL_TIER1_SYLLABUS, 
    SSC_CGL_TIER2_SYLLABUS,
    SSC_CGL_TIER1_EXAM_PATTERN,
    SSC_CGL_TIER2_EXAM_PATTERN,
    SSC_CHSL_TIER1_SYLLABUS,
    SSC_CHSL_TIER2_SYLLABUS,
    SSC_CHSL_TIER1_EXAM_PATTERN,
    SSC_CHSL_TIER2_EXAM_PATTERN,
    SSC_CGL_TIER1_TOPIC_DISTRIBUTION,
    SSC_CGL_TIER2_TOPIC_DISTRIBUTION,
    SSC_CHSL_TIER1_TOPIC_DISTRIBUTION,
    SSC_CHSL_TIER2_TOPIC_DISTRIBUTION,
    SSC_JE_PAPER1_SYLLABUS,
    SSC_JE_PAPER1_EXAM_PATTERN,
    SSC_JE_PAPER1_TOPIC_DISTRIBUTION
};