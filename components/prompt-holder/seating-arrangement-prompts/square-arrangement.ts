/**
 * Prompt to generate 'Square Arrangement' puzzles.
 */
export const SQUARE_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Square Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty square table with positions marked). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   8 people around a square table, all facing the center.
    -   Use mostly direct clues.
-   **For 'Medium' difficulty (Default if not specified):**
    -   8 people, with some facing center and some facing outward.
    -   Use a mix of direct and indirect clues, requiring deduction of facing direction for some individuals.
-   **For 'Hard' difficulty:**
    -   8 people, with facing directions unknown for all.
    -   Add a second variable (e.g., each person likes a different fruit).
    -   Clues must be highly indirect, linking positions, directions, and the variable.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Easy/Medium Difficulty):**

- **Context:**
Eight persons are sitting around a square table — four at the corners and four at the middle of each side. All face the center.
- **Clues:**
  - A sits at a corner and second to the left of D.
  - E sits at the middle of one side.
  - C is opposite to E.
  - G is to the immediate right of B.
- **Sample Questions:**
  - Q1. Who sits opposite to D?
  - Q2. Who sits at the corner positions?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;