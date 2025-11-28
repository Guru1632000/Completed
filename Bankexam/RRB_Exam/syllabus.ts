
import { SyllabusUnit, Topic } from '../../types';

const createTopicsForUnit = (unitTitle: string, topicNames: string[]): Topic[] => {
    return topicNames.map(name => ({ name, unit: unitTitle }));
};

const parseBankSyllabusText = (text: string): string[] => {
    const lines = text.trim().split('\n');
    const topicLines = lines.slice(1);
    return topicLines
        .map(line => line.replace(/\[.*?\]\(.*?\)/g, '').trim())
        .filter(line => line.length > 0);
};

const rrbBankPrelimsSyllabusText = {
  reasoningAbility: `
Reasoning Syllabus for Bank Exam
Seating Arrangement (Linear, Circular, Square, Triangular)
Ranking & Order Puzzles
Floor & Flat Puzzles
Box-Based Puzzles
Scheduling Puzzles
Blood Relation Puzzles
Age-Based Puzzles
Syllogism
Inequality
Coding-Decoding
Blood Relation
Alphanumeric Sequence
Number Sequence
Alphabet Test
Direction Sense
`,
  quantitativeAptitude: `
Quantitative Aptitude Syllabus for Bank Exam
Data Interpretation
Number Series
Quadratic Equation
Quantity Based Questions
Simplification
Approximation
HCF & LCM
Profit & Loss
Simple Interest & Compound Interest
Time & Work
Time, Speed, & Distance
Average
Partnership
Percentage
Mixture & Allegations
Ratio & Proportion
Boats and Streams
Ages
Mensuration
Pipes and Cisterns
Probability
`
};

const rrbBankMainsSyllabusText = {
  reasoning: `
Reasoning Ability
Puzzles
Seating Arrangements
Direction Sense
Blood Relation
Syllogism
Order and Ranking
Coding-Decoding
Machine Input-Output
Inequalities
Alpha-Numeric-Symbol Series
Data Sufficiency
Logical Reasoning
`,
  numericalAbility: `
Numerical Ability
Number Series
Data Interpretation
Inequalities (Quadratic Equations)
Simplification & Approximation
Data Sufficiency
Miscellaneous Arithmetic Problems
`,
  english: `
English Language
Reading Comprehension
Cloze Test
Para jumbles
Miscellaneous
Fill in the blanks
Multiple Meaning / Error Spotting
Paragraph Completion
`,
  generalAwareness: `
General Awareness
India and International Current Affairs
Banking Awareness
Countries and Currencies
National Parks and Wildlife Sanctuaries
Banking Terms and Abbreviations
Banking History
RBI
Sports
Finance
Books and Authors
Agriculture
Fiscal Policies
Budget
Government Schemes
Government Policies
Budget and Economic Survey
Overview of Banking and Banking Reforms in India
Bank Accounts and Special Individuals
Organizations / Deposits / Credit
Loans
Advanced Non-Performing Assets (NPAs)
Asset Reconstruction Companies
NPAs
Restructuring of Loans
Bad Loans
Risk Management
Basel I
Basel II
Basel III
Accords
latest Topics in Financial World / Monetary Policy
`,
  computerKnowledge: `
Computer Knowledge
Computer Fundamentals
Computer Abbreviations
Software and Hardware Fundamentals
Shortcut Keys
Networking
Basic Knowledge of the Internet
MS Office
Database
History of Computer
Security Tools
Number System and Conversions
Computer Languages
Internet
Input and Output Devices
`
};

// RRB PRELIMS SYLLABUS
const rrbBankReasoningPrelimsTopics = parseBankSyllabusText(rrbBankPrelimsSyllabusText.reasoningAbility);
const rrbBankQuantPrelimsTopics = parseBankSyllabusText(rrbBankPrelimsSyllabusText.quantitativeAptitude);
export const rrbBankReasoningPrelims: SyllabusUnit = { id: 'rrb-bank-pre-reason', title: 'Reasoning Ability', topics: createTopicsForUnit('Reasoning Ability', rrbBankReasoningPrelimsTopics) };
export const rrbBankQuantPrelims: SyllabusUnit = { id: 'rrb-bank-pre-quant', title: 'Quantitative Aptitude', topics: createTopicsForUnit('Quantitative Aptitude', rrbBankQuantPrelimsTopics) };
export const RRB_BANK_PRELIMS_SYLLABUS: SyllabusUnit[] = [rrbBankReasoningPrelims, rrbBankQuantPrelims];

// RRB MAINS SYLLABUS
const rrbBankReasoningMainsTopics = parseBankSyllabusText(rrbBankMainsSyllabusText.reasoning);
const rrbBankNumericalAbilityMainsTopics = parseBankSyllabusText(rrbBankMainsSyllabusText.numericalAbility);
const rrbBankEnglishMainsTopics = parseBankSyllabusText(rrbBankMainsSyllabusText.english);
const rrbBankGAMainsTopics = parseBankSyllabusText(rrbBankMainsSyllabusText.generalAwareness);
const rrbBankComputerMainsTopics = parseBankSyllabusText(rrbBankMainsSyllabusText.computerKnowledge);

export const rrbBankReasoningMains: SyllabusUnit = { id: 'rrb-bank-main-reason', title: 'Reasoning Ability', topics: createTopicsForUnit('Reasoning Ability', rrbBankReasoningMainsTopics) };
export const rrbBankNumericalAbilityMains: SyllabusUnit = { id: 'rrb-bank-main-numerical', title: 'Numerical Ability', topics: createTopicsForUnit('Numerical Ability', rrbBankNumericalAbilityMainsTopics) };
export const rrbBankEnglishMains: SyllabusUnit = { id: 'rrb-bank-main-eng', title: 'English Language', topics: createTopicsForUnit('English Language', rrbBankEnglishMainsTopics) };
export const rrbBankGAMains: SyllabusUnit = { id: 'rrb-bank-main-ga', title: 'General Awareness', topics: createTopicsForUnit('General Awareness', rrbBankGAMainsTopics) };
export const rrbBankComputerMains: SyllabusUnit = { id: 'rrb-bank-main-comp', title: 'Computer Knowledge', topics: createTopicsForUnit('Computer Knowledge', rrbBankComputerMainsTopics) };
export const RRB_BANK_MAINS_SYLLABUS: SyllabusUnit[] = [rrbBankReasoningMains, rrbBankGAMains, rrbBankNumericalAbilityMains, rrbBankEnglishMains, rrbBankComputerMains];
