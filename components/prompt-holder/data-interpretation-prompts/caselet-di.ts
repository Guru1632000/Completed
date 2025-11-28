/**
 * Prompt to generate 'Caselet (Paragraph) Data Interpretation' puzzles.
 */
export const CASELET_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Caselet Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects. This type is text-only.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction} (This should be High/Mains level).
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\`.

**Detailed Generation Steps:**
1.  **Create Caselet:** Write a text-based paragraph (a caselet) describing the sales of a company in four regions (North, South, East, West). The paragraph must contain embedded quantitative data, including given percentage changes between 2023 and 2024. The user must be able to deduce all necessary values from the text.
2.  **Populate \`commonContext\`:** Place the complete caselet paragraph into the \`commonContext\` field. This field MUST be identical for all \${numberOfQuestions} generated questions. Leave \`commonContextDiagramSvg\` as null.
3.  **Create Questions:** Generate \${numberOfQuestions} objective questions based on the caselet.
4.  **Provide Explanations:** For each question, provide clear, step-by-step solutions in the \`explanation\` field, showing how the data was extracted and calculated.
5.  **Set Subtype:** Set the \`questionSubtype\` field to "Caselet DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;