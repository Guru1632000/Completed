/**
 * Prompt to generate 'Radar/Spider Chart Data Interpretation' puzzles.
 */
export const RADAR_GRAPH_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Radar (Spider) Chart Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction} (This should be Advanced).
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\` and \`commonContextDiagramSvg\`.

**Detailed Generation Steps:**
1.  **Create Data & SVG:** Design a radar chart showing the performance of 5 employees on 5 skills (e.g., Communication, Technical, Speed, Accuracy, Teamwork), rated on a scale (e.g., 0-100). Generate a valid SVG representation of this chart. The SVG MUST be styled for a dark theme (light-colored strokes, text, and axes; transparent background) with a clear legend for each employee.
2.  **Populate Context Fields:**
    -   Place a title and a description of the chart into the \`commonContext\` field.
    -   Place the complete SVG code into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These two fields MUST be identical for all \${numberOfQuestions} generated questions.
3.  **Create Questions:** Generate \${numberOfQuestions} questions that require comparing values across skills for one employee, or between employees for a specific skill. Questions should involve calculations for averages or ratios.
4.  **Provide Explanations:** For each question, provide a clear, step-by-step calculation in the \`explanation\` field.
5.  **Set Subtype:** Set the \`questionSubtype\` field to "Radar Chart DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;