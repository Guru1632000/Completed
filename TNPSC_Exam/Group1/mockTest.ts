import { 
    gsUnit1, gsUnit2, gsUnit3, gsUnit4, gsUnit5, gsUnit6,
    aptitudeUnit, reasoningUnit
} from '../common/units';

export const TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION = [
    // General Studies (175 Qs)
    { name: 'General Studies', topics: gsUnit1.topics, questionCount: 10 }, // Science
    { name: 'General Studies', topics: gsUnit2.topics, questionCount: 10 }, // Geography
    { name: 'General Studies', topics: gsUnit3.topics, questionCount: 25 }, // History & INM
    { name: 'General Studies', topics: gsUnit4.topics, questionCount: 40 }, // Polity
    { name: 'General Studies', topics: gsUnit5.topics, questionCount: 50 }, // Economy & TN Admin
    { name: 'General Studies', topics: gsUnit6.topics, questionCount: 40 }, // TN History & Culture
    // Aptitude & Reasoning (25 Qs)
    { name: 'Maths', topics: aptitudeUnit.topics, questionCount: 15 },
    { name: 'Maths', topics: reasoningUnit.topics, questionCount: 10 },
];