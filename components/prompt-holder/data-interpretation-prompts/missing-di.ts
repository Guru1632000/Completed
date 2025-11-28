/**
 * Prompt to generate 'Missing Data Interpretation' puzzles.
 */
export const MISSING_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Missing Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction} (This should be High level).
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\` and \`commonContextDiagramSvg\`.

**Detailed Generation Steps:**
1.  **Create Missing Data Table:** Design a data table showing income, expenditure, and profit % of 4 companies. Some of the values in the table MUST be missing (marked with '–' or left blank).
2.  **Generate SVG for Table:** Create a clean, readable SVG representation of this table, clearly showing the missing data cells. The SVG MUST be styled for a dark theme (light-colored text and borders, transparent background). This SVG is the primary visual.
3.  **Provide Relationships:** In the text part of the context, provide additional information or relationships (e.g., "The total expenditure of all companies is...", "The profit of company A is 20% of the expenditure of company B") that are necessary to find the missing values.
4.  **Populate Context Fields:**
    -   Place the description and the necessary relationships/clues into the \`commonContext\` field. **DO NOT include a markdown table here.**
    -   Place the complete SVG code for the table into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These two context fields MUST be identical for all \${numberOfQuestions} generated questions.
5.  **Create Questions:** Generate \${numberOfQuestions} questions that require the user to first find one or more missing values and then perform further calculations.
6.  **Provide Explanations:** For each question, provide a clear, step-by-step solution in the \`explanation\` field, detailing how the missing data was calculated first.
7.  **Set Subtype:** Set the \`questionSubtype\` field to "Missing DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;