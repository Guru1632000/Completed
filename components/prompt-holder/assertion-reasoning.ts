/**
 * Generates a prompt specifically for Assertion & Reasoning questions.
 */
export const getAssertionReasoningPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => `
Generate ${numberOfQuestions} distinct Assertion & Reasoning questions.

**Core Instructions:**
- **Syllabus Context:** ${syllabusContextPrompt}
- **Difficulty:** ${difficultyInstruction}

**Content & Structure Guidelines (Follow Strictly):**

1.  **Strict Format:**
    - The \`questionText\` field **MUST** contain both "Assertion (A): [Text of assertion]" and "Reason (R): [Text of reason]", separated by a newline.
    - The \`questionType\` field **MUST** be set to "AssertionReasoning".

2.  **Standard Options:** The \`options\` object **MUST** use the following standard text for keys A, B, C, and D:
    - **A:** "Both A and R are true and R is the correct explanation of A."
    - **B:** "Both A and R are true but R is not the correct explanation of A."
    - **C:** "A is true but R is false."
    - **D:** "A is false but R is true."

3.  **Logical Relationship:** The assertion and reason must have a clear logical relationship (or lack thereof) that can be evaluated.

4.  **Comprehensive Explanations:** The explanation must clearly state the validity of both the Assertion and the Reason independently, and then evaluate whether the Reason correctly explains the Assertion.

**EXAMPLE STRUCTURE:**
Your final JSON output must be a single JSON object.
\`\`\`json
{
  "questions": [
    {
      "questionText": "Assertion (A): We prefer to wear white clothes in summer.\\nReason (R): White surfaces are good reflectors of heat.",
      "options": {
        "A": "Both A and R are true and R is the correct explanation of A.",
        "B": "Both A and R are true but R is not the correct explanation of A.",
        "C": "A is true but R is false.",
        "D": "A is false but R is true."
      },
      "correctOption": "A",
      "explanation": "Assertion (A) is true; light-colored clothes are preferred in summer. Reason (R) is also true; white surfaces reflect most of the heat that falls on them. Because white clothes reflect heat and keep us cool, R is the correct explanation for A.",
      "isPYQ": false,
      "questionSubtype": "General Science - Physics",
      "questionType": "AssertionReasoning",
      "section": "General Studies"
    }
  ]
}
\`\`\`

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON.
`;