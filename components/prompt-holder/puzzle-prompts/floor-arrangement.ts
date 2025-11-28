/**
 * Prompt to generate 'Floor / Building Arrangement' puzzles.
 */
export const FLOOR_ARRANGEMENT_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Floor / Building Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty building with numbered floors). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 6-7 people on 6-7 different floors.
    -   Use direct clues (e.g., "A lives on an even-numbered floor", "Two people live between A and B").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 8 people on 8 floors.
    -   Include a mix of direct and indirect clues (e.g., "The number of people living above C is one more than the number of people living below G").
    -   Include negative constraints (e.g., "B does not live on the bottom floor").
-   **For 'Hard' difficulty:**
    -   Use 8 people on 8 floors and add a second variable (e.g., each person is from a different city).
    -   Clues must be highly indirect, linking floors, people, and their cities.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Easy Difficulty):**

- **Context:**
Seven persons — A, B, C, D, E, F, and G — live in a seven-floor building, where the ground floor is numbered 1 and the top floor is numbered 7.
- **Clues:**
  - A lives on an even-numbered floor.
  - C lives two floors above B.
  - D lives just below E.
  - F lives above A but not on the top floor.
  - G does not live on floor 1 or 7.
- **Sample Questions:**
  - Q1. Who lives on the top floor?
  - Q2. How many floors are between C and D?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;