/**
 * Prompt to generate 'Line Graph Data Interpretation' puzzles.
 */
export const LINE_GRAPH_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Line Graph Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\` and \`commonContextDiagramSvg\`.

**Detailed Generation Steps:**
1.  **Create Data & SVG:** First, design a double line graph showing the monthly income of Person A and Person B from January to June. Generate a valid SVG representation of this graph. The SVG MUST be styled for a dark theme (light-colored strokes, text, and axes; transparent background).
2.  **Populate Context Fields:**
    -   Place a title and a short description of the graph into the \`commonContext\` field.
    -   Place the complete SVG code into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These two fields MUST be identical for all \${numberOfQuestions} generated questions.
3.  **Create Questions:** Generate \${numberOfQuestions} questions based on the graph. The questions must test percentage increase, average income, and comparisons between the two people.
4.  **Provide Explanations:** For each question, provide a clear, step-by-step calculation in the \`explanation\` field.
5.  **Set Subtype:** Set the \`questionSubtype\` field to "Line Graph DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;