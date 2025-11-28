/**
 * Prompt to generate 'Mixed Graph Data Interpretation' puzzles.
 */
export const MIXED_GRAPH_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Mixed Graph Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction} (This should be High/Mains level).
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\` and \`commonContextDiagramSvg\`.

**Detailed Generation Steps:**
1.  **Create Data & SVG:** Design a mixed graph set. Specifically, combine a bar graph showing the revenue of 4 companies over 3 years, and a line graph (on the same chart or a separate one) showing the profit percentage (%) for those companies in the same years. Generate a single, valid SVG representation of this combined visualization. The SVG MUST be styled for a dark theme (light-colored strokes, text, and axes; transparent background).
2.  **Populate Context Fields:**
    -   Place a title and a clear description of both graphs into the \`commonContext\` field.
    -   Place the complete SVG code into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These two fields MUST be identical for all \${numberOfQuestions} generated questions.
3.  **Create Questions:** Generate \${numberOfQuestions} questions that require combining data from both the bar graph (revenue) and the line graph (profit %) to answer. Questions should test ratio, average, % change, and difference.
4.  **Provide Explanations:** For each question, provide a clear, step-by-step calculation in the \`explanation\` field (e.g., Profit = Revenue * (Profit % / 100)).
5.  **Set Subtype:** Set the \`questionSubtype\` field to "Mixed Graph DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;