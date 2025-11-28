/**
 * Prompt to generate 'Floor and Flat' puzzles.
 */
export const FLOOR_FLAT_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Floor and Flat' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., the empty building structure with floors and flats). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use a simple building structure, e.g., 6 people living on 6 different floors (one per floor).
    -   Use direct clues (e.g., "A lives on an even-numbered floor", "Two people live between A and B").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use a more complex structure, e.g., 8 people on 4 floors, with 2 flats (Flat X, Flat Y) on each floor.
    -   Include clues that relate floors, flats, and relative directions (e.g., "A lives to the west of B", "C lives on a floor immediately above D, but in a different flat type").
-   **For 'Hard' difficulty:**
    -   Use a complex structure (e.g., 8-10 people on 5 floors with 2 flats).
    -   Add a second variable (e.g., each person is from a different city).
    -   Clues must be highly indirect, linking floors, flats, people, and the second variable.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Eight persons — P, Q, R, S, T, U, V, and W — live in a building with four floors. The ground floor is numbered 1. Each floor has two flats: Flat A and Flat B. Flat A is to the west of Flat B.
- **Clues:**
  - P lives on an even-numbered floor.
  - There is one floor between P and R.
  - S lives immediately below R in the same flat type.
  - W lives to the east of U.
  - V lives on a floor above T.
- **Sample Questions:**
  - Q1. Who lives in Flat B on floor 3?
  - Q2. On which floor does V live?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;