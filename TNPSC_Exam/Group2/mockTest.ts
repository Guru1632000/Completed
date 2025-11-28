import { 
    englishGrammarUnit, englishVocabUnit, englishWritingUnit, englishTechUnit, 
    englishReadingUnit, englishTranslationUnit, englishLitUnit,
    gsUnit1, gsUnit2, gsUnit3, gsUnit4, gsUnit5, gsUnit6,
    aptitudeUnit, reasoningUnit
} from '../common/units';

export const TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION = [
    // General English (100 Qs)
    { name: 'General English', topics: englishGrammarUnit.topics, questionCount: 25 },
    { name: 'General English', topics: englishVocabUnit.topics, questionCount: 15 },
    { name: 'General English', topics: englishWritingUnit.topics, questionCount: 10 },
    { name: 'General English', topics: englishTechUnit.topics, questionCount: 10 },
    { name: 'General English', topics: englishReadingUnit.topics, questionCount: 20 },
    { name: 'General English', topics: englishTranslationUnit.topics, questionCount: 5 },
    { name: 'General English', topics: englishLitUnit.topics, questionCount: 15 },
    // General Studies (75 Qs)
    { name: 'General Studies', topics: gsUnit1.topics, questionCount: 5 },
    { name: 'General Studies', topics: gsUnit2.topics, questionCount: 5 },
    { name: 'General Studies', topics: gsUnit3.topics, questionCount: 10 },
    { name: 'General Studies', topics: gsUnit4.topics, questionCount: 15 },
    { name: 'General Studies', topics: gsUnit5.topics, questionCount: 20 },
    { name: 'General Studies', topics: gsUnit6.topics, questionCount: 20 },
    // Aptitude & Reasoning (25 Qs)
    { name: 'Maths', topics: aptitudeUnit.topics, questionCount: 15 },
    { name: 'Maths', topics: reasoningUnit.topics, questionCount: 10 },
];
