/**
 * Generates a prompt for Inequality reasoning questions with detailed difficulty scaling.
 * Note: Each inequality question is logically independent and does not share a context.
 */
const INEQUALITY_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Inequality reasoning questions. Each question MUST be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options, formatted as: (A) Only conclusion I follows, (B) Only conclusion II follows, (C) Either conclusion I or II follows, (D) Neither conclusion I nor II follows, (E) Both conclusions I and II follow.

**Difficulty-Based Question Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Use a single, continuous statement (e.g., "A > B = C < D").
    -   Use 2 conclusions that can be directly derived.
-   **For 'Medium' difficulty (Default if not specified):**
    -   Use 2-3 separate statements that need to be combined (e.g., "A > B; B = C; C < D").
    -   Use 2 conclusions.
-   **For 'Hard' difficulty:**
    -   Generate **Coded Inequality** questions.
    -   First, define a set of codes (e.g., "P @ Q means P is greater than Q").
    -   Then, provide statements using these codes.
    -   Provide 2 conclusions, also using the codes.
-   **For 'Mixed' difficulty:**
    -   Generate a mix of Easy and Medium difficulty questions. Avoid Hard/Coded for a smoother mixed experience.

**Content & Structure Guidelines (Follow Strictly):**
1.  **Strict Format:** The \`questionText\` field **MUST** be structured with clear "Statements:" and "Conclusions:" sections.
    - For Coded Inequality (Hard), the codes must be defined first.
    - List each statement and conclusion on a new line.
    - Example (Medium): "Statements:\\nA > B; B = C; C < D\\nConclusions:\\nI. A > C\\nII. D > B"
    - Example (Hard): "Directions: In the following questions, the symbols @, #, $, %, & are used with the following meaning:\\n'P @ Q' means 'P is greater than Q'.\\n'P # Q' means 'P is smaller than Q'.\\n'P $ Q' means 'P is equal to Q'.\\n'P % Q' means 'P is either greater than or equal to Q'.\\n'P & Q' means 'P is either smaller than or equal to Q'.\\nStatements:\\nA @ B; B % C; C # D\\nConclusions:\\nI. A @ D\\nII. C & A"

2.  **Explanation:** The explanation must clearly show how the statements are combined to prove or disprove each conclusion. For coded inequalities, first decode the statements.

**Example Questions to Model After:**

Q1. Statements: X = Y ≥ E > F > G > H > I, F < Z ≤ T
Conclusions: 
I. X < G
II. Z > Y

Q2. Statements: P < F ≤ T < V = Q, S ≥ U > T
Conclusions: 
I. F < S
II. T > P

Q3. Statements: Y ≥ L < T = Q > U, K ≤ C < L
Conclusions: 
I. Q > L
II. K < Y

Q4. Statements: R > K ≤ T < M, M ≤ J = Q > S
Conclusions: 
I. R > M
II. S > T

Q5. Statement: A ≥ T ≥ S = D ≥ Q
Conclusions: 
I. A > Q
II. Q = A

Q6. Statements: R = T ≥ V; P ≤ W ≤ R = S ≤ Y
Conclusions: 
I. W ≤ T
II. Y = R

Q7. Statements: P = N ≥ J > T, C = Z ≥ X > P < K > R
Conclusions: 
I. P > T
II. J < X

Q8. Statements: E > X < O = N ≥ F ≥ U < D = Q > V ≥ Y
Conclusions: 
I. U> X
II. E ≥ Q

Q9. Statements: T ≥ I > V= Z > K ≤ H > C < G, M ≥ E ≥ H
Conclusions: 
I. M > K
II. M = K

Q10. Statements: H > P > S ≥ I= F > X, V ≥ T > W = D ≥ H
Conclusions: 
I. I ≤ H
II. S < W

Q11. Statements: A > L ≥ C ≥ T, E = F > S, S = A
Conclusions: 
I. S > L
II. C > T

Q12. Statements: Y > T ≥ C ≥ D, E = U > G, G = Y
Conclusions: 
I. U > Y
II. T > U

Q13. Statements: K ≤ L > M, Y = O ≥ R, K > Q > Y
Conclusions: 
I. Y ≥ R
II. Y > R

Q14. Statements: F ≤ L > T, N = O ≥ P, F > Q > S
Conclusions: 
I. L > T
II. F > S

Q15. Statements: X > Y ≥ Z ≥ W, E = F > H, H = A
Conclusions: 
I. Y = W
II. Y > W


**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON.
`;

export const getInequalityPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return INEQUALITY_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};