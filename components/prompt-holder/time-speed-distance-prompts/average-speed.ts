/**
 * Prompt to generate 'Average Speed' questions.
 */
export const AVERAGE_SPEED_PROMPT = `
**Objective:** Generate a high-quality, exam-style question set with exactly \${numberOfQuestions} questions focused on calculating Average Speed.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** Each question should be a standalone word problem with realistic values for speeds and distances.

**Difficulty-Based Scenario Generation:**
-   **For 'Easy' difficulty:** Focus on two-part journeys with **equal distances** (e.g., going and returning).
-   **For 'Moderate' difficulty:** Focus on two-part journeys with **unequal distances**.
-   **For 'Hard' difficulty:** Create scenarios with **three or more segments**, or problems involving **stoppages** (e.g., "Excluding stoppages, the speed is X...").
-   **For 'Mixed' difficulty:** Generate a balanced mix of Easy and Moderate scenarios.

**Specific Task Requirements:**
-   **Core Concept:** The primary method for solving must be **Average Speed = Total Distance / Total Time**.
-   **Explanation:** The explanation for each question **must** clearly calculate the total distance and total time, and then use them to find the average speed. For equal distance problems, the shortcut formula (2xy / (x+y)) can be mentioned as a secondary method.

**Example Questions to Model After:**

Q1 (Easy): A man goes to his office at a speed of 30 km/h and returns to his home at a speed of 60 km/h. What is his average speed for the entire journey?

Q2 (Moderate): A car travels the first 60 km of its journey at a speed of 40 km/h and the next 90 km at a speed of 60 km/h. What is the average speed of the car for the entire journey?

Q3 (Hard): Excluding stoppages, the speed of a bus is 54 km/h, and including stoppages, it is 45 km/h. For how many minutes does the bus stop per hour?

**Your Task:**
Create **new and unique** questions based on the specified requirements. The questions must be logically sound. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;
