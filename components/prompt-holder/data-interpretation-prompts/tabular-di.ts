/**
 * Prompt to generate 'Tabular Data Interpretation' puzzles.
 */
export const TABULAR_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Tabular Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\` and \`commonContextDiagramSvg\`.

**Detailed Generation Steps:**
1.  **Create Data Table:** First, design a data table about sales of 5 companies (A–E) over 3 years (2021–2023).
2.  **Generate SVG for Table:** Create a clean, readable SVG representation of this table. The SVG MUST be styled for a dark theme (light-colored text and borders, transparent background). This SVG is the primary visual for the user.
3.  **Populate Context Fields:**
    -   Place a title and a short description of the table into the \`commonContext\` field. **DO NOT include a markdown table here.**
    -   Place the complete SVG code for the table into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These two context fields MUST be identical for all \${numberOfQuestions} generated questions.
4.  **Create Questions:** Generate \${numberOfQuestions} questions based on the table. The questions must test a variety of calculations: total, average, ratio, and percentage change.
5.  **Provide Explanations:** For each question, provide a clear, step-by-step calculation in the \`explanation\` field.
6.  **Set Subtype:** Set the \`questionSubtype\` field to "Tabular DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;