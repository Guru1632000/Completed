/**
 * Generates a prompt for Simple Interest (SI) questions with detailed difficulty scaling and question types.
 * These questions test concepts like finding SI, Principal (P), Rate (R), Time (T), amount, comparisons, and installments.
 * Note: Each question is logically independent and does not share a context.
 */
const SIMPLE_INTEREST_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Simple Interest (SI) questions, adhering to the specified difficulty distribution and exam style for Bank Prelims. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on direct formula-based questions.
    -   Calculate SI or Amount when P, R, and T are given.
    -   Example: "Find the simple interest on ₹5,000 at 10% per annum for 2 years."
-   **For 'Moderate' difficulty:**
    -   Involve finding one missing variable when others are given (e.g., find Rate or Time).
    -   Use simple story-based scenarios or two-step calculations.
    -   Example: "A person lends ₹6,000 at simple interest. If the SI for 3 years is ₹900, find the rate of interest per annum."
-   **For 'Hard' difficulty:**
    -   Involve multi-concept problems with complex conditions.
    -   Use concepts like comparison over different amounts/periods, multi-person transactions, installment calculations, or combined SI/CI scenarios.
    -   Example: "A lends ₹10,000 to B at 8% SI per annum for 3 years. At the same time, B lends ₹15,000 to C at 10% SI per annum for 2 years. Find the difference between the interest received by B and the interest payable by B."
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- EASY ---
Q1. The sum of money that will give Re 1 as interest per day at 5% per annum simple interest is: (Ans: Rs.7300)
Q2. A borrowed Rs. 5000 from B at simple interest. After 4 years, B received Rs. 1000 more than the amount given to A on loan. The rate of interest was: (Ans: 5%)

--- MODERATE ---
Q3. The simple interest on a sum of money is equal to the principal and the number of years is equal to the rate per cent per annum. Find the rate per cent. (Concept: SI = P relation) (Ans: 10%)
Q4. A man deposits Rs. 4000 in a bank at 15% per annum and Rs. 6000 in another bank at 16% per annum. Find the rate of interest for the whole sum. (Concept: Average Rate) (Ans: 15.6%)
Q5. Rs. 1,200 amounts to Rs. 1,632 in 4 years at a certain rate of simple interest. If the rate of interest is increased by 1%, it would amount to how much? (Concept: Rate change effect) (Ans: Rs. 1680)
Q6. Sudarshan has Rs. 1500, part of which he lent at 3 per cent and the rest at 2 per cent. The whole annual interest was Rs. 32. How much did he lend at 2 per cent? (Concept: Multi-part investment) (Ans: Rs. 1300)
Q7. On Rs. 3000 invested at a simple interest at rate of 6 per cent per annum, Rs. 900 is obtained as interest in certain years. In order to earn Rs. 1600 as interest on Rs. 4000 in the same number of years, what should be the rate of simple interest? (Concept: Proportional SI) (Ans: 8%)
Q8. A certain sum is invested for certain time. It amounts to Rs. 400 at 10% per annum. But when invested at 4% per annum, it amounts to Rs. 200. Find the time. (Concept: Simultaneous equations) (Ans: 50 years)
Q9. Out of a certain sum, 1/3rd is invested at 3%, 1/6th at 6% and the rest at 8%. If the simple interest for 2 years from all these investments amounts to Rs. 600, find the original sum. (Concept: Fractional investment) (Ans: Rs. 5000)

--- HARD ---
Q10. What annual payment will discharge a debt of Rs. 9270 due 3 years hence at the rate of 3% simple interest? (Concept: Installments) (Ans: Rs. 3000)
Q11. Shudhir invested Rs. 16000 in a scheme which earned him simple interest @ 15% per annum. After two years he withdrew the principal amount plus interest and invested the entire amount in another scheme for two years, which earned him compound interest @ 12% per annum. What would be the total interest earned by Sudhir at the end of 4 years? (Concept: SI followed by CI) (Ans: Rs. 9792)
Q12. A certain sum of money amounted to Rs. 1020 at 9% in a time in which Rs. 720 amounted to Rs. 880 at 4%. If the rate of interest is simple, find the sum. (Concept: Linked time period) (Ans: Rs. 680)
Q13. Rs. 7930 is so divided into three parts such that their amounts after 2, 3 and 4 years respectively are equal, the simple interest being at the rate of 5% per annum. Find the difference between the greatest and the smallest parts of the sum. (Concept: Equal amounts) (Ans: Rs. 230)
Q14. The amount of a certain sum with simple interest for 20 years is Rs. 586.40 and with simple interest for 10 years more is Rs. 696.35. Find the rate per cent per annum at which interest is reckoned. (Concept: Long-term amount difference) (Ans: 3%)
Q15. Rakesh borrows Rs. 3500 from a bank at SI. After three years he paid Rs. 1500 to the bank and at the end of 5 years from the date of borrowing he paid Rs. 2725 to the bank to settle the account. Find the rate of interest. (Concept: Partial repayment) (Ans: 5%)


**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getSimpleInterestPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return SIMPLE_INTEREST_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};