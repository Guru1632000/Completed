/**
 * Prompt to generate 'Rectangular Arrangement' puzzles.
 */
export const RECTANGULAR_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Rectangular Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty rectangular table with positions marked). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   8 people around a rectangular table, all facing the center.
    -   Clues should be direct (e.g., "A sits at a corner", "B is opposite C").
-   **For 'Medium' difficulty (Default if not specified):**
    -   8 people around a rectangular table, with corners facing outward and middles facing inward.
    -   Use a mix of direct and indirect clues involving relative positions and facing directions.
-   **For 'Hard' difficulty:**
    -   10-12 people around a rectangular table.
    -   Mixed facing directions (some in, some out) that must be deduced.
    -   Add a second variable (e.g., each person is from a different country).
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Eight people — A, B, C, D, E, F, G, and H — are sitting around a rectangular table.
Four of them sit at the corners facing outward, and four sit at the middle of each side facing inward.
- **Clues:**
  - A sits at a corner.
  - The one who sits opposite A is H.
  - C is second to the left of A.
- **Sample Questions:**
  - Q1. Who sits opposite to E?
  - Q2. Which pair sits at the corners?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;