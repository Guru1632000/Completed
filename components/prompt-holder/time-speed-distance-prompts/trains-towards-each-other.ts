/**
 * Prompt to generate 'Relative Speed (Trains)' questions.
 * This covers trains moving in opposite directions (towards each other) and in the same direction (overtaking).
 */
export const RELATIVE_SPEED_TRAINS_PROMPT = `
**Objective:** Generate a high-quality, exam-style question set with exactly \${numberOfQuestions} questions focused on the relative speed of trains.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** Each question must have exactly \${optionsCount} options.
- **Format:** Each question should be a standalone word problem. Use realistic values for train lengths (in meters) and speeds (in km/h).

**Specific Task Requirements:**
-   **Scenario Variety:** Generate a mix of the following scenarios:
    1.  **Opposite Direction:** Two trains moving towards each other. Relative speed is the SUM of their speeds (S1 + S2).
    2.  **Same Direction:** One train overtaking another. Relative speed is the DIFFERENCE of their speeds (S1 - S2).
-   **Question Variety:** Ask for different variables like time to cross, length of a train, or speed of a train.
-   **Explanation:** The explanation for each question **must** explicitly state the scenario (opposite/same direction), calculate the relative speed correctly, and then use it to solve the problem. Remember to handle unit conversions (km/h to m/s).

**Example Questions to Model After:**

Q1 (Opposite Direction): Two trains, 150m and 250m long, are running on parallel tracks. They are moving towards each other at speeds of 54 km/h and 36 km/h respectively. In what time will they cross each other completely?
(Explanation: Relative Speed = 54 + 36 = 90 km/h = 25 m/s. Total Distance = 150 + 250 = 400m. Time = 400/25 = 16 seconds.)

Q2 (Same Direction): Two trains of lengths 120m and 80m are running in the same direction with speeds of 68 km/h and 50 km/h respectively. In how much time will the faster train cross the slower train?
(Explanation: Relative Speed = 68 - 50 = 18 km/h = 5 m/s. Total Distance = 120 + 80 = 200m. Time = 200/5 = 40 seconds.)

**Your Task:**
Create **new and unique** questions based on the specified requirements, ensuring a mix of both opposite and same direction scenarios. The final output must be a single JSON object with a "questions" array containing exactly \${numberOfQuestions} question objects.
`;
