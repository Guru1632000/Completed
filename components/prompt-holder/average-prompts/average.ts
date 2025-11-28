/**
 * Generates a prompt for Average questions with detailed difficulty scaling and a wide variety of question types.
 * These questions test concepts from basic averages to weighted, successive, age, speed, and group-based problems.
 * Note: Each question is logically independent and does not share a context.
 */
const AVERAGE_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantitative Aptitude questions on the topic of Averages, adhering to the specified difficulty distribution and exam style for Bank Prelims and Mains (IBPS, SBI, RRB). Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Required Question Variety (CRITICAL):**
Your generated set of \${numberOfQuestions} questions MUST include a balanced mix of the following concepts:
1.  **Basic Formula & Missing Number:** Simple calculations of average, sum, or finding a missing/excluded term.
2.  **Weighted Average:** Scenarios involving different groups with different weights (e.g., salaries, marks).
3.  **Successive Averages:** The effect of adding, removing, or replacing a value on the average.
4.  **Consecutive Numbers:** Averages of consecutive odd, even, or natural numbers.
5.  **Average Speed:** Problems involving journeys with different speeds (for both equal and unequal distances).
6.  **Average Age & Marks:** Word problems based on the average age of a group or average marks of students.
7.  **Combination of Groups:** Finding the combined average when two or more groups are merged.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Focus on basic formula, simple missing numbers, and direct consecutive number problems.
-   **For 'Moderate' difficulty:** Involve weighted average, successive averages, average speed with equal distances, and simple age/marks problems.
-   **For 'Hard' difficulty:** Focus on complex successive averages, combination of groups, average speed with unequal distances, and multi-step age/marks problems with ratios or algebraic expressions.
-   **For 'Mixed' difficulty:** Generate a balanced mix of Easy, Moderate, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES ---
Q1. The average of 5 consecutive odd numbers is 17 and the average of the 7 consecutive even numbers is 46, then what is the difference between the greatest even number and the second lowest odd number of respective series?
Q2. Average weight of A, B and C is 48 kg which is 8 kg more than of D’s weight. A’s weight is 8 kg more than D and 12 kg more than B. What is the average weight of B and C?
Q3. The school contains 30 students and the ratio of the boys to girls in the school is 3:2. If the ratio of the average weight of boys to girls is 3:8 and the average weight of all the students in the school is 15 kg, what is the average weight of the boys in the school?
Q4. Average monthly income of all employees in a company is Rs.20000. Average monthly income of 80 workers is Rs.18000 and average monthly income of remaining employees is Rs.24000. How many employees are there in the company?
Q5. Average age of students of a class is 18 years and when two new students of ages 22 years and 19 years joined the class and one student of age 15 years left the class, then average of the class is increased by 0.5 years, then what is the initial number of students in the class?
Q6. The average weight of P, Q and R is 78 kg. If S joined with them, the average now is 76 kg. If another person T who is 5 kg heavier than S and S replaces P then the average weight of Q, R, S and T becomes 75 kg. What is the weight of P?

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getAveragePrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return AVERAGE_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
