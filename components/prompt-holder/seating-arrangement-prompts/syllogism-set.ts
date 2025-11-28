/**
 * Prompt to generate a set of 'Syllogism' questions.
 * Note: Unlike other puzzles, each syllogism question is independent and does not share a context.
 */
export const SYLLOGISM_SET_PROMPT = `
**Objective:** Generate a set of \${numberOfQuestions} high-quality, exam-style 'Syllogism' questions. Each question MUST be logically independent.

**Core Instructions:**
1.  **Syllabus Context:** \${syllabusContextPrompt}
2.  **Difficulty:** \${difficultyInstruction}
3.  **Options:** Each question must have exactly \${optionsCount} options.
4.  **Format:** Generate \${numberOfQuestions} distinct questions. Do NOT use a \`commonContext\`. The final output must be a single JSON object.
5.  **Diagram:** For each question, you MUST generate a valid SVG Venn diagram in \`explanationDiagramSvg\` to illustrate the logic. Style it for a dark theme (light strokes/text, transparent background).

**Difficulty-Based Question Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use 2 statements and 2 conclusions.
    -   Use simple universal quantifiers (All, No).
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 2-3 statements and 2 conclusions.
    -   Include particular quantifiers (Some, Some not).
    -   Introduce the possibility of 'Either/Or' cases in the options.
-   **For 'Hard' difficulty:**
    -   Use 3-4 statements and 2-3 conclusions.
    -   Introduce concepts like 'Only a few', 'Only'.
    -   The relationships should be complex, requiring careful diagramming.
-   **For 'Mixed' difficulty:**
    -   Generate a mix of Easy and Medium difficulty questions within the set.

**Example to Model After (Medium Difficulty):**

- **Question Text:**
  "Statements:\\nI. Some apples are bananas.\\nII. All bananas are dates.\\nConclusions:\\nI. Some apples are dates.\\nII. Some dates are bananas."
- **Options:**
  - A: Only conclusion I follows
  - B: Only conclusion II follows
  - C: Both I and II follow
  - D: Neither I nor II follows
- **Explanation:**
  The Venn diagram shows that the circle for 'apples' and 'dates' must overlap because all 'bananas' are 'dates'. Thus, Conclusion I is true. Since all 'bananas' are 'dates', it is also true that 'some dates are bananas'. Thus, conclusion II is also true.

**Your Task:**
Create a **new and unique** set of \${numberOfQuestions} independent syllogism questions based on the specified difficulty. Each question must be logically sound. The final output must be a single JSON object with a "questions" array.
`;
