/**
 * Prompt to generate 'Circular Arrangement - Facing Outward' puzzles.
 */
export const CIRCULAR_OUTWARD_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Circular Arrangement - Facing Outward' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty circular table with positions marked). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 6 individuals.
    -   Use mostly direct clues (remembering left/right are reversed).
    -   Minimize complex or multi-step deductions.
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 8 individuals.
    -   Use a mix of direct and indirect clues (e.g., "A sits third to the right of P").
    -   Incorporate some negative constraints.
-   **For 'Hard' difficulty:**
    -   Use 8 individuals with a second variable (e.g., each has a different car brand).
    -   Use predominantly indirect clues linking people and their variables.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Eight people — P, Q, R, S, T, U, V, and W — are sitting around a circular table facing outward.
- **Clues:**
  - R sits third to the right of P.
  - S is second to the left of W.
  - Q sits opposite to U.
  - T is to the immediate right of R.
  - V is not an immediate neighbor of S or T.
- **Sample Questions:**
  - Q1. Who sits opposite to T?
  - Q2. Who sits second to the right of Q?
  - Q3. Which pair sits opposite each other?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;