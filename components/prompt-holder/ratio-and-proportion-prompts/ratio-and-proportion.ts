/**
 * Generates a prompt for Ratio and Proportion questions with detailed difficulty scaling and a wide variety of question types.
 * These questions test concepts from basic ratios to complex scenarios involving distribution, age, mixtures, and advanced word problems.
 * Note: Each question is logically independent and does not share a context.
 */
const RATIO_PROPORTION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantitative Aptitude MCQs for Bank Exams on the topic of Ratio & Proportion. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is correct. Distractors should be plausible results from common calculation errors.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a balanced mix of the following concepts:
1.  **Basic Ratio & Simplification:** Direct ratio comparison, division of amounts, and simplifying fractional/decimal ratios.
2.  **Compound & Chain Ratios:** Finding compound ratios (ac:bd) and chain ratios (A:B, B:C → A:B:C).
3.  **Proportion:** Direct, inverse, and continued proportion problems (a:b = c:d).
4.  **Distribution & Sharing:** Dividing quantities (money, profit) based on given ratios.
5.  **Age/Salary/Population Ratio Problems:** Scenarios where ratios change over time or due to an increase/decrease.
6.  **Mixture & Ratio Combination:** Using ratios to solve mixture problems.
7.  **Advanced Word Problems:** Complex, multi-step reasoning and equation-based problems suitable for Bank PO Mains.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Focus on Basic Ratio, Simplification, and simple Distribution problems.
-   **For 'Moderate' difficulty:** Involve Compound/Chain Ratios, Proportion, and simple Age/Salary problems.
-   **For 'Hard' difficulty:** Focus on complex Inverse Proportion, multi-step Age/Salary problems, and Advanced Word Problems.
-   **For 'Mixed' difficulty:** Generate a balanced mix of Easy, Moderate, and Hard patterns.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES (BANK EXAM STANDARD) ---
Q1. The incomes of A and B are in the ratio 5:4 and their expenditures are in the ratio 3:2. If at the end of the year, each saves ₹1600, then the income of A is:
Q2. A bag contains 50p, 25p and 10p coins in the ratio 5:9:4, amounting to ₹206. Find the number of coins of each type.
Q3. The ratio of the present ages of Ram and Shyam is 3:4. Five years ago, the ratio of their ages was 5:7. Find their present ages.
Q4. The ratio of milk to water in a 60-litre mixture is 2:1. If this ratio is to be 1:2, then the quantity of water to be further added is:
Q5. A, B, and C start a business. A invests for 8 months, B for 10 months, and C for a year. If their investments are in the ratio 3:4:5 and the total profit is ₹14,200, find B's share.
Q6. Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:
Q7. The ratio of the number of boys to the number of girls in a school of 720 students is 7:5. How many more girls should be admitted to make the ratio 1:1?
Q8. In a mixture of 60 litres, the ratio of acid and water is 2:1. If the ratio of the acid and water is to be 1:2, then the amount of water to be added to the mixture is?
Q9. The salaries of A, B, and C are in the ratio 2:3:5. If the increments of 15%, 10%, and 20% are allowed respectively in their salaries, then what will be the new ratio of their salaries?
Q10. A sum of money is to be distributed among A, B, C, D in the proportion of 5:2:4:3. If C gets ₹1000 more than D, what is B's share?
Q11. The ratio of the number of male population in villages A and B is 10:9 and the ratio of the number of male to female population in A is 4:5. If the number of female population in B is 1100 more than the number of female population in A and the difference between the number of male population in A and B is 200, then find the number of female population in B?
Q12. A manager planned to give a bonus to 3 workers (P, Q and R). The total amount of bonus is Rs. 7500. 4 times of P’s bonus is equal to 5 times of Q’s bonus and 3 times of Q’s bonus is equal to 2 times of R’s bonus. Find the bonus got of Q?
Q13. 40% of the students in the class scored the mark in below 80 and the ratio of the number of students scored above 80 to exactly 80 marks in 3:4. If the number of students scored the marks exactly 80 is 12, then find the total number of students in the class?
Q14. Two numbers are in the ratio of 2 (2/3): 3 (½). If each of the number is increased by 5, then the ratio becomes 17: 22. Find the smallest number?
Q15. In a group of lions and doves, the number of legs is 30 more than twice the number of heads. How many lions are in the group?

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getRatioAndProportionPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return RATIO_PROPORTION_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
