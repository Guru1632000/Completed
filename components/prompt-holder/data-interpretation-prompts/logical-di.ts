/**
 * Prompt to generate 'Logical / Reasoning-based Data Interpretation' puzzles.
 */
export const LOGICAL_DI_PROMPT = `
**Objective:** Generate a Bank Exam-style Logical/Reasoning-based Data Interpretation (DI) question set. The output must be a single valid JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction} (This should be Mains level).
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** All questions must be based on a single, shared \`commonContext\`.

**Detailed Generation Steps:**
1.  **Create Logical Scenario:** Design a scenario that combines data with logical rules. For example, a table or descriptive chart showing 6 employees with data like department, target, achievement %, and some rules for calculating their bonus. The key is that not all information is directly given; some must be deduced.
2.  **Generate SVG (If Applicable):** If you use a table or chart in the scenario, you **MUST** create a clean, readable SVG representation of it. The SVG must be styled for a dark theme. If the scenario is purely text-based, this field should be null.
3.  **Populate Context Fields:**
    -   Place the description of the scenario and the rules into the \`commonContext\` field. **DO NOT include a markdown table here.**
    -   If an SVG was created, place its complete code into the \`commonContextDiagramSvg\` field.
    -   **CRITICAL:** These context fields MUST be identical for all \${numberOfQuestions} generated questions.
4.  **Create Questions:** Generate \${numberOfQuestions} logical DI questions that involve ranking, applying the rules, and reasoning rather than just straightforward calculation.
5.  **Provide Explanations:** For each question, provide a clear, step-by-step logical deduction in the \`explanation\` field, showing how the answer was reached by applying the given rules.
6.  **Set Subtype:** Set the \`questionSubtype\` field to "Logical DI" for all questions.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object. Do not include any text, explanations, or markdown fences before or after the JSON.
`;