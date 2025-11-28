/**
 * Prompt to generate 'Day-Based / Weekly Arrangement' puzzles.
 */
export const WEEKLY_ARRANGEMENT_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Day-Based / Weekly Arrangement' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty weekly calendar grid). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 7 people and 7 days of the week.
    -   Use direct clues (e.g., "A’s meeting is two days before C’s").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 7 people, 7 days, and add a second variable (e.g., they have meetings in different locations).
    -   Include a mix of direct and indirect clues.
-   **For 'Hard' difficulty:**
    -   Use 8 people and some other condition (e.g., two people have meetings on the same day but in different slots, Morning/Evening).
    -   Clues must be highly indirect.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Easy Difficulty):**

- **Context:**
Seven people — A, B, C, D, E, F, and G — have meetings on seven different days of the same week, starting from Monday to Sunday.
- **Clues:**
  - A’s meeting is two days before C’s.
  - D’s meeting is not on Monday.
  - B’s meeting is after E’s but before F’s.
  - G’s meeting is after C’s.
- **Sample Questions:**
  - Q1. Whose meeting is on Wednesday?
  - Q2. Who has the last meeting?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;