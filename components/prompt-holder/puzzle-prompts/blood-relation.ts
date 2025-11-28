/**
 * Prompt to generate 'Blood Relation' puzzles.
 */
export const BLOOD_RELATION_PUZZLE_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Blood Relation' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\`. The final output must be a single JSON object.
5.  **Clue Formatting:** Describe the relationships as a continuous paragraph or a list of clues.
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the individuals mentioned in the puzzle without showing the relationships yet. Style it for a dark theme.
7.  **Solution Diagram:** You MUST generate a valid SVG family tree in the \`explanationDiagramSvg\` for at least one of the questions, showing the final solved relationships. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use a simple family of 5-6 members across 2 generations.
    -   Use direct clues (e.g., "A is the father of B", "Pointing to a man, Rina said, 'He is the son of my grandfather’s only daughter.'").
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use a family of 7-8 members across 3 generations.
    -   Include a mix of direct and indirect clues and relationships like brother-in-law, sister-in-law, niece, uncle.
-   **For 'Hard' difficulty:**
    -   Use a complex family of 8-9 members with multiple married couples.
    -   Use predominantly indirect clues and possibly coded relationships.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
In a family of eight members — A, B, C, D, E, F, G, H — there are three married couples. A is the brother-in-law of B. C is the niece of B. D is the father of E. F is the mother of G. H is the grandmother of C. E is the son of A.
- **Sample Questions:**
  - Q1. How is C related to E?
  - Q2. Who is the wife of D?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;