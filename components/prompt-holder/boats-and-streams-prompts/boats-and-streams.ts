/**
 * Generates a prompt for "Boats and Streams" questions with detailed difficulty scaling and question types,
 * based on high-quality bank exam examples.
 */
const BOATS_AND_STREAMS_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Quantitative Aptitude MCQs for Bank Exams on the topic of Boats and Streams. Each question must be a logically independent word problem.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options.
- **Core Concepts:** The solutions must be based on:
    - **Downstream Speed (Ds):** Speed of Boat in Still Water (B) + Speed of Stream (S).
    - **Upstream Speed (Us):** Speed of Boat in Still Water (B) - Speed of Stream (S).

**Required Question Variety (CRITICAL):**
Your generated set MUST include a balanced mix of the following concepts, as seen in competitive exams:
1.  **Time Difference:** Problems where the time taken for upstream is more than downstream for the same distance.
2.  **Total Time:** Problems involving the total time for a round trip (upstream and downstream).
3.  **Ratio of Speeds:** The ratio between boat speed and stream speed is given.
4.  **Ratio of Times:** The ratio of time taken for upstream vs. downstream journeys is given.
5.  **Algebraic Variables:** Problems where distance or speed is represented by variables (e.g., 'D' km, speed is 'x' kmph).
6.  **Percentage-Based Speeds:** Speed of the stream is a percentage of the boat's speed or downstream/upstream speed.

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Direct calculations of time, distance, or speed for a one-way journey.
-   **For 'Moderate' difficulty:** Involve round trips (total time/time difference), simple ratio problems, or finding B or S when Us and Ds are derivable.
-   **For 'Hard' difficulty:** Focus on complex ratio problems, multi-step algebraic scenarios, percentage-based speeds, or comparing two different journey conditions.
-   **For 'Mixed' difficulty:** Generate a balanced mix of Moderate and Hard patterns.

**Example Questions to Model After (CRITICAL: Generate questions of this style, complexity, and language):**

--- MIXED EXAMPLES (BANK EXAM STANDARD) ---
Q1. A boat took 12 hours less to travel a certain distance downstream than to travel the same distance upstream. If the speed of a boat in still water is 20 km/hr and speed of a stream is 12 km/hr, then find the total distance travelled by boat in downstream?
Q2. A boat can cover 9.6 km upstream in 24 minutes. If the speed of the current is 1/4th of the boat in still water, then how much distance (in km) can the boat cover downstream in 36 minutes?
Q3. The ratio of the speed of the boat in still water and the speed of the stream is 5:3. The difference between the upstream and downstream speed of the boat is 60 km/hr. Find the distance covered by the boat in downstream in 15 hours.
Q4. A boat covers D km along with stream in 8 hours and the same boat covers (D + 30) km against the stream in 30 hours. If the speed of the boat in still water is double of the speed of the current, then find the speed of the stream?
Q5. A boat is running in upstream takes 4 hours to cover a certain distance, while it takes 3 hours to cover the same distance running downstream. What is the ratio between the speed of the boat in still water and speed of the current respectively?
Q6. Sum of the downstream and upstream speed of the boat is 56 km/hr and the distance covered by the boat in downstream in 15 hours is 120 km less than the distance covered by the boat in upstream in 25 hours. Find the speed of the current?
Q7. The upstream speed of the boat is 60% of the downstream speed of the boat. If the boat covers 128 km in still water in 4 hours, then find the speed of the stream.
Q8. A boat covers a certain distance upstream in 9 hours and the boat covers the same distance downstream in 6 hours. If the speed of the stream is 4 km/hr, then find the distance covered by the boat in still water in 6 hours.
Q9. Speed of the current is 12.5% of the downstream speed of the boat. The time taken by the boat to cover 300 km in downstream is 5 hours more than the time taken by the boat to cover 150 km in upstream. Find the speed of the boat in still water.

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly show the step-by-step calculation, defining Upstream and Downstream speeds first.
`;

export const getBoatsAndStreamsPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return BOATS_AND_STREAMS_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};