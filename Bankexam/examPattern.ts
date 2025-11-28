
export const BANK_PRELIMS_EXAM_PATTERN = [
  { section: 'Reasoning Ability', questions: 35 },
  { section: 'Quantitative Aptitude', questions: 35 },
  { section: 'English Language', questions: 30 },
];

export const BANK_MAINS_EXAM_PATTERN = [
  { section: 'Reasoning & Computer Aptitude', questions: 45 },
  { section: 'Data Analysis & Interpretation', questions: 35 },
  { section: 'English Language', questions: 35 },
  { section: 'General Awareness', questions: 40 },
];

export const BANK_PRELIMS_SECTION_MAP: { [key: string]: 'Reasoning Ability' | 'Quantitative Aptitude' | 'English Language' } = {
    // Reasoning
    'Puzzles and Seating Arrangement': 'Reasoning Ability',
    'Syllogism': 'Reasoning Ability',
    'Inequality': 'Reasoning Ability',
    'Coding-Decoding': 'Reasoning Ability',
    'Blood Relation': 'Reasoning Ability',
    'Series (Alphanumeric/Number)': 'Reasoning Ability',
    'Direction & Distance': 'Reasoning Ability',
    'Order & Ranking': 'Reasoning Ability',
    // Quant
    'Data Interpretation': 'Quantitative Aptitude',
    'Number Series': 'Quantitative Aptitude',
    'Quadratic Equation': 'Quantitative Aptitude',
    'Simplification/Approximation': 'Quantitative Aptitude',
    'Arithmetic Word Problems': 'Quantitative Aptitude',
    // English
    'Reading Comprehension': 'English Language',
    'Cloze Test': 'English Language',
    'Error Detection': 'English Language',
    'Para Jumbles/Sentence Rearrangement': 'English Language',
    'Fillers/Word Replacement': 'English Language',
};
