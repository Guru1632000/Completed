/**
 * Generates a prompt for Compound Interest (CI) questions with detailed difficulty scaling and question types.
 * These questions test concepts like finding CI, Principal (P), Rate (R), Time (T), amount, compounding frequency, CI vs SI difference, etc.
 * Note: Each question is logically independent and does not share a context.
 */
const COMPOUND_INTEREST_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Compound Interest (CI) questions, adhering to the specified difficulty distribution and exam style for Bank Prelims and Mains. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on direct formula-based questions with annual compounding.
    -   Calculate CI or Amount when P, R, and T are given. Use simple numbers.
    -   Example: "Find the Compound Interest on Rs. 10,000 for 2 years at 10% per annum compounded annually."
-   **For 'Moderate' difficulty:**
    -   Involve half-yearly and quarterly compounding.
    -   Include reverse calculations (e.g., finding Principal from Amount).
    -   Introduce the difference between Simple Interest (SI) and CI for 2 years.
    -   Example: "A sum of money amounts to Rs. 1210 in 2 years at 10% compound interest compounded annually. Find the principal."
-   **For 'Hard' difficulty:**
    -   Involve multi-concept problems with complex conditions.
    -   Use concepts like changing rates for different years, difference between SI and CI for 3 years, depreciation, population growth, or installment calculations.
    -   Example: "The population of a town increases by 5% in the first year and 10% in the second year. If the present population is 12,100, what was it two years ago?"
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES ---
Q1. A bank offers 5% compound interest calculated on half-yearly basis. A customer deposits Rs. 1600 each on 1st January and 1st July of a year. At the end of the year, the amount he would have gained by way of interest is:
Q2. The difference between simple and compound interests compounded annually on a certain sum of money for 2 years at 4% per annum is Re. 1. The sum (in Rs.) is:
Q3. There is 60% increase in an amount in 6 years at simple interest. What will be the compound interest of Rs. 12,000 after 3 years at the same rate?
Q4. What is the difference between the compound interests on Rs. 5000 for 1.5 years at 4% per annum compounded yearly and half-yearly?
Q5. At what rate of compound interest per annum will a sum of Rs. 1200 become Rs. 1348.32 in 2 years?
Q6. The least number of complete years in which a sum of money put out at 20% compound interest will be more than doubled is:
Q7. The effective annual rate of interest corresponding to a nominal rate of 6% per annum payable half-yearly is:
Q8. If a sum of Rs.8000 is lended for 20% per annum at compound interest then the sum of the amount will be Rs.13824 in how many years?
Q9. Find the compound interest on a principal amount of Rs.5000 after 2 years, if the rate of interest for the 1st year is 2% and for the 2nd year is 4%.
Q10. What sum(principal) will amount to Rs.34536.39 at compound interest in 3 years, the rate of interest for 1st, 2nd and 3rd year being 5%, 6% and 7% respectively?
Q11. The difference between the compound interest and the simple interest on a sum for two years at 10% pa, when the interest is compounded yearly, is Rs 400. If the interest is compounded half-yearly, what will be the difference between the CI and the SI?
Q12. A man borrows Rs. 6000 at 10% compound rate of interest. He pays back Rs. 2000 at the end of each year to clear his debt. The amount that he should pay to clear all his dues at the end of third year is:

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getCompoundInterestPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return COMPOUND_INTEREST_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
