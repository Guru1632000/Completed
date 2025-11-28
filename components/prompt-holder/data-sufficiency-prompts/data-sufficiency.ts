/**
 * Generates a prompt for Data Sufficiency questions, which have a very specific format.
 */
const DATA_SUFFICIENCY_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Data Sufficiency questions. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Format:** The \`questionText\` field **MUST** contain the main question, followed by "Statement I:" and "Statement II:".
- **Options:** All questions must have exactly \${optionsCount} options, using the following standard text:
    - A: The data in statement I alone are sufficient to answer the question, while the data in statement II alone are not sufficient to answer the question.
    - B: The data in statement II alone are sufficient to answer the question, while the data in statement I alone are not sufficient to answer the question.
    - C: The data either in statement I alone or in statement II alone are sufficient to answer the question.
    - D: The data given in both statements I and II together are not sufficient to answer the question.
    - E: The data in both statements I and II together are necessary to answer the question.

**Difficulty-Based Question Generation Rules:**
-   **For 'Easy'/'Medium' difficulty:** Use questions from topics like Ages, Percentages, or Simple Equations.
-   **For 'Hard' difficulty:** Use questions from topics like Geometry (Mensuration), Permutations, or complex multi-variable problems.

**Example Question to Model After:**

Question: What is the value of x?
Statement I: x + y = 5
Statement II: 2x - y = 4

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. The explanation for each question must be very clear:
1.  Analyze Statement I alone. Can you answer the question?
2.  Analyze Statement II alone. Can you answer the question?
3.  If needed, analyze both statements together. Can you answer the question?
4.  Conclude which option (A, B, C, D, or E) is correct based on the analysis.
`;

export const getDataSufficiencyPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return DATA_SUFFICIENCY_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};