/**
 * Prompt to generate 'Direction Sense' puzzles.
 */
export const DIRECTION_SENSE_PROMPT = `
**Objective:** Generate a high-quality, exam-style 'Direction Sense' puzzle set with exactly \${numberOfQuestions} questions.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** All questions must be based on a single, shared \`commonContext\` describing the movements of a person or multiple people/points. The final output must be a single JSON object.
5.  **Clue Formatting:** Describe the movements as a continuous paragraph. **CRITICAL: DO NOT use numbered or lettered lists (e.g., avoid '(i)', '1.', 'A.').**
6.  **Setup Diagram:** You MAY generate a valid SVG diagram in \`commonContextDiagramSvg\` to illustrate the starting points of the puzzle. Style it for a dark theme.
7.  **Solution Diagram:** You MUST generate a valid SVG diagram in the \`explanationDiagramSvg\` showing the path and final positions. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Puzzle Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Describe the path of a single person.
    -   Use only cardinal directions (North, South, East, West) and 90-degree turns.
    -   Questions should be about the final direction or straight-line distance (without needing Pythagoras theorem).
-   **For 'Medium' difficulty (Default if not specified):**
    -   Describe the path of a single person or the relative positions of 3-4 points.
    -   Include turns that may require using the Pythagoras theorem to find the shortest distance.
    -   Include some intercardinal directions (North-East, South-West).
-   **For 'Hard' difficulty:**
    -   Describe the paths of two different people starting from different or the same points.
    -   Use complex language, including angles (e.g., "turns 45 degrees clockwise") and relative positions.
    -   Questions will require comparing the final positions of the two people.
-   **For 'Mixed' difficulty:**
    -   Randomly choose between Easy and Medium presets to generate the puzzle.

**Example to Model After (Medium Difficulty):**

- **Context:**
Point A is 10m to the North of Point B. Point C is 8m to the East of Point B. A person starts from Point C, walks 5m South, takes a left turn, and walks 8m to reach Point D.
- **Sample Questions:**
  - Q1. What is the shortest distance between Point A and Point C?
  - Q2. In which direction is Point D with respect to Point A?

**Your Task:**
Create a **new and unique** puzzle set based on the specified difficulty. The puzzle must be logically sound with one possible solution. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;