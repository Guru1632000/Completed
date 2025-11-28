/**
 * Generates a comprehensive prompt for questions combining Profit & Loss, Marked Price, and Discount concepts.
 * This prompt is designed for generating a mixed-difficulty test for Bank Prelims and Mains exams.
 * Note: Each question is logically independent and does not share a context.
 */
const COMBINED_PL_MP_DISCOUNT_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct questions that combine concepts of Profit & Loss, Marked Price (MP), and Discount, tailored for Bank Prelims and Mains exams (IBPS, SBI, RRB). Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on single-step problems on either Profit/Loss, Marked Price, or Discount individually.
    -   Example: "A shopkeeper buys a book for ₹200 and sells it at a profit of 20%. Find the selling price." or "An article is marked at ₹500 and sold at a discount of 10%. Find the selling price."
-   **For 'Moderate' difficulty:**
    -   Involve two-step or multi-concept problems.
    -   Combine discount with profit/loss, explore the MP & CP relationship, or use successive discounts.
    -   Use simple multi-item calculations or story-based scenarios.
    -   Example: "A shopkeeper marks an article 25% above cost price and offers a discount of 12%. If the cost price is ₹400, find the selling price."
-   **For 'Hard' difficulty:**
    -   Involve multi-step, tricky scenarios similar to real bank mains exams.
    -   Use concepts like multi-item calculations, complex successive discounts, comparison between traders, false weights/defective items, or small Table/DI-style problems.
    -   Example: "A trader buys three articles at the same cost price. He marks the first at 20% above CP, the second at 25% above CP, and the third at 30% above CP. He offers a discount of 10% on each. If the total selling price is ₹1,485, find the cost price of each article."
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- EASY ---
Q1. A shopkeeper buys a book for ₹200 and sells it at a profit of 20%. Find the selling price. (Ans: ₹240)
Q2. An article is marked at ₹500 and sold at a discount of 10%. Find the selling price. (Ans: ₹450)

--- MODERATE ---
Q15. A shopkeeper marks an article 25% above cost price and offers a discount of 12%. If the cost price is ₹400, find the selling price. (Concept: MP & Discount calculation) (Ans: ₹440)
Q16. A trader buys two articles at the same cost price. He sells the first at 10% profit and the second at 5% loss. Find the overall profit or loss percentage. (Concept: Profit & Loss comparison) (Ans: 2.5% profit)

--- HARD ---
Q30. A trader buys three articles at the same cost price. He marks the first at 20% above CP, the second at 25% above CP, and the third at 30% above CP. He offers a discount of 10% on each. If the total selling price is ₹1,485, find the cost price of each article. (Concept: Multi-item Discount & MP calculation) (Ans: ₹500)
Q31. A dishonest dealer marks up his goods by 20% and gives a discount of 10%. Besides, he uses a 900 gm weight instead of a 1 kg weight. Find his net profit percent. (Concept: MP, Discount, and False Weight) (Ans: 20%)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getCombinedPlMpDiscountPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return COMBINED_PL_MP_DISCOUNT_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
