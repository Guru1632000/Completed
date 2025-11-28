import { SyllabusUnit } from '../../types';
import { SSC_CHSL_TIER1_SYLLABUS, SSC_CHSL_TIER2_SYLLABUS } from './syllabus';

const findUnitTopics = (syllabus: SyllabusUnit[], keywords: string[]) => {
    const unit = syllabus.find(u => keywords.some(kw => u.title.toLowerCase().includes(kw)));
    return unit ? unit.topics : [];
};

export const SSC_CHSL_TIER1_MOCK_TEST_DISTRIBUTION = [
    { 
        name: 'General Intelligence (Reasoning)', 
        topics: findUnitTopics(SSC_CHSL_TIER1_SYLLABUS, ['reasoning', 'intelligence']),
        questionCount: 25 
    },
    { 
        name: 'General Awareness', 
        topics: findUnitTopics(SSC_CHSL_TIER1_SYLLABUS, ['awareness']),
        questionCount: 25 
    },
    { 
        name: 'Quantitative Aptitude (Maths)', 
        topics: findUnitTopics(SSC_CHSL_TIER1_SYLLABUS, ['quantitative', 'maths']),
        questionCount: 25 
    },
    { 
        name: 'English Language', 
        topics: findUnitTopics(SSC_CHSL_TIER1_SYLLABUS, ['english']),
        questionCount: 25 
    },
];

export const SSC_CHSL_TIER2_MOCK_TEST_DISTRIBUTION = [
    { 
        name: 'Mathematical Abilities', 
        topics: findUnitTopics(SSC_CHSL_TIER2_SYLLABUS, ['mathematical']),
        questionCount: 30 
    },
    { 
        name: 'Reasoning and General Intelligence', 
        topics: findUnitTopics(SSC_CHSL_TIER2_SYLLABUS, ['reasoning']),
        questionCount: 30 
    },
    { 
        name: 'English Language and Comprehension', 
        topics: findUnitTopics(SSC_CHSL_TIER2_SYLLABUS, ['english']),
        questionCount: 40 
    },
    { 
        name: 'General Awareness', 
        topics: findUnitTopics(SSC_CHSL_TIER2_SYLLABUS, ['awareness']),
        questionCount: 20 
    },
    { 
        name: 'Computer Knowledge Test', 
        topics: findUnitTopics(SSC_CHSL_TIER2_SYLLABUS, ['computer']),
        questionCount: 15 
    },
];