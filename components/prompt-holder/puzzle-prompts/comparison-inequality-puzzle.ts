/**
 * Prompt to generate 'Comparison / Inequality' puzzles.
 */
export const COMPARISON_INEQUALITY_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Comparison / Inequality' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., a set of empty slots with > or < symbols). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Compare a single parameter for 5-6 people (e.g., height).
    -   Use direct comparison clues (e.g., "M is taller than Q but shorter than O").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Compare a single parameter for 7-8 people.
    -   Introduce numeric values if possible (e.g., "The second tallest person is 180cm").
    -   Clues can be more indirect.
-   **For 'Hard' difficulty:**
    -   Compare two parameters for 6 people (e.g., height and weight).
    -   Clues must link both parameters (e.g., "The tallest person is not the heaviest").
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Easy Difficulty):**

- **Context:**
Five persons — M, N, O, P, Q — have different heights.
- **Clues:**
  - M is taller than Q but shorter than O.
  - P is shorter than M but taller than N.
  - O is not the tallest.
- **Sample Questions:**
  - Q1. Who is the tallest?
  - Q2. Who is shorter than P but taller than N? (Note: this is a trick question based on the clues)

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;