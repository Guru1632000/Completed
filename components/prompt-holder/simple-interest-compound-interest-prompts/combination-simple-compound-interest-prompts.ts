/**
 * Generates a prompt for questions combining Simple Interest (SI) and Compound Interest (CI) concepts.
 * These questions test various scenarios like finding P/R/T, differences, installments, and multi-step problems.
 * Note: Each question is logically independent and does not share a context.
 */
const COMBINATION_SI_CI_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct questions that combine concepts of Simple and Compound Interest (SI & CI), tailored for Bank Prelims and Mains exams (IBPS, SBI, RRB). Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on direct formula-based problems for either SI or CI.
    -   Example: "Find the Simple Interest on ₹5000 at 10% per annum for 2 years." or "Find the Compound Interest on ₹4000 for 2 years at 5% per annum compounded annually."
-   **For 'Moderate' difficulty:**
    -   Involve two-step problems or finding a missing variable (P, R, or T).
    -   Introduce the difference between CI and SI for 2 or 3 years.
    -   Use scenarios where an amount from an SI scheme is reinvested into a CI scheme.
    -   Example: "The difference between CI and SI on a certain sum for 2 years at 10% p.a. is ₹50. Find the principal."
-   **For 'Hard' difficulty:**
    -   Involve multi-concept, tricky scenarios with variables and linked conditions.
    -   Use concepts like population growth/depreciation, installment-based problems, or changing rates.
    -   Combine SI and CI calculations within a single problem.
    -   Example: "Suman invested Rs.(x + 1000) in a compound interest scheme at the rate of 10% per annum for 2 years and he also invested Rs.x in a simple interest scheme at the rate of 15% per annum for 3 years. The interest received on the simple interest scheme is Rs.750 more than that of the compound interest scheme. Find the value of x?"
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy (20%), Medium (50%), and Hard (30%) patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES (Moderate to Hard) ---
Q1. Ram invested Rs.x at a certain rate of interest on simple interest and after 6 years, the total amount obtained by him is 90% more than his investment. If he invested Rs.4800 at the same rate of interest on compound interest, then find the total compound interest received by him after 3 years?
Q2. Suman invested Rs.(x + 1000) in a compound interest scheme at the rate of 10% per annum for 2 years and he also invested Rs.x in a simple interest scheme at the rate of 15% per annum for 3 years. The interest received on the simple interest scheme is Rs.750 more than that of the compound interest scheme. Find the value of x?
Q3. Yamuna invested Rs.9000 in a compound interest scheme at the rate of 15% per annum for 2 years. She invested the total compound amount in a simple interest scheme at the rate of 18% per annum for x years and after x years, she received the total amount from the simple interest scheme is Rs.20472.3. Find the value of x?
Q4. Vimal invested Rs.x in a simple interest scheme at the rate of 18% per annum for 2 years. Renu also invested the same sum in a compound interest scheme at the rate of 18% per annum for the same time period. If the interest amount received by Renu is Rs.259.2 more than the interest received by Vimal, then find the value of x?
Q5. Siva invested Rs.21600 each in a simple and compound interest scheme. If the difference between the interest received from simple interest and compound interest for 2 years at R% per annum is Rs.1350, then find the value of R.
Q6. A sum of ₹30000 is to be repaid in 2 equal annual installments with interest compounded annually at 10%. Find each installment.
Q7. The population of a town increases at the rate of 5% per annum. If the population today is 44100, find the population 2 years ago.
Q8. Find the compound amount on ₹8000 for 3 years, if the rate of interest is 5% for the first year, 6% for the second year, and 7% for the third year.
Q9. Ravi borrowed ₹5000 at 8% simple interest and lent it to Kiran at 10% compound interest. Find his gain in 2 years.
Q10. What annual payment will discharge a debt of Rs. 9270 due 3 years hence at the rate of 3% simple interest?
Q11. The simple interest on a sum of money is equal to the principal and the number of years is equal to the rate per cent per annum. Find the rate per cent.
Q12. Shudhir invested Rs. 16000 in a scheme which earned him simple interest @ 15% per annum. After two years he withdrew the principal amount plus interest and invested the entire amount in another scheme for two years, which earned him compound interest @ 12% per annum. What would be the total interest earned by Sudhir at the end of 4 years?

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getCombinationSimpleCompoundInterestPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return COMBINATION_SI_CI_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
