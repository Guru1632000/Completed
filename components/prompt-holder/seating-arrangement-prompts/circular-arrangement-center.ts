/**
 * Prompt to generate 'Circular Arrangement - Facing Center' puzzles.
 */
export const CIRCULAR_CENTER_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Circular Arrangement - Facing Center' puzzle set with exactly \${numberOfQuestions} questions.

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
    -   Use 6-7 individuals.
    -   Use mostly direct clues (e.g., "A sits next to B").
    -   Minimize indirect clues (e.g., "The number of people between A and B is the same as between C and D").
    -   Use at most one negative constraint (e.g., "C is not a neighbor of D").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 8 individuals.
    -   Use a mix of direct and indirect clues.
    -   Incorporate 2-3 negative or conditional clues.
    -   The complexity should match typical Bank/SSC prelims exams.
-   **For 'Hard' difficulty:**
    -   Use 8-9 individuals.
    -   Use predominantly indirect, multi-step deduction clues.
    -   Introduce a second variable (e.g., each person has a favorite color) and link clues to it.
    -   Use multiple negative and conditional constraints.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy, Medium, and Hard presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Eight persons — A, B, C, D, E, F, G, and H — are sitting around a circular table facing the center.
- **Clues:**
  - A sits second to the right of D.
  - B is to the immediate left of G.
  - F sits opposite to D.
  - E is not an immediate neighbor of F.
  - C is second to the left of A.
  - H sits between B and F.
- **Sample Questions:**
  - Q1. Who sits opposite to E?
  - Q2. Who sits between C and A?
  - Q3. How many persons sit between D and F (clockwise)?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;