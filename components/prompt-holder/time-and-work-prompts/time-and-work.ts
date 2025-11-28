/**
 * Generates a prompt for Time and Work questions with detailed difficulty scaling and question types.
 * These questions test concepts like individual/combined work, efficiency, pipes & cisterns, alternate days, wages, etc.
 * Note: Each question is logically independent and does not share a context.
 */
const TIME_AND_WORK_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Time and Work questions, adhering to the specified difficulty distribution and exam style for Bank Prelims and Mains. Each question must be logically independent.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options. Ensure one option is the correct answer. The other options (distractors) should be plausible results from common calculation errors.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:**
    -   Focus on basic formula-based questions (Time = Work / Efficiency).
    -   Calculate combined work time for two individuals.
    -   Simple efficiency comparisons (e.g., "A is twice as efficient as B").
    -   Example: "A can complete a work in 10 days, and B can complete it in 15 days. In how many days can both finish it together?"
-   **For 'Moderate' difficulty:**
    -   Involve two-step calculations or more complex scenarios.
    -   Introduce concepts like workers leaving midway, alternate working days, or work efficiency ratios.
    -   Include Pipes & Cisterns problems with one inlet and one outlet.
    -   Example: "A can do a piece of work in 20 days, and B can do it in 30 days. They work together for 6 days. What fraction of work is left?"
-   **For 'Hard' difficulty:**
    -   Involve multi-concept problems with complex conditions similar to Mains exams.
    -   Use concepts like multiple workers joining/leaving at different times, complex Pipes & Cisterns with multiple inlets/outlets, or questions combining work with wages.
    -   Use Man-Work-Days relationship (M1*D1*H1/W1 = M2*D2*H2/W2).
    -   Example: "10 men can complete a work in 15 days. After working for 6 days, 5 men leave. In how many more days will the remaining men finish the work?"
-   **For 'Mixed' difficulty:**
    -   Generate a balanced mix of Easy, Medium, and Hard patterns as requested.

**Example Questions to Model After (for structure, concepts, and language):**

--- MIXED EXAMPLES ---
Q1. A can do a piece of work in 25 days, B can do it in 20 days. They started the work together but A left 5 days before the completion of the work. The work has finished in?
Q2. 8 girls and 12 boys can complete a work in 4 days. If one boy alone completes the work in 60 days, then in how many days a girl will be able to finish the same work alone?
Q3. A and B together can complete the work in 36 days, B and C together can complete the work in 45 days and A, B and C together can complete the work in 24 days. In how many days A and C together can complete the work?
Q4. A is 25% more efficient than B. If B can complete a work in 20 days, in how many days can A and B together finish it?
Q5. Pipe A can fill a tank in 12 hours, and Pipe B can fill it in 15 hours. Pipe C can empty it in 6 hours. If all are opened together, find the time taken to fill the tank.
Q6. 10 men can complete a work in 15 days. After working for 6 days, 5 men leave. In how many more days will the remaining men finish the work?
Q7. A and B together earn ₹1200 for completing a piece of work in 10 days. A alone can do it in 15 days. Find B’s share of money.
Q8. A completes one-third of the work in 20 days and B completes half of the work in 15 days. In how many days required to A and B together can complete the work?
Q9. A and B can complete the work in 24 days and 16 days respectively. They started the work together and after 6 days B left the work. In how many days A alone complete the remaining work?
Q10. A alone completes the work in 80 days, B alone complete the work in 64 days and C alone complete the work in 160 days. If A, B and C together can started the work, after 20 days A left the work and B left the work 15 days before completion of the work, in how many days the work is completed?

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation. For moderate and hard questions, you must briefly mention the concept tested in the explanation.
`;

export const getTimeAndWorkPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return TIME_AND_WORK_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
