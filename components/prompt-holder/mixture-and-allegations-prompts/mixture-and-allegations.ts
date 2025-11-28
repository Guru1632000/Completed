/**
 * Generates a prompt for Mixture & Allegation questions with detailed difficulty scaling and a wide variety of question types.
 * These questions test concepts from basic mixtures to complex scenarios with replacement, profit/loss, and real-life applications.
 * Note: Each question is logically independent and does not share a context.
 */
const MIXTURE_ALLEGATION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantitative Aptitude MCQs for Bank Exams on the topic of Mixture & Allegation. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is correct. Distractors should be plausible results from common calculation errors.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a balanced mix of the following concepts:
1.  **Simple Mixture:** Mixing two or more ingredients with different prices/values to find the mean value.
2.  **Allegation Rule:** Finding the ratio in which two or more ingredients at a given price should be mixed to produce a mixture of a desired price.
3.  **Mixture with Profit/Loss:** Problems where the mixture is sold at a profit or loss, requiring calculation of the cost price of the mixture first.
4.  **Replacement Problems:** Scenarios where a part of the mixture is withdrawn and replaced by another liquid (e.g., water). This can be a single or repeated process.
5.  **Water & Milk Mixtures:** Classic problems involving finding the final ratio or percentage of milk/water after addition, removal, or replacement.
6.  **Real-Life Scenarios:** Practical applications involving chemicals, alloys, food ingredients, etc.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Focus on Simple Mixtures and direct Allegation Rule problems with two ingredients.
-   **For 'Moderate' difficulty:** Involve Mixtures with Profit/Loss, single Replacement problems, and simple Water & Milk scenarios.
-   **For 'Hard' difficulty:** Focus on repeated Replacement problems, complex multi-ingredient Allegation, and scenarios combining replacement with profit/loss.
-   **For 'Mixed' difficulty:** Generate a balanced mix of Easy, Moderate, and Hard patterns.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES ---
Q1. A vessel contains a mixture of milk and water in the ratio of 2:3. If 10 litres of mixture is removed and 10 litres of water is added to the vessel, the ratio of milk to water becomes 1:2. Find the initial quantity of mixture in the vessel.
Q2. The cost price of variety 1 rice is Rs.90 per kg and the cost price of variety 2 rice is Rs.120 per kg. A shopkeeper mixed both varieties of rice and the quantity of variety 1 rice is 50% more than that of variety 2 rice. Find the cost price of the mixture per kg?
Q3. A vessel contains 300 liters of a mixture of milk and water in the ratio of 2:1. If x liters of mixture is taken out and replaced by the same amount of water, then the ratio of water to milk becomes 8:7. Find the value of x?
Q4. A vessel contains 70 liters of a mixture of milk and water in the ratio of 3:7. When x liters of milk and 56 liters of water are added to the mixture, the ratio of milk to water becomes 3:5. Find the value of x.
Q5. 156 liters of a mixture contain milk and water, with(2.5M + 10) liters of water and (5M - 4) liters of milk. If 52 liters of the mixture are removed and a certain quantity of water is added, the final ratio of water to milk becomes 3:4. Find out how much water should be added.
Q6. A vessel contains a mixture of milk and water in which 20% is water and the remaining 24 liters are milk. If 15 liters of the mixture is taken out and x liters of water and (x – 3) liters of milk are added to the mixture, then the ratio of milk to water becomes 9:7. Find the value of x.
Q7. A vessel contains 540 liters mixture of milk and water and it contains 55(5/9)% of milk. If x liters of milk is added to the mixture, then the ratio of milk to water in the final mixture becomes 3:1, find the value of x?
Q8. Two vessels contain a mixture of milk and water. The vessel A contains 120 liters of mixture and the ratio of milk and water is 2:1 and the ratio of milk and water in vessel B is 3:2. If both vessel’s mixtures are mixed, then the ratio of milk and water becomes 7:4, then find the total quantity of mixture in vessel B?
Q9. A mixture contains oil and water in the ratio of 5:3. If 120 liters of mixture is taken out and 25 liters of oil and 5 liters of water is added in the remaining mixture, then the ratio of the quantity of oil to water becomes 2:1. Find the initial quantity of mixture.
Q10. A vessel contains a mixture of milk and water in the ratio of 2:1. If 10 liters of milk and 50 liters of water is added to the mixture, then the ratio of milk and water becomes 7:5. Find the initial quantity of the mixture in the vessel?
Q11. A vessel contains 50 liters mixture of milk and water in which 20% is water and x liters of water is added to the mixture, so the ratio of milk and water is 1:1. Now y liters of mixture is taken out and replaced by milk, so the ratio of milk and water is 4:3. Find the value of y?
Q12. Meena bought three varieties of wheat, she mixed 25 kg of wheat costing Rs.56 per kg, 10 kg of wheat costing Rs.x per kg and 45 kg of wheat costing Rs.48 per kg. If she makes a profit of 25% on selling the mixture for Rs.5450, then find the value of x?

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getMixtureAllegationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return MIXTURE_ALLEGATION_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
