/**
 * Prompt to generate 'Certain Number of People' seating arrangement puzzles.
 */
export const CERTAIN_NUMBER_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Certain Number of People' puzzle set with exactly \${numberOfQuestions} questions. The total number of people in the arrangement MUST NOT be stated and must be deduced from the clues.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Key Question:** At least one of the generated questions MUST ask for the total number of people in the arrangement.
7.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., a line with question marks representing unknown spots). Style it for a dark theme.
8.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use a **Linear Arrangement** with an unknown number of people (target total: 9-13).
    -   All people should face the same direction (e.g., North).
    -   Use mostly direct clues and at least one clue that helps determine the total count (e.g., "A sits at one of the ends", "The number of people to the right of X is...").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use a **Linear or Circular Arrangement** (randomly choose one).
    -   The total number of people should be between 14 and 18.
    -   Use a mix of direct and indirect clues. Clues that determine the total count should be less obvious (e.g., "There are as many people to the right of T as to the left of P.").
-   **For 'Hard' difficulty:**
    -   Use a **Linear or Circular Arrangement**.
    -   The total number of people should be between 17 and 22.
    -   Introduce a second variable (e.g., each person likes a different fruit) OR make it a double-row arrangement with an unknown number of people per row.
    -   Clues must be highly indirect and complex.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium - Linear):**

- **Context:**
A certain number of people are sitting in a single row facing north.
- **Clues:**
  - P sits fifth to the left of Q.
  - Only three people sit between Q and R.
  - S sits second to the right of R.
  - Only four people sit between P and T.
  - The number of people to the right of T is equal to the number of people to the left of P.
- **Sample Questions:**
  - Q1. How many people are there in the row?
  - Q2. Who sits exactly in the middle of the row?
  - Q3. If X sits immediately to the right of Q, what is his position from the right end?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution, and the total number of people must be determinable. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;