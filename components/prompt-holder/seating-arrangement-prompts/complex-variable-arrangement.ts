/**
 * Prompt to generate 'Complex / Variable Arrangement' puzzles.
 */
export const COMPLEX_VARIABLE_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Complex / Variable Arrangement' puzzle set with exactly \${numberOfQuestions} questions. This involves a primary arrangement (e.g., circular, linear) combined with one or more additional variables (e.g., profession, city, favorite color).

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty arrangement shape). Style it for a dark theme.
7.  **Solution Diagram/Table:** For at least one question in the set, you MUST generate a valid SVG diagram or a table in the \`explanationDiagramSvg\` showing the final solved arrangement of all variables. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use a simple base arrangement (e.g., 6-7 people in a line facing North).
    -   Use ONE additional variable (e.g., they are from different cities).
    -   Clues should be mostly direct, linking a person to their variable or position.
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use a standard base arrangement (e.g., 8 people around a circular table).
    -   Use TWO additional variables (e.g., they work in different departments and have different hobbies).
    -   Include a mix of direct, indirect, and negative clues.
-   **For 'Hard' difficulty:**
    -   Use a complex base arrangement (e.g., 8 people in a square with mixed facing directions).
    -   Use TWO or THREE additional variables.
    -   Clues must be highly indirect, requiring multi-step deductions to link all variables together.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Eight friends — P, Q, R, S, T, U, V, and W — are sitting around a circular table facing the center. They work in different banks — SBI, UBI, PNB, and BOB, but not necessarily in the same order. Exactly two people work in each bank.
- **Clues:**
  - P works in PNB and sits third to the right of V.
  - The persons working in SBI are immediate neighbors.
  - S and U work in the same bank.
  - Q sits opposite to the one who works in UBI.
  - R, who works in BOB, is not an immediate neighbor of P.
- **Sample Questions:**
  - Q1. Who works in SBI?
  - Q2. Who sits second to the left of P?
  - Q3. Which of the following statements is true?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;