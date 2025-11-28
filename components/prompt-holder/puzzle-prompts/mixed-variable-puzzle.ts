/**
 * Prompt to generate 'Mixed / Variable' puzzles.
 */
export const MIXED_VARIABLE_PUZZLE_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Mixed / Variable' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** List each clue on a new line, prefixed with a hyphen '-'. **CRITICAL: DO NOT use numbers or letters for the list (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the initial setup (e.g., an empty table grid for the variables). Style it for a dark theme.
7.  **Solution Diagram:** For at least one question in the set, you MUST generate a valid SVG diagram in \`explanationDiagramSvg\` showing the final solved arrangement. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 5 people with 2 variables (e.g., Profession + City).
    -   Clues should be fairly direct (e.g., "The Doctor is from Kolkata", "C is the Pilot and is from Mumbai").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 6-7 people with 2 variables.
    -   Introduce more negative and indirect clues (e.g., "The one from Delhi is not the Engineer").
-   **For 'Hard' difficulty:**
    -   Use 7-8 people with 3 variables (e.g., Profession + City + Favorite Color).
    -   Clues must be highly indirect, linking all three variables.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Easy/Medium Difficulty):**

- **Context:**
Five persons — A, B, C, D, and E — are from different cities (Delhi, Mumbai, Chennai, Kolkata, Pune) and have different professions (Doctor, Engineer, Teacher, Pilot, Lawyer).
- **Clues:**
  - The Doctor is from Kolkata.
  - A is not from Delhi or Chennai.
  - C is the Pilot and is from Mumbai.
  - The Lawyer is from Pune.
  - D is the Engineer and not from Delhi.
  - B is not the Teacher.
- **Sample Questions:**
  - Q1. Who is from Chennai?
  - Q2. What is A’s profession?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;