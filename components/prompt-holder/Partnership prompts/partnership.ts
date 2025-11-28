/**
 * Generates a prompt for Partnership questions with detailed difficulty scaling and a wide variety of question types.
 * These questions test concepts from basic partnerships to complex scenarios with changing investments, salaries, and interest.
 * Note: Each question is logically independent and does not share a context.
 */
const PARTNERSHIP_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantitative Aptitude questions on the topic of Partnership, adhering to the specified difficulty distribution and exam style for Bank Prelims and Mains (IBPS, SBI, RRB). Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Required Question Variety (CRITICAL):**
Your generated set of \${numberOfQuestions} questions MUST include a balanced mix of the following concepts:
1.  **Basic Partnership:** Partners investing for the same time period.
2.  **Different Time Periods:** Partners investing for different durations.
3.  **New/Retiring Partners:** Scenarios where partners join late or leave early.
4.  **Capital Changes:** Partners withdrawing or adding to their investment midway.
5.  **Profit/Loss Distribution:** Basic calculation of shares from total profit or loss.
6.  **Ratio-Based Problems:** Finding unknown investment, time, or profit based on given ratios.
7.  **Salaries, Commission, or Interest:** Scenarios where a portion of the profit is first distributed as salary, commission, or interest on capital before the rest is shared.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Focus on Basic Partnership (equal time) and simple Different Time Period problems.
-   **For 'Moderate' difficulty:** Involve New/Retiring Partners, simple Capital Changes, and basic Profit/Loss Distribution with ratios.
-   **For 'Hard' difficulty:** Focus on complex Capital Changes, Ratio-Based problems to find unknowns, and scenarios involving Salaries, Commission, or Interest on Capital.
-   **For 'Mixed' difficulty:** Generate a balanced mix of Easy, Moderate, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES ---
Q1. Two persons, A and B started a business with investments of Rs.1800 and Rs.4500 respectively. After 6 months, A left the business. Find the profit ratio of A to B after one year.
Q2. A started the business with an investment of Rs.18000, and after 4 months, B and C joined with the investment of Rs.16000 and Rs.20000 respectively. At the end of one year, the total profit of the business is Rs.31500. What is the profit share of B?
Q3. A started a business by investing Rs.1500 and after 6 months, B joined the business by investing Rs.X. If the ratio of the profit obtained by A to B at the end of one year is 5:3, then find the amount invested by B.
Q4. A and B together started a business, investing Rs. (x + 600) and Rs. (x + 1000) respectively. After 4 months, C joined the business with an investment of Rs. (x + 1600). If the total profit of A, B and C at the end of a year is Rs. 5280, then find the profit of B.
Q5. In a business, A invested Rs. 3000 for 'x' months. After 6 months, B joined the business with an amount equal to 40% of the amount initially invested by A. If the ratio of the annual profit received by A to B is 5:3, then find the value of 'x'.
Q6. Virat and Anushka together started a business with the initial investment of Rs.8000 and Rs.16000 respectively and the time period of investment for Virat and Anuhka in the ratio of 4:3. If the profit share of Virat is Rs.4000, then find the profit share of Anushka?
Q7. Anu and Priya started a business with a total investment of Rs.5000. After 8 months, Anu withdrew Rs.1000 and Priya invested Rs.1000 more. At the end of two years, the profit share of Anu is 12.5% less than that of Priya. Find the initial investment of Anu.
Q8. I, J and K entered into a business with investments of Rs.5000, Rs.10000 and Rs.20000 respectively. After x months, I doubled his investment. After y months from the start of the business, J increased his investment by 50%. At the end of one year, the profit share of I, J and K is 10:15:24 respectively. Find the value of (y-x).
Q9. A and B started a business with an investment in the ratio of 9:10 and the investment time period of A and B is 25 months and 12 months respectively. If the difference between the profit share of A and B is 1540, then find the total profit of the business?
Q10. A starts a business with an investment of Rs.80000. After 6 months B joins with a certain investment. At the end of one year, the profit share of B is Rs.21000 out of the total profit of Rs.49000. Find the investment of B.
Q11. A and B invest in a business. A gets a monthly salary of ₹500 and B gets 10% commission on profit. If total profit is ₹10000, and their investments are in the ratio 2:3, find each partner’s final share after salary and commission are paid from the profit.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getPartnershipPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return PARTNERSHIP_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
