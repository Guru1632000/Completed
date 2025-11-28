/**
 * Generates a highly specific and strict prompt for Reading Comprehension passages.
 */
export const getReadingComprehensionPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => `
**CRITICAL GOAL: You MUST generate exactly ${numberOfQuestions} question objects in the final JSON array.**

**CONTEXT: This is a Reading Comprehension test. You must create a single, shared passage and then create all ${numberOfQuestions} questions based *only* on that single passage.**

**MANDATORY RULES (Non-negotiable):**
1.  **Single Shared Passage:** Create ONE \`commonContext\` containing the full reading passage.
2.  **Identical Passage for All Questions:** Every single one of the ${numberOfQuestions} question objects you generate **MUST** have the exact same string value in its \`commonContext\` field.
3.  **Generate Full Quantity:** You **MUST** generate all ${numberOfQuestions} questions. Do not stop after one.
4.  **Separate Question Text:** The \`questionText\` for each question must be unique and ask a different question about the shared passage. The question types should be varied (e.g., main idea, inference, detail-oriented, vocabulary-in-context).

**Syllabus & Difficulty:**
- **Syllabus:** ${syllabusContextPrompt}
- **Difficulty:** ${difficultyInstruction}
- **Options:** Each question must have exactly ${optionsCount} options.

**DETAILED FIELD INSTRUCTIONS:**
-   \`commonContext\`: Write the full reading passage here.
-   \`questionText\`: A specific, unique question about the passage.
-   \`explanation\`: A detailed explanation that quotes or refers to specific parts of the passage to justify the correct answer and explain why other options are incorrect.

**EXAMPLE STRUCTURE for a request of 2 questions:**
Your final JSON output must be a single JSON object.
\`\`\`json
{
  "questions": [
    {
      "commonContext": "The Green Revolution in India was a period when agriculture in India was converted into an industrial system due to the adoption of modern methods and technology... It was a great success in terms of agricultural productivity. However, it had its drawbacks, such as increased use of pesticides and fertilizers which led to environmental damage and a loss of traditional farming knowledge.",
      "questionText": "What was the primary success of the Green Revolution mentioned in the passage?",
      "options": { "A": "Preservation of traditional farming", "B": "Reduction in pesticide use", "C": "Increase in agricultural output", "D": "Improvement in environmental conditions" },
      "correctOption": "C",
      "explanation": "The passage explicitly states, 'It was a great success in terms of agricultural productivity,' which directly corresponds to an increase in agricultural output.",
      "isPYQ": false,
      "questionSubtype": "Reading Comprehension",
      "questionType": "MCQ",
      "section": "General English"
    },
    {
      "commonContext": "The Green Revolution in India was a period when agriculture in India was converted into an industrial system due to the adoption of modern methods and technology... It was a great success in terms of agricultural productivity. However, it had its drawbacks, such as increased use of pesticides and fertilizers which led to environmental damage and a loss of traditional farming knowledge.",
      "questionText": "According to the passage, what was a negative consequence of the Green Revolution?",
      "options": { "A": "Decreased farmer income", "B": "Damage to the environment", "C": "Failure of modern technology", "D": "A decline in industrial systems" },
      "correctOption": "B",
      "explanation": "The passage mentions drawbacks such as 'increased use of pesticides and fertilizers which led to environmental damage.'",
      "isPYQ": false,
      "questionSubtype": "Reading Comprehension",
      "questionType": "MCQ",
      "section": "General English"
    }
  ]
}
\`\`\`

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array with exactly ${numberOfQuestions} elements. Do not include any text, explanations, or markdown fences before or after the JSON.
`;