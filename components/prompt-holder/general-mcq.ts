/**
 * Generates the prompt for standard, standalone Multiple Choice Questions. This is the default/fallback prompt.
 */
export const getGeneralMCQPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => `
Generate ${numberOfQuestions} distinct, exam-standard multiple-choice questions (MCQs).

**CRITICAL RULE: The questions MUST be strictly and exclusively related to the specified Syllabus Context. Do NOT generate questions from other domains like logic puzzles, quantitative aptitude, or reasoning unless the syllabus context explicitly demands it. For example, if the topic is 'Indian History', the questions must be about history, NOT math or logic puzzles, even if the topic name contains words like 'figure' or 'statement'.**

**Core Instructions:**
- **Syllabus Context:** ${syllabusContextPrompt}
- **Difficulty:** ${difficultyInstruction}
- **Options:** All questions must have exactly ${optionsCount} options. There must be one and only one correct answer.
- **Quality:** Questions must be clear, unambiguous, and grammatically correct.

**Content & Structure Guidelines (Follow Strictly):**

1.  **High-Quality, Plausible Distractors:** This is crucial. Incorrect options (distractors) must be challenging and intelligently crafted.
    - They should represent common student mistakes or subtle misunderstandings of the topic.
    - They should be answers that would be correct under slightly different conditions or assumptions.
    - For numerical questions, distractors should result from common calculation errors.
    - Avoid options that are obviously wrong or out of context.

2.  **Comprehensive Explanations:** Explanations must be thorough and clear.
    - Break down the solution with a step-by-step logical process.
    - Explicitly state why the correct option is correct and briefly explain why the other options are incorrect.

3.  **Specific Sub-topics:** The \`questionSubtype\` field is mandatory. It must contain a specific, granular topic from the syllabus (e.g., 'Time and Work', 'Indus Valley Civilization').

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object.
- Start your response immediately with \`{\` and end it with \`}\`.
- DO NOT include any text, explanations, or markdown fences (like \`\`\`json) before or after the JSON object.
- The root of the JSON object must contain a single key: "questions", whose value is an array of the generated question objects.
- Ensure every field within each question object is correctly formatted as per the schema.
`;