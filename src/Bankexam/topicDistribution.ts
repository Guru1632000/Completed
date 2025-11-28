
export const BANK_PRELIMS_TOPIC_DISTRIBUTION = {
    'Reasoning Ability': [
        // Puzzles: At least 3 sets of 5 questions each = 15 questions.
        // Each entry represents a "slot" for a puzzle set. The AI will randomly pick one topic
        // from the keywords to generate 5 questions, ensuring a variety of puzzle types across tests.
        { topicKeywords: ['Seating Arrangement (Linear, Circular, Square, Triangular)', 'Ranking & Order Puzzles'], min: 5, max: 5 }, // Slot 1: Arrangement Puzzles
        { topicKeywords: ['Floor & Flat Puzzles', 'Box-Based Puzzles'], min: 5, max: 5 },     // Slot 2: Structural Puzzles
        { topicKeywords: ['Scheduling Puzzles', 'Blood relation Puzzles', 'Age-Based Puzzles'], min: 5, max: 5 }, // Slot 3: Logical/Time-based Puzzles

        // Miscellaneous topics for the remaining 20 questions
        { topicKeywords: ['syllogism'], min: 3, max: 5 },
        { topicKeywords: ['inequality'], min: 3, max: 5 },
        { topicKeywords: ['coding-decoding'], min: 3, max: 5 },
        { topicKeywords: ['blood relation'], min: 2, max: 3 }, // Can also be standalone questions
        { topicKeywords: ['alphanumeric sequence', 'number sequence', 'alphabet test'], min: 3, max: 5 },
        { topicKeywords: ['direction sense'], min: 2, max: 3 },
    ],
    'Quantitative Aptitude': [
        { topicKeywords: ['data interpretation'], min: 10, max: 15 },
        { topicKeywords: ['number series'], min: 4, max: 6 },
        { topicKeywords: ['quadratic equation', 'quantity based questions'], min: 4, max: 6 },
        { topicKeywords: ['simplification', 'approximation'], min: 4, max: 6 },
        { topicKeywords: ['hcf & lcm', 'profit & loss', 'interest', 'time & work', 'time, speed, & distance', 'average', 'partnership', 'percentage', 'mixture & allegations', 'ratio & proportion', 'boats and streams', 'ages', 'mensuration', 'pipes and cisterns', 'probability'], min: 8, max: 12 },
    ],
    'English Language': [
        { topicKeywords: ['reading comprehension'], min: 8, max: 10 },
        { topicKeywords: ['cloze test'], min: 5, max: 7 },
        { topicKeywords: ['spotting errors', 'error detection'], min: 4, max: 5 },
        { topicKeywords: ['parajumbles', 'rearrangement of sentence'], min: 4, max: 5 },
        { topicKeywords: ['fill in the blanks', 'word replacement', 'word usage', 'word swap'], min: 4, max: 5 },
    ],
};

export const BANK_MAINS_TOPIC_DISTRIBUTION = {
    'Reasoning & Computer Aptitude': [
        // Puzzles: For Mains, we aim for 4 sets of harder puzzles.
        // Each entry is a "slot" ensuring a different category of puzzle is generated.
        { topicKeywords: ['Seating Arrangement (Linear, Circular, Square, Triangular)', 'Input - Output'], min: 5, max: 5 }, // Slot 1: Complex Arrangement
        { topicKeywords: ['Floor & Flat Puzzles', 'Box-Based Puzzles'], min: 5, max: 5 }, // Slot 2: Structural Puzzles
        { topicKeywords: ['Scheduling Puzzles', 'Ranking & Order Puzzles'], min: 5, max: 5 }, // Slot 3: Time/Order Puzzles
        { topicKeywords: ['Blood relation Puzzles', 'Age-Based Puzzles'], min: 5, max: 5 }, // Slot 4: Logical Puzzles

        // Miscellaneous topics (remaining 25 questions)
        { topicKeywords: ['statement', 'assumption', 'conclusion', 'arguments', 'courses of action', 'data sufficiency'], min: 5, max: 8 }, // High level reasoning
        { topicKeywords: ['blood relation', 'direction sense'], min: 3, max: 5 },
        { topicKeywords: ['inequality', 'coding-decoding'], min: 4, max: 6 },
        { topicKeywords: ['syllogism'], min: 3, max: 5 },
        { topicKeywords: ['computer'], min: 4, max: 7 },
    ],
    'Data Analysis & Interpretation': [
        { topicKeywords: ['data interpretation'], min: 15, max: 20 },
        { topicKeywords: ['quantity based questions'], min: 3, max: 5 },
        { topicKeywords: ['data sufficiency'], min: 3, max: 5 },
        { topicKeywords: ['number series'], min: 2, max: 5 },
        { topicKeywords: ['hcf & lcm', 'profit & loss', 'interest', 'time & work', 'time, speed, & distance', 'average', 'partnership', 'percentage', 'mixture & allegations', 'ratio & proportion', 'boats and streams', 'ages', 'mensuration', 'pipes and cisterns', 'probability'], min: 5, max: 10 }, // High-level arithmetic
    ],
    'English Language': [
        { topicKeywords: ['reading comprehension'], min: 10, max: 15 },
        { topicKeywords: ['cloze test', 'fillers'], min: 5, max: 8 },
        { topicKeywords: ['sentence rearrangement', 'parajumbles', 'sentence connector', 'starters'], min: 5, max: 7 },
        { topicKeywords: ['spotting errors', 'sentence correction', 'phrase replacement'], min: 5, max: 7 },
        { topicKeywords: ['vocabulary', 'word usage', 'word swap', 'antonyms', 'synonyms'], min: 5, max: 8 },
    ],
    'General Awareness': [
        { topicKeywords: ['current affairs'], min: 20, max: 25 },
        { topicKeywords: ['banking awareness', 'financial awareness'], min: 10, max: 15 },
        { topicKeywords: ['static gk'], min: 3, max: 8 },
    ],
};
