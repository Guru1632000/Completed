/**
 * Generates a prompt for Discount questions with detailed difficulty scaling and question types.
 * These questions test concepts like single/successive discounts, marked price, cost price, and profit/loss relationships.
 * Note: Each question is logically independent and does not share a context.
 */
const DISCOUNT_QUESTIONS_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Discount-related questions, adhering to the specified difficulty distribution and exam style for Bank Prelims and Mains. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on single discount calculations.
    -   Involve single-step problems to find Selling Price (SP), discount amount, or Marked Price (MP).
    -   Example: "An article is marked at ₹500 and sold at a discount of 10%. Find the selling price."
-   **For 'Moderate' difficulty:**
    -   Involve two-step problems.
    -   Introduce concepts like successive discounts, or finding the profit/loss after a discount is applied.
    -   Use simple story-based scenarios.
    -   Example: "A shopkeeper marks an article 20% above the cost price and offers a discount of 15%. If the cost price is ₹400, find the selling price."
-   **For 'Hard' difficulty:**
    -   Involve multi-concept, tricky scenarios similar to real bank mains exams.
    -   Use concepts like multi-item discount comparisons, small table/DI style data sets, complex successive discounts, or multi-item SP/CP/MP calculations.
    -   Example: "A trader buys three articles at the same cost price. He marks the first with 25% above CP, the second 30% above CP, and the third 20% above CP. He offers a discount of 10% on all. If the total selling price is ₹1,665, find the cost price of each item."
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- EASY ---
Q1. An article is marked at ₹500 and sold at a discount of 10%. Find the selling price. (Ans: ₹450)
Q2. A fan has a marked price of ₹1500 and is available for ₹1200. What is the discount percent? (Ans: 20%)

--- MODERATE ---
Q3. A shopkeeper offers two successive discounts of 10% and 20% on a television. If the marked price is ₹10000, what is the selling price? (Concept: Successive discounts) (Ans: ₹7200)
Q4. A trader marks his goods 20% above the cost price and then gives a discount of 10%. Find his profit percentage. (Concept: MP & Discount calculation) (Ans: 8%)

--- HARD ---
Q5. A shopkeeper allows a discount of 10% on the marked price of an item but charges a sales tax of 8% on the discounted price. If the customer pays ₹680.40 as the price including the sales tax, what is the marked price of the item? (Concept: Discount and Sales Tax) (Ans: ₹700)
Q6. A trader buys two articles for ₹1800. He sells one at a loss of 10% and the other at a profit of 12.5%. On the whole, he neither gains nor loses. Find the cost price of the article sold at a loss. (Concept: Multi-item discount & profit/loss) (Ans: ₹1000)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you can briefly mention the concept tested in the explanation.
`;

export const getDiscountQuestionsPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return DISCOUNT_QUESTIONS_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};