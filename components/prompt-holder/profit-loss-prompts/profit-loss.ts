/**
 * Generates a prompt for Profit and Loss questions with detailed difficulty scaling and question types.
 * These questions test concepts like basic profit/loss, discounts, marked price, false weights, etc.
 * Note: Each question is logically independent and does not share a context.
 */
const PROFIT_LOSS_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Profit and Loss questions, adhering to the specified difficulty distribution and exam style for Bank Prelims and Mains. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on basic formula-based, single-concept questions.
    -   Calculate Profit, Loss, Profit %, or Loss %.
    -   Example: "A shopkeeper buys a toy for ₹200 and sells it for ₹250. Find his profit percentage."
-   **For 'Medium' difficulty:**
    -   Involve two-step calculations.
    -   Introduce concepts like discount, marked price (MP), cost price (CP) / selling price (SP) relations, or a single successive profit/loss event.
    -   Example: "A trader marks an article 25% above cost price and allows a discount of 10%. Find the profit percentage."
-   **For 'Hard' difficulty:**
    -   Involve multi-concept problems with complex conditions.
    -   Use concepts like comparison between traders, use of false weights, complex marked price calculations, or successive discounts.
    -   Example: "A dealer buys two articles at the same price. He sells the first at a gain of 30% and the second at a loss of 20%. Find his overall profit or loss percentage."
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- EASY ---
Q1. A shopkeeper buys a toy for ₹200 and sells it for ₹250. Find his profit percentage. (Ans: 25%)
Q2. If the cost price of an article is ₹500 and the loss is 10%, find the selling price. (Ans: ₹450)
Q3. An item is sold for ₹720 at a profit of 20%. What is its cost price? (Ans: ₹600)
Q4. By selling a cycle for ₹2850, a shopkeeper gains 14%. At what price should he sell it to gain 20%? (Ans: ₹3000)
Q5. A man buys 10 articles for ₹8 and sells 8 articles for ₹10. Find his gain percent. (Ans: 56.25%)

--- MODERATE ---
Q6. A trader marks an article 25% above cost price and allows a discount of 10%. Find the profit percentage. (Concept: Marked price and discount relation) (Ans: 12.5%)
Q7. After allowing a discount of 12.5%, a trader makes a profit of 25%. If the cost price is ₹210, what is the marked price? (Concept: CP, SP, MP relation) (Ans: ₹300)
Q8. A shopkeeper sells his goods at cost price but uses a weight of 900 grams for a 1 kg weight. Find his real gain percentage. (Concept: False weight) (Ans: 11.11%)
Q9. If the selling price is doubled, the profit triples. Find the profit percent. (Concept: SP and Profit relation) (Ans: 100%)
Q10. A sells a horse to B for ₹4860, thereby losing 19%. B sells it to C at a price which would have given A 17% profit. Find B's gain. (Concept: Successive transactions) (Ans: ₹2160)

--- HARD ---
Q11. A dealer buys two articles at the same price. He sells the first at a gain of 30% and the second at a loss of 20%. Find his overall profit or loss percentage. (Concept: Successive gain/loss comparison) (Ans: 5% gain)
Q12. A dishonest dealer professes to sell his goods at cost price, but he uses a false weight and thus gains 6 18/47 %. For a kg, what weight does he use? (Concept: False weight calculation) (Ans: 940 grams)
Q13. A shopkeeper allows a discount of 10% on the marked price of an item but charges a sales tax of 8% on the discounted price. If the customer pays ₹680.40 as the price including the sales tax, what is the marked price of the item? (Concept: Discount and Sales Tax) (Ans: ₹700)
Q14. A manufacturer sells an article to a wholesale dealer at a profit of 10%. The wholesale dealer sells it to a shopkeeper at 20% profit. The shopkeeper sells it to a customer for ₹56,100 at a loss of 15%. Then the cost price of the article to the manufacturer is? (Concept: Multi-level successive transactions) (Ans: ₹50,000)
Q15. A man purchased two articles for ₹10000 each. On selling the first, he gained 20% and on selling the second, he lost 20%. Find his overall profit or loss. (Concept: Overall profit/loss on same CP) (Ans: No profit, no loss)


**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation.
`;

export const getProfitLossPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return PROFIT_LOSS_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
