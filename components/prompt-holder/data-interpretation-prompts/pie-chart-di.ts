/**
 * Prompt to generate 'Pie Chart Data Interpretation' puzzles.
 */
export const PIE_CHART_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Pie Chart Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\` and \`commonContextDiagramSvg\`.

**Detailed Generation Steps:**
1.  **Create Data & SVG:** First, design a pie chart showing the percentage distribution of a company's total expenses across five departments (HR, Sales, Marketing, IT, R&D). Generate a valid SVG representation of this chart. The SVG MUST be styled for a dark theme (light-colored text, varied slice colors, transparent background). Include a clear legend.
2.  **Populate Context Fields:**
    -   Place a title, a short description, and the **total value** represented by the pie chart (e.g., "Total Expenses: ₹50 Lakhs") into the \`commonContext\` field.
    -   Place the complete SVG code into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These two fields MUST be identical for all \${numberOfQuestions} generated questions.
3.  **Create Questions:** Generate \${numberOfQuestions} questions based on the chart. The questions must test conversion of percentages to absolute values, ratios between departments, and comparisons.
4.  **Provide Explanations:** For each question, provide a clear, step-by-step calculation in the \`explanation\` field.
5.  **Set Subtype:** Set the \`questionSubtype\` field to "Pie Chart DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;