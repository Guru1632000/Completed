/**
 * Prompt to generate 'Scheduling / Month-Day' puzzles.
 */
export const SCHEDULING_MONTH_DAY_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Scheduling / Month-Day' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty calendar grid for the months). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 6 people and 6 months.
    -   Use direct clues (e.g., "P's exam is in a month immediately before R's").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 7 people and 7 months (some with 30 days, some with 31).
    -   Include clues related to the number of days in the month (e.g., "A's exam is in a month with 30 days").
-   **For 'Hard' difficulty:**
    -   Use 8 people, 8 months, and a second variable (e.g., each person has an exam in a different city).
    -   Clues must be indirect and link people, months, and cities.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Easy Difficulty):**

- **Context:**
Six persons — P, Q, R, S, T, and U — have exams in different months of the same year (Jan, Feb, Mar, Apr, May, Jun).
- **Clues:**
  - P’s exam is in a month immediately before R’s.
  - Q’s exam is not in March or June.
  - S’s exam is after T’s.
  - U’s exam is between P and R.
- **Sample Questions:**
  - Q1. Who has the first exam?
  - Q2. Who appears immediately before U?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;