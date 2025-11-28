/**
 * Prompt to generate 'Double Row Arrangement' puzzles.
 */
export const DOUBLE_ROW_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Double Row Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., two parallel rows of empty seats). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Two rows of 4 people each.
    -   Use direct clues (e.g., "A faces P", "B is at the end of the row").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Two rows of 4-5 people each.
    -   Use a mix of direct and indirect clues (e.g., "The one who faces A sits second to the left of R").
-   **For 'Hard' difficulty:**
    -   Two rows of 5 people each.
    -   Add a second variable for one or both rows (e.g., people in Row 1 are from different cities).
    -   Clues must be complex and link positions and variables.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Eight people are sitting in two parallel rows containing four people each.
In Row 1 (facing South): A, B, C, D.
In Row 2 (facing North): P, Q, R, S.
Each person in Row 1 faces a person in Row 2.
- **Clues:**
  - A faces Q.
  - R sits to the right of S.
  - B does not face R.
  - C is to the left of D.
- **Sample Questions:**
  - Q1. Who faces D?
  - Q2. Who sits second to the left of R?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;