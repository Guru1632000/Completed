/**
 * Generates a prompt for Marked Price (MP) questions with detailed difficulty scaling and question types.
 * These questions test concepts like discounts, cost price, selling price, and their relationships with profit & loss.
 * Note: Each question is logically independent and does not share a context.
 */
const MARKED_PRICE_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct questions focused on Marked Price (MP) and its relationship with Profit & Loss, tailored for Bank Prelims and Mains exams (IBPS, SBI, RRB). Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on basic MP, discount, profit/loss calculations.
    -   Involve single-step problems.
    -   Example: "An article with a marked price of ₹800 is sold at a 20% discount. Find the selling price."
-   **For 'Moderate' difficulty:**
    -   Involve two-step problems.
    -   Introduce concepts like successive discounts, or finding MP/CP/SP when one is given with profit/loss/discount percentages.
    -   Example: "An article is marked 25% above its cost price of ₹480 and sold at a discount of 10%. Find the selling price."
-   **For 'Hard' difficulty:**
    -   Involve multi-concept, tricky scenarios similar to real bank mains exams.
    -   Use concepts like successive discounts leading to a final price, comparison between traders, or finding the MP based on varying profit/loss conditions.
    -   Example: "A shopkeeper gives two successive discounts of 10% and 20% on a marked price of ₹5000. If he still makes a 8% profit, what was his cost price?"
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns.

**Example Questions to Model After (for structure, concepts, and language):**

--- EASY ---
Q1. A shirt is marked at ₹1200 and sold at a discount of 15%. What is the selling price? (Ans: ₹1020)
Q2. The cost price of an item is ₹500. To gain 20% after a 10% discount, what should be the marked price? (Ans: approx. ₹667)

--- MODERATE ---
Q3. An article is marked 40% above the cost price. If a discount of 25% is allowed, find the gain or loss percent. (Concept: Marked Price & Discount calculation) (Ans: 5% gain)
Q4. A trader offers two successive discounts of 10% and 5% on an article. If the marked price is ₹200, find the selling price. (Concept: Successive discounts) (Ans: ₹171)

--- HARD ---
Q5. A shopkeeper marks his goods 20% above the cost price and allows a discount of 10%. However, he uses a false weight of 900g instead of 1kg. Find his net profit percentage. (Concept: MP, Discount, and False Weight) (Ans: 20%)
Q6. A shopkeeper allows a discount of 10% on the marked price of an item but charges a sales tax of 8% on the discounted price. If the customer pays ₹680.40 as the price including the sales tax, what is the marked price of the item? (Concept: Discount and Sales Tax)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you can briefly mention the concept tested in the explanation.
`;

export const getMarkedPricePrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return MARKED_PRICE_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
