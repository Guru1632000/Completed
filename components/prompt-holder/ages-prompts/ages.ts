/**
 * Generates a prompt for "Problems on Ages" questions with detailed difficulty scaling,
 * based on high-quality bank exam examples.
 * Note: Each question is logically independent.
 */
const AGES_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantitative Aptitude MCQs for Bank Exams on the topic of "Problems on Ages". Each question must be a logically independent word problem.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is correct. Distractors should be plausible results from common calculation errors.
- **CRITICAL FORMATTING RULE:** The \`questionText\` field **MUST** contain a single, complete, and coherent word problem. It **MUST NOT** be a list of statements or fragmented sentences.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a balanced mix of the following concepts:
1.  **Ratio-Based Problems:** Problems where the ratio of present, past, or future ages is given.
2.  **Average Age Problems:** Scenarios involving the average age of a group, and how it changes when people join or leave.
3.  **Difference/Sum Problems:** The sum or difference of ages is used to form equations.
4.  **Past/Future Scenarios:** Questions involving "x years ago" or "y years hence" to link ages across different time points.
5.  **Algebraic Setups:** Complex word problems that require setting up and solving one or more linear equations.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Simple problems involving two people and a single ratio or time jump (e.g., "5 years ago...").
-   **For 'Moderate' difficulty:** Problems involving three people, changing ratios over time, simple averages, or two linked equations.
-   **For 'Hard' difficulty:** Complex problems involving multiple ratios, multiple time jumps, multi-person averages with members joining/leaving, and complex algebraic setups.
-   **For 'Mixed' difficulty:** A mix of Easy and Moderate problems, with some Hard problems included.

**Example Questions to Model After (CRITICAL: Generate questions of this style, complexity, and language):**

--- HIGH-QUALITY EXAMPLES (BANK EXAM STANDARD) ---
1.  **Full Question Text:** "The ratio of present age of A to that of B is 3:2 and the ratio of present age of A to that of C is 3:5. The average present age of A, B and C is 20 years. Find the age of B after 8 years."
2.  **Full Question Text:** "5 years ago, the ratio of the ages of A and B was 5:6. 2 years hence, the ratio of their ages will be 6:7. If the average of the present ages of A, B and C is 40 years, what is C’s age after 7 years?"
3.  **Full Question Text:** "The sum of the present ages of a father and his son is 60 years. Six years ago, the father's age was five times the age of the son. What will be the son's age after 6 years?"

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly set up the equations and solve them step-by-step.
`;

export const getAgesPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return AGES_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
