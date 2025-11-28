/**
 * Generates a prompt for Mensuration questions, covering both 2D and 3D shapes.
 * Note: Each question is logically independent.
 */
const MENSURATION_PROMPT_TEMPLATE = `
Generate \${numberOfQuestions} distinct Mensuration questions. Each question must be a logically independent word problem.

**Core Instructions:**
- **Syllabus Context:** \${syllabusContextPrompt}
- **Difficulty:** \${difficultyInstruction}
- **Options:** All questions must have exactly \${optionsCount} options.

**Required Question Variety (CRITICAL):**
Your generated set MUST include a balanced mix of questions covering:
-   **2D Shapes (Area & Perimeter):**
    -   Square
    -   Rectangle
    -   Circle / Semicircle
    -   Triangle (Equilateral, Isosceles, Right-angled)
    -   Rhombus, Trapezium
-   **3D Shapes (Volume & Surface Area):**
    -   Cube
    -   Cuboid
    -   Cylinder
    -   Cone
    -   Sphere / Hemisphere

**Difficulty-Based Pattern Generation Rules:**
-   **For 'Easy' difficulty:** Direct formula application for a single 2D shape.
-   **For 'Moderate' difficulty:** Problems involving cost calculation (e.g., fencing, painting), or simple combinations of shapes (e.g., a path around a rectangular park). Direct formula application for a single 3D shape.
-   **For 'Hard' difficulty:** Complex problems involving conversion from one 3D shape to another (e.g., melting a sphere to form a cylinder), or questions combining multiple 2D/3D shapes.
-   **For 'Mixed' difficulty:** A balanced mix of 2D and 3D problems with varying difficulty.

**Example Questions to Model After:**

Q1. The length of a rectangular plot is 20 meters more than its breadth. If the cost of fencing the plot @ ₹26.50 per meter is ₹5300, what is the length of the plot in meters? (Ans: 60 meters)
Q2. The circumference of a circle is twice the perimeter of a rectangle. The area of the rectangle is 448 sq. cm and the length of the rectangle is 28 cm. Find the area of the circle. (Ans: 2464 sq. cm)
Q3. A metallic sphere of radius 10.5 cm is melted and then recast into small cones, each of radius 3.5 cm and height 3 cm. The number of cones so formed is? (Ans: 126)

**Final Output Instruction (Absolutely Critical):**
Your entire response MUST be a single, valid JSON object containing a "questions" array. Do not include any text, explanations, or markdown fences before or after the JSON. Each explanation must clearly state the formula used and show the step-by-step calculation.
`;

export const getMensurationPrompt = (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
    return MENSURATION_PROMPT_TEMPLATE
        .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
        .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
        .replace(/\${difficultyInstruction}/g, difficultyInstruction)
        .replace(/\${optionsCount}/g, String(optionsCount));
};
