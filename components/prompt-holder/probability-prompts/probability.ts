/**
 * Generates a prompt for Probability questions.
 * Note: Each question is logically independent.
 */
const PROBABILITY_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Probability questions. Each question must be a logically independent word problem.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options, which should be fractions or decimals.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a mix of questions involving:
1.  **Coins:** Tossing one, two, or three coins.
2.  **Dice:** Rolling one or two dice.
3.  **Playing Cards:** Drawing cards from a standard 52-card deck.
4.  **Balls in a Bag:** Drawing one or more balls from a bag containing different colored balls (with/without replacement).
5.  **Events:** Problems involving mutually exclusive or independent events.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Single event probability (e.g., rolling one die, drawing one ball).
-   **For 'Moderate' difficulty:** Problems involving two events (e.g., tossing two coins, drawing two cards without replacement), using addition or multiplication rules of probability.
-   **For 'Hard' difficulty:** Complex problems involving conditional probability or questions requiring the use of combinations (e.g., probability of drawing 2 red and 1 blue ball).
-   **For 'Mixed' difficulty:** A balanced mix of all types.

**Example Questions to Model After:**

Q1. Two unbiased coins are tossed. What is the probability of getting at most one head? (Ans: 3/4)
Q2. A card is drawn from a pack of 52 cards. What is the probability of getting a queen of clubs or a king of hearts? (Ans: 1/26)
Q3. A bag contains 4 white, 5 red and 6 blue balls. Three balls are drawn at random from the bag. What is the probability that all of them are red? (Ans: 2/91)
Q4. In a class, there are 15 boys and 10 girls. Three students are selected at random. What is the probability that 1 girl and 2 boys are selected? (Ans: 21/46)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly define the total number of outcomes and the number of favorable outcomes, then calculate the probability.
`;

export const getProbabilityPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return PROBABILITY_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
