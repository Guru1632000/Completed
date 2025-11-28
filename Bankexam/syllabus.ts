
import { SyllabusUnit, Topic } from '../types';

const createTopicsForUnit = (unitTitle: string, topicNames: string[]): Topic[] => {
    return topicNames.map(name => ({ name, unit: unitTitle }));
};

const bankPrelimsSyllabusText = {
  reasoningAbility: `
Reasoning Syllabus for Bank Exam
Seating Arrangement (Linear, Circular, Square, Triangular)
Floor & Flat Puzzles
Scheduling Puzzles (Day, Week, Month, Year)
Box-Based Puzzles
Ranking & Order Puzzles
Blood Relation Puzzles
Age-Based Puzzles
Number Sequence
Input - Output
Coding-Decoding
Syllogism
Alphabet test
Alphanumeric Sequence
Causes and Effects
Direction Sense
Word Formation
Inequality
Statement and Assumption
Assertion and Reason
Statement and Conclusion
Statement and Arguments
Statements and Action Courses
`,
  quantitativeAptitude: `
Quantitative Aptitude Syllabus for Bank Exam
Number Series
Data Interpretation
Quadratic Equation
HCF & LCM
Simplification
Approximation
Profit & Loss
Simple Interest & Compound Interest
Time & Work
Time, Speed, & Distance
Decimal & Fraction
Data Sufficiency
Quantity Based Questions
Average
Partnership
Percentage
Mixture & Allegations
Ratio & Proportion
Boats and Streams
Problems On Trains
Ages
Mensuration
Pipes and cisterns
Permutation & Combination
Probability
`,
  englishLanguage: `
English Syllabus for Bank Exam
Reading Comprehensions
Grammar / Vyakaran
Spotting Errors
Fill in the Blanks
Misspelled Words
Jumbled Words
Rearrangement of Sentence
Parajumbles
Idioms and Phrases
Cloze Tests
One word Substitution
Antonyms and Synonyms
`,
};

const bankMainsSyllabusText = {
  reasoning: `
Reasoning Syllabus for Bank Exam
Puzzles
Seating Arrangement
Number Sequence
Input - Output
Coding-Decoding
Blood Relation
Syllogism
Alphabet test
Alphanumeric Sequence
Order & Ranking
Causes and Effects
Direction Sense
Word Formation
Inequality
Statement and Assumption
Assertion and Reason
Statement and Conclusion
Statement and Arguments
Statements and Action Courses
`,
  quantitativeAptitude: `
Quantitative Aptitude Syllabus for Bank Exam
Number Series
Data Interpretation
Quadratic Equation
HCF & LCM
Simplification
Approximation
Profit & Loss
Simple Interest & Compound Interest
Time & Work
Time, Speed, & Distance
Decimal & Fraction
Data Sufficiency
Quantity Based Questions
Average
Partnership
Percentage
Mixture & Allegations
Ratio & Proportion
Boats and Streams
Problems On Trains
Ages
Mensuration
Pipes and Cisterns
Permutation & Combination
Probability
`,
  english: `
English Syllabus for Bank Exam
Reading Comprehensions
Grammar / Vyakaran
Spotting Errors
Fillers
Misspelt Words
Jumbled Words
Sentence Rearrangement
Jumbled sentences
Idioms and Phrases
Cloze Tests
Match the Column
One word Substitution
Sentence correction
Identify the Correct Sentence
Antonyms and Synonyms
Word Replacement
Word Usage
Word rearrangement
Phrase Replacement
Sentence Connector
Sentence Improvement
Vocabulary
Word Swap
Pairs of words
Starters
`,
  generalAwareness: `
General Awareness
Current Affairs
Banking Awareness
Government Schemes & Policies
Financial awareness
Static GK
`,
  computerAwareness: `
Computer Awareness
Fundamentals of Computer
History of Computers
Networking
Software & Hardware
Basic Knowledge of the Internet
Computer Languages
Computer Shortcut Keys
Database
Input and Output Devices
MS Office
Number System
Virus, Hacking, and Security Tools
Important computer terminologies and abbreviations
`
};

const parseBankSyllabusText = (text: string): string[] => {
    const lines = text.trim().split('\n');
    // The first line is a heading, so we slice it off.
    const topicLines = lines.slice(1);
    return topicLines
        .map(line => line.replace(/\[.*?\]\(.*?\)/g, '').trim()) // Remove markdown links
        .filter(line => line.length > 0);
};

// PRELIMS
const bankReasoningPrelimsTopics = parseBankSyllabusText(bankPrelimsSyllabusText.reasoningAbility);
const bankQuantPrelimsTopics = parseBankSyllabusText(bankPrelimsSyllabusText.quantitativeAptitude);
const bankEnglishPrelimsTopics = parseBankSyllabusText(bankPrelimsSyllabusText.englishLanguage);

export const bankReasoningPrelims: SyllabusUnit = { id: 'bank-pre-reason', title: 'Reasoning Ability', topics: createTopicsForUnit('Reasoning Ability', bankReasoningPrelimsTopics) };
export const bankQuantPrelims: SyllabusUnit = { id: 'bank-pre-quant', title: 'Quantitative Aptitude', topics: createTopicsForUnit('Quantitative Aptitude', bankQuantPrelimsTopics) };
export const bankEnglishPrelims: SyllabusUnit = { id: 'bank-pre-eng', title: 'English Language', topics: createTopicsForUnit('English Language', bankEnglishPrelimsTopics) };

export const BANK_PRELIMS_SYLLABUS: SyllabusUnit[] = [bankReasoningPrelims, bankQuantPrelims, bankEnglishPrelims];

// MAINS
const bankReasoningMainsTopics = parseBankSyllabusText(bankMainsSyllabusText.reasoning);
const bankComputerMainsTopics = parseBankSyllabusText(bankMainsSyllabusText.computerAwareness);
const bankQuantMainsTopics = parseBankSyllabusText(bankMainsSyllabusText.quantitativeAptitude);
const bankEnglishMainsTopics = parseBankSyllabusText(bankMainsSyllabusText.english);
const bankGAMainsTopics = parseBankSyllabusText(bankMainsSyllabusText.generalAwareness);

export const bankReasoningMains: SyllabusUnit = { 
    id: 'bank-main-reason', 
    title: 'Reasoning', 
    topics: createTopicsForUnit('Reasoning', bankReasoningMainsTopics) 
};

export const bankComputerMains: SyllabusUnit = { 
    id: 'bank-main-comp', 
    title: 'Computer Aptitude', 
    topics: createTopicsForUnit('Computer Aptitude', bankComputerMainsTopics) 
};

export const bankQuantMains: SyllabusUnit = { id: 'bank-main-quant', title: 'Data Analysis & Interpretation', topics: createTopicsForUnit('Data Analysis & Interpretation', bankQuantMainsTopics) };
export const bankEnglishMains: SyllabusUnit = { id: 'bank-main-eng', title: 'English Language', topics: createTopicsForUnit('English Language', bankEnglishMainsTopics) };
export const bankGAMains: SyllabusUnit = { id: 'bank-main-ga', title: 'General / Economy / Banking Awareness', topics: createTopicsForUnit('General / Economy / Banking Awareness', bankGAMainsTopics) };

export const BANK_MAINS_SYLLABUS: SyllabusUnit[] = [bankReasoningMains, bankComputerMains, bankQuantMains, bankEnglishMains, bankGAMains];
