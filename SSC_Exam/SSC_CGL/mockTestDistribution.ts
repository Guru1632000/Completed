import { SyllabusUnit } from '../../types';
import { SSC_CGL_TIER1_SYLLABUS, SSC_CGL_TIER2_SYLLABUS } from './syllabus';

const findUnitTopics = (syllabus: SyllabusUnit[], keywords: string[]) => {
    const unit = syllabus.find(u => keywords.some(kw => u.title.toLowerCase().includes(kw)));
    return unit ? unit.topics : [];
};

export const SSC_CGL_TIER1_MOCK_TEST_DISTRIBUTION = [
    { 
        name: 'General Intelligence & Reasoning', 
        topics: findUnitTopics(SSC_CGL_TIER1_SYLLABUS, ['reasoning', 'intelligence']),
        questionCount: 25 
    },
    { 
        name: 'General Awareness', 
        topics: findUnitTopics(SSC_CGL_TIER1_SYLLABUS, ['awareness']),
        questionCount: 25 
    },
    { 
        name: 'Quantitative Aptitude', 
        topics: findUnitTopics(SSC_CGL_TIER1_SYLLABUS, ['quantitative', 'maths']),
        questionCount: 25 
    },
    { 
        name: 'English Comprehension', 
        topics: findUnitTopics(SSC_CGL_TIER1_SYLLABUS, ['english']),
        questionCount: 25 
    },
];

export const SSC_CGL_TIER2_MOCK_TEST_DISTRIBUTION = [
    { 
        name: 'Mathematical Abilities', 
        topics: findUnitTopics(SSC_CGL_TIER2_SYLLABUS, ['mathematical']),
        questionCount: 30 
    },
    { 
        name: 'Reasoning and General Intelligence', 
        topics: findUnitTopics(SSC_CGL_TIER2_SYLLABUS, ['reasoning']),
        questionCount: 30 
    },
    { 
        name: 'English Language and Comprehension', 
        topics: findUnitTopics(SSC_CGL_TIER2_SYLLABUS, ['english']),
        questionCount: 45 
    },
    { 
        name: 'General Awareness', 
        topics: findUnitTopics(SSC_CGL_TIER2_SYLLABUS, ['awareness']),
        questionCount: 25 
    },
    { 
        name: 'Computer Knowledge Test', 
        topics: findUnitTopics(SSC_CGL_TIER2_SYLLABUS, ['computer']),
        questionCount: 20 
    },
];