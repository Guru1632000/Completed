/**
 * Prompt to generate 'Box / Stack Arrangement' puzzles.
 */
export const BOX_STACK_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Box / Stack Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty stack of numbered positions). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 5-6 boxes.
    -   Use direct clues (e.g., "Box A is immediately above Box D", "Two boxes are between F and E").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 7-8 boxes.
    -   Include a mix of direct and indirect clues (e.g., "The number of boxes above C is the same as the number of boxes below G").
    -   Include negative constraints (e.g., "Box B is not at the bottom").
-   **For 'Hard' difficulty:**
    -   Use 8 boxes and add a second variable (e.g., each box has a different color).
    -   Clues must be highly indirect, linking box positions and their colors.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Seven boxes — A, B, C, D, E, F, and G — are kept one above another (bottom-most position is 1, top-most is 7).
- **Clues:**
  - A is kept immediately above D.
  - Only two boxes are between F and E.
  - C is above E but not at the top.
  - B is above F but below C.
  - G is above C.
- **Sample Questions:**
  - Q1. Which box is at the top?
  - Q2. Which box is at the bottom?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;