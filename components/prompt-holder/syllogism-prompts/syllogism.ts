/**
 * Generates a prompt specifically for Syllogism (Statement & Conclusion) questions with detailed difficulty scaling.
 * Note: Each syllogism question is logically independent and does not share a context.
 */
const SYLLOGISM_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Syllogism (Statement & Conclusion) questions. Each question MUST be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options, typically involving which conclusions follow (e.g., "Only I follows", "Both I and II follow", etc.).
- **Diagrams:** For each question, you MUST generate a valid SVG Venn diagram in \`explanationDiagramSvg\` to illustrate the logic. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Question Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 2 statements and 2 conclusions.
    -   Use simple universal quantifiers (All, No).
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 2-3 statements and 2 conclusions.
    -   Include particular quantifiers (Some, Some not).
    -   Introduce the possibility of 'Either/Or' cases in the options.
-   **For 'Hard' difficulty:**
    -   Use 3-4 statements and 2-3 conclusions.
    -   Introduce concepts like 'Only a few', 'Only'.
    -   The relationships should be complex, requiring careful diagramming.
-   **For 'Mixed' difficulty:**
    -   Generate a mix of Easy and Medium difficulty questions within the set.

**Content & Structure Guidelines (Follow Strictly):**
1.  **Strict Format:** The \`questionText\` field **MUST** be structured with clear "Statements:" and "Conclusions:" sections.
    - List each statement and conclusion on a new line.
    - Example: "Statements:\\nI. Some apples are bananas.\\nII. All bananas are dates.\\nConclusions:\\nI. Some apples are dates.\\nII. Some dates are bananas."

2.  **Plausible Options:** The options should cover all logical possibilities for the given conclusions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON.
`;

export const getSyllogismPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return SYLLOGISM_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};