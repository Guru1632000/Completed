/**
 * Prompt to generate 'Blood Relations' puzzles.
 */
export const BLOOD_RELATIONS_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Blood Relations' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\` describing the family relationships. The final output must be a single JSON object.
5.  **Clue Formatting:** Describe the relationships as a continuous paragraph. **CRITICAL: DO NOT use numbered or lettered lists (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the individuals mentioned in the puzzle without showing the relationships yet. Style it for a dark theme.
7.  **Solution Diagram:** You MUST generate a valid SVG family tree in the \`explanationDiagramSvg\` for at least one of the questions, showing the final solved relationships. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use a small family of 5-6 members across 2 generations.
    -   Use direct clues (e.g., "A is the father of B", "C is the sister of D").
    -   Minimize complex relationships like in-laws.
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use a family of 7-8 members across 3 generations.
    -   Include a mix of direct and indirect clues (e.g., "The only son of A is married to C").
    -   Include relationships like brother-in-law, sister-in-law, grandparents.
-   **For 'Hard' difficulty:**
    -   Use a complex family of 8-9 members across 3 generations with multiple married couples.
    -   Use predominantly indirect clues and coded relationships (e.g., A*B means A is the mother of B).
    -   Include some members whose gender must be deduced.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
In a family of eight members, there are three generations and two married couples. A is the father of C. D is the son of C. F is the mother of H. H is the sister of D. B is the mother of C. E is the grandson of G.
- **Sample Questions:**
  - Q1. How is H related to A?
  - Q2. Who is the mother of D?
  - Q3. How many male members are in the family?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;