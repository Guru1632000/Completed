/**
 * Prompt to generate 'Linear Arrangement' puzzles.
 */
export const LINEAR_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Linear Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., a row of empty seats). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   A single row of 6-7 people, all facing the same direction.
    -   Use mostly direct clues about position and neighbors.
-   **For 'Medium' difficulty (Default if not specified):**
    -   A single row of 8 people, all facing the same direction.
    -   Mix of direct and indirect clues (e.g., "Three people sit between A and B").
    -   Include negative constraints.
-   **For 'Hard' difficulty:**
    -   A single row of 8 people, with some facing North and some facing South.
    -   Clues must be complex, referring to 'left' and 'right' relative to the person's facing direction.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Seven friends — A, B, C, D, E, F, and G — are sitting in a straight line facing north.
- **Clues:**
  - A sits second to the right of D.
  - C is at one of the extreme ends.
  - E sits third to the left of A.
  - F is not an immediate neighbor of D.
- **Sample Questions:**
  - Q1. Who sits at the extreme right end?
  - Q2. Who sits exactly in the middle?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;