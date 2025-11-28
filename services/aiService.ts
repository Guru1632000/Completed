




import { GoogleGenAI, Type, Modality } from "@google/genai";
// FIX: Added SSCStageFilterType to imports for function signature update.
import { Question, Topic, Difficulty, DescriptiveQuestion, Evaluation, Marks, UserAnswer, TestResult, CoachFeedback, RailwayExamFilterType, ExamType, TopicQuestion, SSCExamFilterType, SyllabusUnit, StudyNotes, GeoFeature, StudyPlanItem, DashboardCoachSummary, ExamPatternConfig, TNPSCGroupFilterType, SSCStageFilterType } from "../types";
// FIX: Replaced non-existent TNPSC_MOCK_TEST_UNIT_DISTRIBUTION with TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION
import {
  TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION,
  TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION,
  BANK_PRELIMS_SYLLABUS,
  BANK_MAINS_SYLLABUS,
  BANK_PRELIMS_TOPIC_DISTRIBUTION,
  BANK_MAINS_TOPIC_DISTRIBUTION,
  BANK_PRELIMS_EXAM_PATTERN,
  BANK_MAINS_EXAM_PATTERN,
  RRB_BANK_PRELIMS_SYLLABUS,
  RRB_BANK_MAINS_SYLLABUS,
  RRB_BANK_PRELIMS_EXAM_PATTERN,
  RRB_BANK_MAINS_EXAM_PATTERN,
  RRB_BANK_PRELIMS_TOPIC_DISTRIBUTION,
  RRB_BANK_MAINS_TOPIC_DISTRIBUTION,
  RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION,
  RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION,
  RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION,
  RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION,
  RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION,
  RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION,
  SSC_CGL_TIER1_EXAM_PATTERN,
  SSC_CGL_TIER2_EXAM_PATTERN,
  SSC_CHSL_TIER1_EXAM_PATTERN,
  SSC_CHSL_TIER2_EXAM_PATTERN,
  SSC_CGL_TIER1_SYLLABUS,
  SSC_CGL_TIER2_SYLLABUS,
  SSC_CHSL_TIER1_SYLLABUS,
  SSC_CHSL_TIER2_SYLLABUS,
  SSC_CGL_TIER1_TOPIC_DISTRIBUTION,
  SSC_CGL_TIER2_TOPIC_DISTRIBUTION,
  SSC_CHSL_TIER1_TOPIC_DISTRIBUTION,
  SSC_CHSL_TIER2_TOPIC_DISTRIBUTION,
// FIX: Add missing imports for SSC JE constants to resolve compilation errors.
  SSC_JE_PAPER1_SYLLABUS,
  SSC_JE_PAPER1_EXAM_PATTERN,
  SSC_JE_PAPER1_TOPIC_DISTRIBUTION,
  SYLLABUS // Import full syllabus for fallback
} from '../constants';
// FIX: Corrected import paths for prompt files which are outside the src directory.
import { getSeatingArrangementPrompt } from '../components/prompt-holder/seating-arrangement';
import { getReadingComprehensionPrompt } from '../components/prompt-holder/reading-comprehension';
import { getPuzzlePrompt } from '../components/prompt-holder/puzzle';
import { getSyllogismPrompt } from '../components/prompt-holder/syllogism-prompts/syllogism';
import { getAssertionReasoningPrompt } from '../components/prompt-holder/assertion-reasoning';
import { getDataInterpretationPrompt } from '../components/prompt-holder/data-interpretation-prompts/data-interpretation';
import { getGeneralMCQPrompt } from '../components/prompt-holder/general-mcq';
import { getInequalityPrompt } from "../components/prompt-holder/inequality-prompts";
import { getNumberSeriesPrompt } from "../components/prompt-holder/number-series-prompts";
import { getSimplificationPrompt } from "../components/prompt-holder/simplification-prompts";
import { getApproximationPrompt } from "../components/prompt-holder/approximation-prompts";
import { getProfitLossPrompt } from "../components/prompt-holder/profit-loss-prompts";
import { getMarkedPricePrompt } from "../components/prompt-holder/marked-price-prompts";
import { getDiscountQuestionsPrompt } from "../components/prompt-holder/discount-questions-prompts";
import { getCombinedPlMpDiscountPrompt } from "../components/prompt-holder/hcf-lcm-prompts/combined-pl-mp-discount-prompts";
import { getTimeAndWorkPrompt } from "../components/prompt-holder/time-and-work-prompts";
import { getCompoundInterestPrompt, getCombinationSimpleCompoundInterestPrompt, getSimpleInterestPrompt } from "../components/prompt-holder/simple-interest-compound-interest-prompts";
import { getTimeSpeedDistancePrompt } from "../components/prompt-holder/time-speed-distance-prompts";
import { getAveragePrompt } from "../components/prompt-holder/average-prompts";
import { getPartnershipPrompt } from '../components/prompt-holder/partnership-prompts';
import { getMixtureAllegationPrompt } from '../components/prompt-holder/mixture-and-allegations-prompts';
import { getRatioAndProportionPrompt } from '../components/prompt-holder/ratio-and-proportion-prompts';
import { getQuadraticEquationPrompt } from "../components/prompt-holder/quadratic-equation-prompts";
import { getHcfLcmPrompt } from "../components/prompt-holder/hcf-lcm-prompts";
import { getDataSufficiencyPrompt } from "../components/prompt-holder/data-sufficiency-prompts";
import { getQuantityComparisonPrompt } from "../components/prompt-holder/quantity-comparison-prompts";
import { getPercentagePrompt } from "../components/prompt-holder/percentage-prompts";
import { getAgesPrompt } from "../components/prompt-holder/ages-prompts";
import { getMensurationPrompt } from "../components/prompt-holder/mensuration-prompts";
import { getPermutationCombinationPrompt } from "../components/prompt-holder/permutation-combination-prompts";
import { getProbabilityPrompt } from "../components/prompt-holder/probability-prompts";
import { getBoatsAndStreamsPrompt } from "../components/prompt-holder/boats-and-streams-prompts";
import { BLOOD_RELATIONS_PROMPT } from '../components/prompt-holder/seating-arrangement-prompts/blood-relations';
import { DIRECTION_SENSE_PROMPT } from '../components/prompt-holder/seating-arrangement-prompts/direction-sense';
import { FLOOR_FLAT_PROMPT } from '../components/prompt-holder/seating-arrangement-prompts/floor-and-flat-puzzles';
import { BOX_STACK_PROMPT } from '../components/prompt-holder/puzzle-prompts/box-arrangement';
import { COMPARISON_INEQUALITY_PROMPT } from '../components/prompt-holder/puzzle-prompts/comparison-inequality-puzzle';
import { WEEKLY_ARRANGEMENT_PROMPT } from '../components/prompt-holder/puzzle-prompts/day-based-weekly-arrangement';
import { SCHEDULING_MONTH_DAY_PROMPT } from '../components/prompt-holder/puzzle-prompts/scheduling-month-day-puzzle';


// --- PDF PROCESSING HELPERS ---

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const base64Data = base64.split(',')[1];
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

export const extractTextFromPDF = async (fileContentBase64: string): Promise<string> => {
    if (!window.pdfjsLib) {
        throw new Error("PDF processing library (pdf.js) is not loaded.");
    }
    
    const arrayBuffer = base64ToArrayBuffer(fileContentBase64);
    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join('\n');
        fullText += pageText.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').replace(/ {2,}/g, ' ') + '\n\n';
    }
    
    const MAX_CONTEXT_LENGTH = 800000;
    if (fullText.length > MAX_CONTEXT_LENGTH) {
        console.warn(`PDF text was too long and has been truncated to ${MAX_CONTEXT_LENGTH} characters.`);
        return fullText.substring(0, MAX_CONTEXT_LENGTH);
    }
    
    return fullText.trim();
};


// --- API INITIALIZATION ---
let ai: GoogleGenAI;
try {
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) || undefined;

    if (apiKey) {
        ai = new GoogleGenAI({ apiKey: apiKey });
    } else {
        throw new Error("API_KEY environment variable not found or is not accessible in this environment.");
    }
} catch (e) {
    console.warn("Gemini API could not be initialized. Question generation will use mock data or fail. Ensure the API_KEY is correctly configured for your deployment environment.", e);
}


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- MOCK DATA FOR OFFLINE/KEYLESS USE ---
const mockQuestions: Question[] = [
    {
        questionText: "This is a mock question because the API key is not configured. Which of the following is a primary color?",
        options: { A: "Green", B: "Orange", C: "Blue", D: "Violet" },
        correctOption: "C",
        explanation: "The primary colors are red, yellow, and blue. They can be mixed to create all other colors.",
        isPYQ: false,
        questionType: "MCQ",
        questionSubtype: "Physics - Light",
        section: "General Science"
    }
];
const mockDescriptiveQuestion = (marks: Marks): DescriptiveQuestion => ({
    questionText: `Discuss the impact of the Green Revolution on Indian agriculture. (Mock Question for ${marks} marks)`,
    marks: marks
});
const mockEvaluation: Evaluation = {
    score: 10,
    feedback: "This is a strong answer. You correctly identified the increase in food production. However, the discussion on negative impacts could be more detailed.",
    suggestions: "To improve, try to include specific data points or examples. Also, elaborate on how the increased use of fertilizers and pesticides affected soil and water resources.",
    modelAnswer: "## Introduction\nThe Green Revolution in India was a pivotal movement aimed at increasing agricultural productivity.\n\n## Positive Impacts\n- **Increased Food Production:** The introduction of High Yielding Variety (HYV) seeds led to a massive surge in output.\n- **Economic Growth:** Higher yields boosted farmer incomes and stimulated rural economies."
};
const mockCoachFeedback: CoachFeedback = {
    greeting: "Hello there! I'm PrepPal, your AI coach. I've reviewed your recent mock tests.",
    overall_summary: "This is a mock analysis. You're showing good effort. There's a clear pattern of strength in General Science, but we need to focus a bit more on Aptitude.",
    strength_areas: [{ topic: "General Science", reason: "You consistently score above 80% in this section." }],
    weakness_areas: [{ topic: "Aptitude & Reasoning", reason: "Your accuracy here is around 50%. Focusing here will yield big improvements." }],
    study_plan_intro: "Here is a simple plan to help you improve:",
    study_plan: [
        { step: 1, title: "Review Aptitude Concepts", description: "Spend 2-3 sessions this week reviewing core concepts." },
        { step: 2, title: "Take Focused Practice Tests", description: "Take two 15-question practice tests focused solely on Aptitude." },
        { step: 3, title: "Analyze Mistakes", description: "After each test, understand the explanation for every question you got wrong." }
    ],
    motivational_quote: "Success is the sum of small efforts, repeated day in and day out."
};

// --- RESPONSE SCHEMAS for GEMINI ---
const questionSchema = {
    type: Type.OBJECT,
    properties: {
        commonContext: { type: Type.STRING, nullable: true, description: "Shared context for a set of questions (e.g., a puzzle or passage)." },
        commonContextDiagramSvg: { type: Type.STRING, nullable: true, description: "An SVG diagram for the common context, styled for a dark theme." },
        questionText: { type: Type.STRING, description: "The specific question text." },
        options: {
            type: Type.OBJECT,
            properties: {
                A: { type: Type.STRING }, B: { type: Type.STRING },
                C: { type: Type.STRING }, D: { type: Type.STRING },
                E: { type: Type.STRING, nullable: true },
            },
            required: ['A', 'B', 'C', 'D'],
        },
        correctOption: { type: Type.STRING, description: "The key of the correct option (e.g., 'A')." },
        explanation: { type: Type.STRING, description: "A clear, step-by-step explanation for the correct answer." },
        explanationDiagramSvg: { type: Type.STRING, nullable: true, description: "An SVG diagram for the explanation, styled for a dark theme." },
        isPYQ: { type: Type.BOOLEAN },
        questionSubtype: { type: Type.STRING, description: "A specific, granular topic for fine-grained analysis (e.g., 'Time and Work')." },
        questionType: { type: Type.STRING, enum: ['MCQ', 'AssertionReasoning'] },
        section: { type: Type.STRING, description: "The main subject or section this question belongs to (e.g., 'General Studies')." },
    },
    required: ['questionText', 'options', 'correctOption', 'explanation', 'isPYQ', 'questionSubtype', 'questionType', 'section'],
};
const questionsResponseSchema = { type: Type.OBJECT, properties: { questions: { type: Type.ARRAY, items: questionSchema } }, required: ['questions'] };
const descriptiveQuestionResponseSchema = { type: Type.OBJECT, properties: { questionText: { type: Type.STRING }, marks: { type: Type.INTEGER } }, required: ['questionText', 'marks'] };
const evaluationResponseSchema = { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, feedback: { type: Type.STRING }, suggestions: { type: Type.STRING }, modelAnswer: { type: Type.STRING } }, required: ['score', 'feedback', 'suggestions', 'modelAnswer'] };
const coachFeedbackResponseSchema = {
    type: Type.OBJECT,
    properties: {
        greeting: { type: Type.STRING },
        overall_summary: { type: Type.STRING },
        strength_areas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ['topic', 'reason'] } },
        weakness_areas: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ['topic', 'reason'] } },
        study_plan_intro: { type: Type.STRING },
        study_plan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { step: { type: Type.INTEGER }, title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['step', 'title', 'description'] } },
        motivational_quote: { type: Type.STRING },
    },
    required: ['greeting', 'overall_summary', 'strength_areas', 'weakness_areas', 'study_plan_intro', 'study_plan', 'motivational_quote'],
};
const studyNotesResponseSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        introduction: { type: Type.STRING },
        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        example: {
            type: Type.OBJECT,
            properties: {
                problem: { type: Type.STRING },
                solution: { type: Type.STRING },
            },
            required: ['problem', 'solution']
        },
        summary: { type: Type.STRING }
    },
    required: ['topic', 'introduction', 'keyPoints', 'example', 'summary']
};
const geoFeaturesResponseSchema = {
    type: Type.OBJECT,
    properties: {
        features: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['point', 'line'] },
                    point: {
                        type: Type.ARRAY,
                        items: { type: Type.NUMBER },
                        nullable: true,
                        description: "Populate this for 'point' type features with [latitude, longitude]. Null otherwise."
                    },
                    path: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.ARRAY,
                            items: { type: Type.NUMBER }
                        },
                        nullable: true,
                        description: "Populate this for 'line' type features with [[lat1, lon1], [lat2, lon2], ...]. Null otherwise."
                    },
                    layer: {
                        type: Type.STRING,
                        description: "A category for the feature, e.g., 'Rivers', 'Mountain Peaks', 'Cities', 'Borders'. Use a consistent category for similar features."
                    },
                },
                required: ['name', 'description', 'type', 'layer'],
            },
        },
    },
    required: ['features'],
};

const studyPlanResponseSchema = {
    type: Type.OBJECT,
    properties: {
        plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topicName: { type: Type.STRING, description: "The name of the topic or block. This MUST be one of the exact topic names from the input syllabus units, or a generic title like 'Revision Day'." },
                    startDay: { type: Type.INTEGER },
                    endDay: { type: Type.INTEGER },
                    durationDays: { type: Type.INTEGER },
                    priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                    justification: { type: Type.STRING }
                },
                required: ['topicName', 'startDay', 'endDay', 'durationDays', 'priority', 'justification']
            }
        }
    },
    required: ['plan']
};

const dashboardCoachSummarySchema = {
    type: Type.OBJECT,
    properties: {
        greeting: { type: Type.STRING, description: "A short, friendly greeting." },
        one_line_summary: { type: Type.STRING, description: "A single, concise sentence summarizing the user's performance trend from the history." },
        tip_for_today: { type: Type.STRING, description: "One specific, actionable tip based on the most common weakness." },
        motivational_quote: { type: Type.STRING, description: "A short, inspiring quote related to learning or perseverance." },
    },
    required: ['greeting', 'one_line_summary', 'tip_for_today', 'motivational_quote'],
};


// --- GEMINI API HELPERS ---

const callGeminiModel = async (
    systemInstruction: string,
    userPrompt: string,
    responseSchema: any,
    signal?: AbortSignal,
    useThinkingMode: boolean = false
): Promise<any> => {
    if (!ai) throw new Error("Gemini API service is not initialized. Check API_KEY.");

    const finalUserPrompt = `${userPrompt}\n\n---\n**Uniqueness Instruction:** This is a new request. Ensure the generated content is unique and not a repetition of previous responses. Cache-busting seed: ${Date.now()}${Math.random()}`;

    const processBackspaces = (str: string): string => {
        const stack: string[] = [];
        for (const char of str) {
            if (char === '\b') {
                if (stack.length > 0) {
                    stack.pop();
                }
            } else {
                stack.push(char);
            }
        }
        return stack.join('');
    };
    
    for (let attempt = 1; attempt <= 3; attempt++) {
        if (signal?.aborted) {
            const abortError = new Error('Aborted by user');
            abortError.name = 'AbortError';
            throw abortError;
        }
        try {
            const model = 'gemini-2.5-pro';
            const config: any = {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            };

            if (useThinkingMode) {
                config.thinkingConfig = { thinkingBudget: 32768 };
            }
            
            const response = await ai.models.generateContent({
                model,
                contents: finalUserPrompt,
                config,
            });
            const text = response.text;
            if (!text) throw new Error(`Gemini returned an empty response on attempt ${attempt}.`);
            
            try {
                return JSON.parse(processBackspaces(text));
            } catch (jsonError) {
                console.warn(`Attempt ${attempt}: Direct JSON parsing failed. Error:`, (jsonError as Error).message);
                console.warn("Initial malformed response snippet:", text.substring(0, 500) + (text.length > 500 ? '...' : ''));
                console.log("Attempting to clean and re-parse the response...");

                let cleanText = text.trim();
                try {
                    cleanText = processBackspaces(cleanText);
                    const match = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
                    
                    if (match && match[1]) {
                        cleanText = match[1];
                    } else {
                        const firstBracket = cleanText.indexOf('{');
                        const firstSquareBracket = cleanText.indexOf('[');
                        
                        let start = -1;
                        if (firstBracket === -1) start = firstSquareBracket;
                        else if (firstSquareBracket === -1) start = firstBracket;
                        else start = Math.min(firstBracket, firstSquareBracket);

                        const lastBracket = cleanText.lastIndexOf('}');
                        const lastSquareBracket = cleanText.lastIndexOf(']');
                        
                        let end = Math.max(lastBracket, lastSquareBracket);

                        if (start !== -1 && end !== -1 && end > start) {
                            cleanText = cleanText.substring(start, end + 1);
                        }
                    }

                    const cleanedJSON = JSON.parse(cleanText);
                    console.log(`Attempt ${attempt}: Successfully parsed response after cleaning.`);
                    return cleanedJSON;

                } catch (cleanJsonError) {
                    console.error(`Attempt ${attempt}: JSON parsing failed AGAIN even after cleaning.`, (cleanJsonError as Error).message);
                    console.error("Cleaned text snippet that failed:", cleanText.substring(0, 500) + (cleanText.length > 500 ? '...' : ''));
                    throw new Error("Malformed AI Response Text, even after cleaning.");
                }
            }

        } catch (error) {
            const err = error as Error;
            if (err.name === 'AbortError') {
                throw err;
            }
            
            console.warn(`Attempt ${attempt} failed:`, err.message);
        
            // Non-retriable errors
            if (err.message.includes("[400]") || err.message.includes("SAFETY")) {
                console.error("Non-retriable error from AI service. Halting retries.", err);
                throw new Error("The AI model rejected the prompt. It might be too complex or violate safety policies. Please try a different topic or simplify your request.");
            }
        
            // Retriable errors
            if (attempt < 3) {
                const delay = 2000 * Math.pow(2, attempt - 1);
                console.log(`Retrying in ${delay / 1000}s...`);
                await sleep(delay);
                continue; // Go to next attempt
            }
        
            // After all retries, throw a user-friendly error
            console.error("All AI service attempts failed. Giving up.", err);
            if (err.message.includes("[429]")) {
                throw new Error("The AI service is temporarily busy due to high demand (Quota Exceeded). Please wait a few moments and try again.");
            }
            if (err.message.includes("[500]") || err.message.includes("[503]")) {
                throw new Error("The AI service is currently experiencing technical difficulties. Please try again later.");
            }
            // Generic fallback after retries
            throw new Error("Failed to connect to the AI service after multiple attempts. Please check your network connection or try again later.");
        }
    }
    throw new Error("Failed to get a valid response from the AI after multiple attempts.");
};

const callGeminiForText = async (
    systemInstruction: string,
    userPrompt: string,
    signal?: AbortSignal
): Promise<string> => {
    if (!ai) {
        throw new Error("Gemini API service is not initialized. Check API_KEY.");
    }

    for (let attempt = 1; attempt <= 3; attempt++) {
        if (signal?.aborted) {
            const abortError = new Error('Aborted by user');
            abortError.name = 'AbortError';
            throw abortError;
        }
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            
            const text = response.text;
            if (!text) {
                throw new Error(`Gemini returned an empty text response on attempt ${attempt}.`);
            }
            return text;
        } catch (error) {
            const err = error as Error;
            if (err.name === 'AbortError') {
                throw err;
            }
            
            console.warn(`Text generation attempt ${attempt} failed:`, err.message);

            // Non-retriable errors
            if (err.message.includes("[400]") || err.message.includes("SAFETY")) {
                console.error("Non-retriable text generation error. Halting retries.", err);
                throw new Error("The AI model rejected the text generation prompt. Please try a different topic.");
            }

            // Retriable errors
            if (attempt < 3) {
                const delay = 1500 * Math.pow(2, attempt - 1);
                console.log(`Retrying text generation in ${delay / 1000}s...`);
                await sleep(delay);
                continue; // Go to next attempt
            }

            // After all retries, throw a user-friendly error
            console.error("All text generation attempts failed.", err);
            if (err.message.includes("[429]")) {
                throw new Error("The AI service is temporarily busy (Quota Exceeded). Please wait and try again.");
            }
            if (err.message.includes("[500]") || err.message.includes("[503]")) {
                throw new Error("The AI service is experiencing technical issues. Please try again later.");
            }
            throw new Error("Failed to get text from the AI service. Please check your network or try again.");
        }
    }
    throw new Error("Failed to get a valid text response from the AI after multiple attempts.");
};

const cleanExtractedPDFText = async (rawText: string, signal?: AbortSignal): Promise<string> => {
    if (!ai) {
        console.warn("AI service not available for cleaning text. Returning raw text.");
        return rawText;
    }
    const TRUNCATION_LIMIT = 500000;
    const truncatedText = rawText.length > TRUNCATION_LIMIT ? rawText.substring(0, TRUNCATION_LIMIT) : rawText;

    const systemInstruction = `You are an intelligent text processing engine. Your sole purpose is to refine raw text extracted from educational material or question paper PDFs. You must remove all irrelevant "junk" text and return only the clean, core content. Do not add any commentary or your own text.`;
    const userPrompt = `
From the following raw text, extract ONLY the main content (questions, passages, options, explanations, main body text).

**CRITICAL RULES:**
1.  **REMOVE:** All headers, footers, page numbers, watermarks, copyright notices, website URLs, and any other metadata or repetitive navigational text that is not part of the actual content.
2.  **FIX:** Join words that are incorrectly split across lines (hyphenated or not). Correct obvious OCR errors if possible without changing the meaning. Merge fragmented paragraphs.
3.  **PRESERVE:** Maintain the original structure of questions, including numbering (e.g., "1.", "Q2.", "(a)"), options (e.g., "A.", "B)"), and paragraphs. Preserve tables and lists.
4.  **OUTPUT:** Return ONLY the cleaned text. Do not start with "Here is the cleaned text:" or any other preamble.

**RAW TEXT TO CLEAN:**
---
${truncatedText}
---
`;

    try {
        const cleanedText = await callGeminiForText(systemInstruction, userPrompt, signal);
        if (!cleanedText.trim()) {
            console.warn("AI cleaning returned an empty response. Falling back to raw text.");
            return rawText;
        }
        return cleanedText;
    } catch (error) {
        console.error("Error during AI-powered text cleaning:", error);
        console.warn("Falling back to using raw extracted text.");
        return rawText;
    }
};

const createPromptGeneratorFromTemplate = (template: string) => 
    (numberOfQuestions: number, syllabusContextPrompt: string, difficultyInstruction: string, optionsCount: 4 | 5): string => {
        return template
            .replace(/\${numberOfQuestions}/g, String(numberOfQuestions))
            .replace(/\${syllabusContextPrompt}/g, syllabusContextPrompt)
            .replace(/\${difficultyInstruction}/g, difficultyInstruction)
            .replace(/\${optionsCount}/g, String(optionsCount));
};


// --- PROMPT DISPATCHER ---
const getPromptGeneratorForTopic = (topics: Topic | Topic[]) => {
    if (!topics || (Array.isArray(topics) && topics.length === 0)) {
        return getGeneralMCQPrompt;
    }

    const firstTopic = Array.isArray(topics) ? topics[0] : topics;
    const topicUnit = firstTopic.unit.toLowerCase();

    const isSpecializedUnit = [
        'aptitude', 
        'reasoning', 
        'mathematics', 
        'quantitative aptitude', 
        'general intelligence'
    ].some(keyword => topicUnit.includes(keyword));

    if (!isSpecializedUnit) {
        return getGeneralMCQPrompt;
    }

    const topicNames = (Array.isArray(topics) ? topics.map(t => t.name) : [firstTopic.name])
                        .map(name => name.toLowerCase());

    const check = (keywords: string[]) => topicNames.some(name => keywords.some(kw => name.includes(kw)));
    
    // --- Set-Based & High-Priority Topics ---
    if (check(['data interpretation'])) return getDataInterpretationPrompt;
    if (check(['reading comprehension'])) return getReadingComprehensionPrompt;
    if (check(['seating arrangement'])) return getSeatingArrangementPrompt;

    // --- Specific Puzzle Types ---
    if (check(['blood relation'])) return createPromptGeneratorFromTemplate(BLOOD_RELATIONS_PROMPT);
    if (check(['floor puzzle', 'floor and flat', 'floor & flat'])) return createPromptGeneratorFromTemplate(FLOOR_FLAT_PROMPT);
    if (check(['box-based', 'box puzzle', 'stack'])) return createPromptGeneratorFromTemplate(BOX_STACK_PROMPT);
    if (check(['scheduling', 'week', 'day', 'month'])) return createPromptGeneratorFromTemplate(SCHEDULING_MONTH_DAY_PROMPT);
    if (check(['direction sense'])) return createPromptGeneratorFromTemplate(DIRECTION_SENSE_PROMPT);
    if (check(['comparison'])) return createPromptGeneratorFromTemplate(COMPARISON_INEQUALITY_PROMPT);
    
    // --- Fallback for other Puzzle-like topics ---
    if (check(['puzzle', 'ranking', 'mixed variable', 'age puzzle'])) return getPuzzlePrompt;

    // --- Standalone Quantitative & Reasoning Topics ---
    if (check(['data sufficiency'])) return getDataSufficiencyPrompt;
    if (check(['quantity based', 'quantity comparison'])) return getQuantityComparisonPrompt;
    if (check(['quadratic equation'])) return getQuadraticEquationPrompt;
    if (check(['number series'])) return getNumberSeriesPrompt;
    if (check(['inequality'])) return getInequalityPrompt;
    if (check(['syllogism', 'statement', 'conclusion'])) return getSyllogismPrompt;
    if (check(['assertion'])) return getAssertionReasoningPrompt;
    if (check(['simplification'])) return getSimplificationPrompt;
    if (check(['approximation'])) return getApproximationPrompt;
    
    // Combined topics should be checked first
    if (check(['combination', 'combined profit', 'combined p&l', 'combined pl mp'])) return getCombinedPlMpDiscountPrompt;
    if (check(['profit & loss', 'profit and loss'])) return getProfitLossPrompt;
    if (check(['marked price', 'mp'])) return getMarkedPricePrompt;
    if (check(['discount'])) return getDiscountQuestionsPrompt;
    
    const isSimple = check(['simple interest']);
    const isCompound = check(['compound interest']);
    if (isSimple && isCompound) return getCombinationSimpleCompoundInterestPrompt;
    if (isCompound) return getCompoundInterestPrompt;
    if (isSimple) return getSimpleInterestPrompt;
    
    if (check(['time & work', 'time and work', 'pipes', 'cisterns'])) return getTimeAndWorkPrompt;
    if (check(['boat', 'stream'])) return getBoatsAndStreamsPrompt;
    if (check(['time, speed, & distance', 'time and speed', 'trains', 'average speed'])) return getTimeSpeedDistancePrompt;
    
    if (check(['average'])) return getAveragePrompt;
    if (check(['partnership'])) return getPartnershipPrompt;
    if (check(['mixture', 'allegation'])) return getMixtureAllegationPrompt;
    if (check(['ratio', 'proportion'])) return getRatioAndProportionPrompt;
    if (check(['hcf', 'lcm'])) return getHcfLcmPrompt;
    if (check(['percentage'])) return getPercentagePrompt;
    if (check(['ages'])) return getAgesPrompt;
    if (check(['mensuration', 'area', 'volume'])) return getMensurationPrompt;
    if (check(['permutation', 'combination'])) return getPermutationCombinationPrompt;
    if (check(['probability'])) return getProbabilityPrompt;
    
    // Fallback for any other specialized topic that doesn't have a specific prompt.
    return getGeneralMCQPrompt;
};

// --- HELPER for Set-Based Question Chunking ---
const generateSetBasedQuestionsInChunks = async (
    examName: string,
    optionsCount: 4 | 5,
    topics: Topic | Topic[],
    numberOfQuestions: number,
    difficulty: Difficulty,
    promptGenerator: (
        numberOfQuestions: number,
        syllabusContextPrompt: string,
        difficultyInstruction: string,
        optionsCount: 4 | 5
    ) => string,
    signal?: AbortSignal,
    forceThinkingMode: boolean = false
): Promise<Question[]> => {
    const allQuestions: Question[] = [];
    const CHUNK_SIZE = 5;

    const useThinkingMode = forceThinkingMode || difficulty === 'Hard';

    let difficultyInstruction = `All questions must be of **${difficulty}** difficulty.`;
    if (difficulty === 'Mixed') {
        difficultyInstruction = "Generate a balanced mix of difficulty: approximately 30% Easy, 50% Medium, and 20% Hard.";
    }

    const systemInstruction = `You are an expert question creator for Indian competitive exams like ${examName}. Your sole purpose is to generate high-quality, set-based questions in the specified JSON format. For each call, you will generate a NEW, UNIQUE context and its associated questions.`;

    const syllabusContextPrompt = Array.isArray(topics)
        ? `A combined test covering:\n${(topics as Topic[]).map(t => `- **${t.name}** (from Unit: "${t.unit}")`).join('\n')}`
        : `Unit: "${(topics as Topic).unit}"\n- Specific Topic: "${(topics as Topic).name}"`;

    for (let i = 0; i < numberOfQuestions; i += CHUNK_SIZE) {
        if (signal?.aborted) {
            const abortError = new Error('Aborted by user');
            abortError.name = 'AbortError';
            throw abortError;
        }
        const questionsInThisChunk = Math.min(CHUNK_SIZE, numberOfQuestions - i);
        if (questionsInThisChunk <= 0) continue;

        console.log(`Generating a chunk of ${questionsInThisChunk} set-based questions...`);

        const userPrompt = promptGenerator(questionsInThisChunk, syllabusContextPrompt, difficultyInstruction, optionsCount);
        
        try {
            const result = await callGeminiModel(systemInstruction, userPrompt, questionsResponseSchema, signal, useThinkingMode);
            if (result.questions && result.questions.length > 0) {
                allQuestions.push(...result.questions);
            } else {
                 console.warn(`AI returned no questions for a chunk. Context: ${syllabusContextPrompt}`);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                throw error;
            }
            console.error(`Failed to generate a chunk of set-based questions. Error:`, error);
        }
    }

    return allQuestions;
};


// --- CORE AI SERVICES ---
const generateGenericMCQ = async (
    examName: string,
    optionsCount: 4 | 5,
    topics: Topic | Topic[],
    numberOfQuestions: number,
    difficulty: Difficulty,
    excludeQuestionText?: string,
    signal?: AbortSignal,
    forceThinkingMode: boolean = false
): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, numberOfQuestions);

    const useThinkingMode = forceThinkingMode || difficulty === 'Hard';
    const promptGenerator = getPromptGeneratorForTopic(topics);
    const setBasedPrompts = [
        getSeatingArrangementPrompt,
        getReadingComprehensionPrompt,
        getPuzzlePrompt,
        getDataInterpretationPrompt,
    ];

    const isSetBased = setBasedPrompts.includes(promptGenerator);

    if (isSetBased) {
        return generateSetBasedQuestionsInChunks(examName, optionsCount, topics, numberOfQuestions, difficulty, promptGenerator, signal, useThinkingMode);
    }
    
    let difficultyInstruction = `All questions must be of **${difficulty}** difficulty.`;
    if (difficulty === 'Mixed') {
        difficultyInstruction = `Generate a balanced mix of difficulty: approximately 30% Easy, 50% Medium, and 20% Hard. The total number of questions must be exactly ${numberOfQuestions}.`;
    } else if (difficulty === 'Hard') {
        difficultyInstruction = `All questions must be of **Hard** difficulty. Questions should be analytical, require multi-step reasoning, and test deep conceptual understanding, similar to a competitive exam's Mains paper. Avoid simple, direct-knowledge questions.`;
    } else if (difficulty === 'Medium') {
        difficultyInstruction = `All questions must be of **Medium** difficulty. Questions should require some application of concepts, not just direct recall, similar to a competitive exam's Prelims paper.`;
    } else if (difficulty === 'Easy') {
         difficultyInstruction = `All questions must be of **Easy** difficulty. Questions should be direct and test foundational knowledge of the topic.`;
    }

    const systemInstruction = `You are an expert question creator for Indian competitive exams like ${examName}. Your sole purpose is to generate high-quality, standalone multiple-choice questions in the specified JSON format.`;
    
    const syllabusContextPrompt = Array.isArray(topics)
        ? `A combined test covering:\n${(topics as Topic[]).map(t => `- **${t.name}** (from Unit: "${t.unit}")`).join('\n')}`
        : `Unit: "${(topics as Topic).unit}"\n- Specific Topic: "${(topics as Topic).name}"`;

    let userPrompt = promptGenerator(numberOfQuestions, syllabusContextPrompt, difficultyInstruction, optionsCount);
    if (excludeQuestionText) {
        userPrompt += `\n\n**CRITICAL EXCLUSION:** Do NOT generate a question with the following text: "${excludeQuestionText}"`;
    }

    const result = await callGeminiModel(systemInstruction, userPrompt, questionsResponseSchema, signal, useThinkingMode);

    return Array.isArray(result.questions) ? result.questions : [];
};


// --- Exported Functions ---

export const generateMCQQuestions = (topics: Topic | Topic[], numberOfQuestions: number, difficulty: Difficulty, excludeQuestionText?: string, signal?: AbortSignal, forceThinkingMode: boolean = false): Promise<Question[]> => {
    return generateGenericMCQ('TNPSC', 4, topics, numberOfQuestions, difficulty, excludeQuestionText, signal, forceThinkingMode);
};

export const generateBankMCQQuestions = (topics: Topic | Topic[], numberOfQuestions: number, difficulty: Difficulty, excludeQuestionText?: string, signal?: AbortSignal, forceThinkingMode: boolean = false): Promise<Question[]> => {
    return generateGenericMCQ('Bank Exam', 5, topics, numberOfQuestions, difficulty, excludeQuestionText, signal, forceThinkingMode);
};

export const generateRailwayMCQQuestions = (topics: Topic | Topic[], numberOfQuestions: number, difficulty: Difficulty, excludeQuestionText?: string, signal?: AbortSignal, forceThinkingMode: boolean = false): Promise<Question[]> => {
    return generateGenericMCQ('Railway', 4, topics, numberOfQuestions, difficulty, excludeQuestionText, signal, forceThinkingMode);
};

export const generateSSCMCQQuestions = (topics: Topic | Topic[], numberOfQuestions: number, difficulty: Difficulty, excludeQuestionText?: string, signal?: AbortSignal, forceThinkingMode: boolean = false): Promise<Question[]> => {
    const firstTopic = Array.isArray(topics) ? topics[0] : topics;
    const examName = firstTopic.unit.toLowerCase().includes('chsl') ? 'SSC CHSL' : 'SSC CGL';
    return generateGenericMCQ(examName, 4, topics, numberOfQuestions, difficulty, excludeQuestionText, signal, forceThinkingMode);
};

export const generateDescriptiveQuestion = async (topic: Topic, marks: Marks): Promise<DescriptiveQuestion> => {
    if (!ai) return mockDescriptiveQuestion(marks);

    const systemInstruction = "You are an expert question creator for the TNPSC Mains exam. Your task is to generate one high-quality, descriptive (essay-type) question based on a specific topic and marks, in the required JSON format.";
    const userPrompt = `Generate one descriptive question for the TNPSC Mains exam.
- **Topic:** ${topic.name} (from Unit: ${topic.unit})
- **Marks:** ${marks}
- **Guideline:** The complexity and expected length of the answer should be appropriate for the given marks. For 15 marks, it should be a broad, analytical question. For 5 marks, it should be more specific and direct.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, descriptiveQuestionResponseSchema, undefined, true);
    return result as DescriptiveQuestion;
};

export const evaluateAnswer = async (question: DescriptiveQuestion, answer: UserAnswer): Promise<Evaluation> => {
    if (!ai) return mockEvaluation;

    const systemInstruction = `You are an expert TNPSC examiner. Your task is to evaluate a user's answer for a descriptive question. Provide a score, constructive feedback, suggestions for improvement, and a model answer in the required JSON format. Be strict but fair, like a real examiner.`;
    
    const userPrompt = `
**Question Asked (for ${question.marks} marks):**
"${question.questionText}"

**User's Answer:**
${answer.text ? `"${answer.text}"` : "(User did not provide a typed answer. If a file was uploaded, its content should have been transcribed here. If not, evaluate based on the empty answer.)"}

**Evaluation Task:**
1.  **Score:** Award a score out of ${question.marks}. Be critical.
2.  **Feedback:** Provide specific, constructive feedback on what was good and what was bad.
3.  **Suggestions:** Give actionable suggestions on how to improve the answer.
4.  **Model Answer:** Write a well-structured, high-quality model answer that would score full marks. Use markdown for headings (##) and bolding (**). You can use [BOX] and [/BOX] tags to wrap key points for special formatting.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, evaluationResponseSchema, undefined, true);
    return result as Evaluation;
};

export const generatePYQQuestions = async (year: number, group: string, numQuestions: number, isSimulated: boolean, examType: ExamType, signal?: AbortSignal): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, numQuestions);

    const systemInstruction = `You are an expert question generator for the ${examType} ${group} exam. Your task is to generate questions that are either authentic previous year questions (PYQs) or high-quality, simulated PYQs in the required JSON format.`;
    
    const simulationInstruction = isSimulated
        ? `You MUST generate **AI-simulated questions** that are in the exact style, difficulty, and topic distribution of a real ${examType} ${group} ${year} exam paper. These should be new questions, not real PYQs.`
        : `You MUST generate **authentic Previous Year Questions (PYQs)** from the official ${examType} ${group} ${year} exam paper. If you do not have access to the real paper, you may use closely related questions from other years but you must state it. Mark \`isPYQ\` as true.`;

    const userPrompt = `Generate ${numQuestions} questions for a test based on the ${examType} ${group} exam from the year ${year}.
${simulationInstruction}

- **Difficulty:** The difficulty must match a real exam paper (a mix of easy, medium, and hard).
- **Format:** Ensure all questions adhere to the standard MCQ format for this exam.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, questionsResponseSchema, signal, true);
    if (Array.isArray(result.questions)) {
        return result.questions.map((q: Question) => ({ ...q, isPYQ: !isSimulated }));
    }
    return [];
};

export const generateTNPSCMockTestQuestions = async (
    difficulty: Difficulty, 
    updateProgress: (progress: number, text: string, currentStepIndex?: number) => void, 
    signal?: AbortSignal, 
    customPattern?: ExamPatternConfig,
    groupFilter?: TNPSCGroupFilterType
): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, 200);

    const allQuestions: Question[] = [];
    
    let distribution;
    if(customPattern) {
        distribution = customPattern.sections.map(s => {
            const matchedUnit = SYLLABUS.find(u => u.title === s.sectionName || u.id === s.sectionName)
            return {
                name: s.sectionName,
                topics: matchedUnit ? matchedUnit.topics : SYLLABUS.flatMap(u => u.topics),
                questionCount: s.questionCount
            }
        });
    } else {
        // FIX: Replace non-existent TNPSC_MOCK_TEST_UNIT_DISTRIBUTION with the correct constant for non-Group I tests.
        distribution = groupFilter === 'Group I'
            ? TNPSC_GROUP1_MOCK_TEST_UNIT_DISTRIBUTION
            : TNPSC_GROUP2_MOCK_TEST_UNIT_DISTRIBUTION;
    }

    const totalSections = distribution.length;

    for (const [index, section] of distribution.entries()) {
        const progress = 10 + Math.round(((index + 1) / totalSections) * 80);
        updateProgress(progress, `Generating: ${section.name}...`, index + 1);
        try {
            if (section.topics.length === 0) continue;
            // Use multiple topics for more variety in a large section
            const topicsForGeneration = section.topics.length > 5
                ? Array.from({length: Math.min(5, section.questionCount)}, () => section.topics[Math.floor(Math.random() * section.topics.length)])
                : section.topics;

            const questions = await generateMCQQuestions(topicsForGeneration, section.questionCount, difficulty, undefined, signal, true);
            const taggedQuestions = questions.map(q => ({ ...q, section: section.name }));
            allQuestions.push(...taggedQuestions);
        } catch (error) {
            console.error(`Failed to generate questions for mock test section: ${section.name}`, error);
            throw error;
        }
    }
    return allQuestions;
};

export const generateBankMockTestQuestions = async (type: 'Prelims' | 'Mains', difficulty: Difficulty, updateProgress: (progress: number, text: string, currentStepIndex?: number) => void, signal?: AbortSignal, customConfig?: ExamPatternConfig): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, 100);

    const isRRB = customConfig?.subType === 'RRB BANK';

    let topicDistribution: any;
    let examPattern: any[];
    let fullSyllabus: SyllabusUnit[];

    if(customConfig) {
        // Build a temporary topic distribution from the custom pattern
        examPattern = customConfig.sections.map(s => ({ section: s.sectionName, questions: s.questionCount }));
        topicDistribution = Object.fromEntries(customConfig.sections.map(s => [s.sectionName, [{ topicKeywords: [''], min: s.questionCount, max: s.questionCount }]]));
    } else {
        if (type === 'Prelims') {
            if (isRRB) {
                topicDistribution = RRB_BANK_PRELIMS_TOPIC_DISTRIBUTION;
                examPattern = RRB_BANK_PRELIMS_EXAM_PATTERN;
            } else {
                topicDistribution = BANK_PRELIMS_TOPIC_DISTRIBUTION;
                examPattern = BANK_PRELIMS_EXAM_PATTERN;
            }
        } else { // Mains
            if (isRRB) {
                topicDistribution = RRB_BANK_MAINS_TOPIC_DISTRIBUTION;
                examPattern = RRB_BANK_MAINS_EXAM_PATTERN;
            } else {
                topicDistribution = BANK_MAINS_TOPIC_DISTRIBUTION;
                examPattern = BANK_MAINS_EXAM_PATTERN;
            }
        }
    }
    
    if (type === 'Prelims') {
        fullSyllabus = isRRB ? RRB_BANK_PRELIMS_SYLLABUS : BANK_PRELIMS_SYLLABUS;
    } else {
        fullSyllabus = isRRB ? RRB_BANK_MAINS_SYLLABUS : BANK_MAINS_SYLLABUS;
    }

    const findSectionSyllabus = (name: string, syllabus: SyllabusUnit[]): SyllabusUnit[] => {
        const lname = name.toLowerCase();
        const keywords: { [key: string]: string[] } = {
            reasoning: ['reasoning', 'intelligence'], quant: ['quantitative', 'aptitude', 'analysis', 'interpretation', 'math', 'numerical'],
            english: ['english'], awareness: ['awareness'], computer: ['computer']
        };
        for (const key in keywords) {
            if (keywords[key].some(kw => lname.includes(kw))) {
                return syllabus.filter(u => keywords[key].some(kw => u.title.toLowerCase().includes(kw)));
            }
        }
        return syllabus; // Fallback to all if no match
    };

    const allQuestions: Question[] = [];
    const sections = Object.entries(topicDistribution);
    const totalSections = sections.length;
    const examName = customConfig?.subType || 'Bank Exam';

    for (const [index, [sectionName, subTopics]] of sections.entries()) {
        const progress = 10 + Math.round(((index + 1) / totalSections) * 80);
        updateProgress(progress, `Generating: ${sectionName} (${examName})...`, index + 1);
        const patternEntry = examPattern.find(p => p.section === sectionName);
        if (!patternEntry || typeof patternEntry.questions !== 'number') continue;
        const totalQuestionsForSection = patternEntry.questions;
        let jobs = (subTopics as { topicKeywords: string[]; min: number; max: number; }[]).map(dist => ({...dist, count: Math.floor(Math.random() * (dist.max - dist.min + 1)) + dist.min }));
        let currentTotal = jobs.reduce((sum, job) => sum + job.count, 0);
        let difference = totalQuestionsForSection - currentTotal;
        while (difference > 0) { const j = jobs.find(j => j.count < j.max); if(j) { j.count++; difference--; } else break; }
        while (difference < 0) { const j = jobs.find(j => j.count > j.min); if(j) { j.count--; difference++; } else break; }
        
        for (const job of jobs.filter(j => j.count > 0)) {
            const relevantSyllabusUnits = findSectionSyllabus(sectionName, fullSyllabus);
            const topicsForGeneration = customConfig 
                ? relevantSyllabusUnits.flatMap(u => u.topics)
                : relevantSyllabusUnits.flatMap(u => u.topics).filter(t => job.topicKeywords.some(kw => t.name.toLowerCase().includes(kw.toLowerCase())));
            if (topicsForGeneration.length === 0) continue;
            const specificExamName = customConfig?.subType ? `${customConfig.subType} ${type}` : `Bank Exam ${type}`;
            const questions = await generateGenericMCQ(specificExamName, 5, topicsForGeneration, job.count, difficulty, undefined, signal, true);
            allQuestions.push(...questions.map(q => ({ ...q, section: sectionName })));
        }
    }
    return allQuestions;
};

export const generateRailwayMockTestQuestions = async (exam: RailwayExamFilterType, stage: 'CBT-1' | 'CBT-2' | 'Part B', difficulty: Difficulty, updateProgress: (progress: number, text: string, currentStepIndex?: number) => void, signal?: AbortSignal, customConfig?: ExamPatternConfig): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, 100);

    let distribution;
    if(customConfig) {
         distribution = customConfig.sections.map(s => {
            const matchedUnit = SYLLABUS.find(u => u.title === s.sectionName || u.id === s.sectionName)
            return { name: s.sectionName, topics: matchedUnit ? matchedUnit.topics : SYLLABUS.flatMap(u => u.topics), questionCount: s.questionCount }
        });
    } else {
        if (exam === 'NTPC') distribution = stage === 'CBT-1' ? RAILWAY_NTPC_CBT1_MOCK_TEST_UNIT_DISTRIBUTION : RAILWAY_NTPC_CBT2_MOCK_TEST_UNIT_DISTRIBUTION;
        else if (exam === 'Group D') distribution = RAILWAY_GROUP_D_MOCK_TEST_UNIT_DISTRIBUTION;
        else if (exam === 'RRB ALP') {
            if (stage === 'CBT-1') distribution = RAILWAY_ALP_CBT1_MOCK_TEST_UNIT_DISTRIBUTION;
            else if (stage === 'CBT-2') distribution = RAILWAY_ALP_CBT2_MOCK_TEST_UNIT_DISTRIBUTION;
            else distribution = RAILWAY_ALP_CBT2_PART_B_MOCK_TEST_UNIT_DISTRIBUTION;
        } else throw new Error(`Invalid mock test config for Railway: ${exam} - ${stage}`);
    }

    const allQuestions: Question[] = [];
    const totalSections = distribution.length;
    for (const [index, section] of distribution.entries()) {
        const progress = 10 + Math.round(((index + 1) / totalSections) * 80);
        updateProgress(progress, `Generating: ${section.name}...`, index + 1);
        const questions = await generateRailwayMCQQuestions(section.topics, section.questionCount, difficulty, undefined, signal, true);
        allQuestions.push(...questions.map(q => ({ ...q, section: section.name })));
    }
    return allQuestions;
};

// FIX: Updated the 'tier' parameter to a more specific type to match the new function signature in App.tsx.
export const generateSSCMockTestQuestions = async (exam: SSCExamFilterType, tier: 'Tier-1' | 'Tier-2' | 'Paper-I', difficulty: Difficulty, updateProgress: (progress: number, text: string, currentStepIndex?: number) => void, signal?: AbortSignal, customConfig?: ExamPatternConfig): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, 100);
    
    let distribution: any;
    let fullSyllabus: SyllabusUnit[];
    let examPatternForTotal: any[] | undefined;

    if(customConfig) {
        // Handle custom pattern for SSC
        return mockQuestions; // Placeholder
    } else {
        if (exam === 'JE') {
            if (tier === 'Paper-I') {
                distribution = SSC_JE_PAPER1_TOPIC_DISTRIBUTION;
                fullSyllabus = SSC_JE_PAPER1_SYLLABUS;
                examPatternForTotal = SSC_JE_PAPER1_EXAM_PATTERN;
            } else {
                 throw new Error(`SSC JE ${tier} is not yet supported.`);
            }
        } else if (exam === 'CGL') {
            distribution = tier === 'Tier-1' ? SSC_CGL_TIER1_TOPIC_DISTRIBUTION : SSC_CGL_TIER2_TOPIC_DISTRIBUTION;
            fullSyllabus = tier === 'Tier-1' ? SSC_CGL_TIER1_SYLLABUS : SSC_CGL_TIER2_SYLLABUS;
            examPatternForTotal = tier === 'Tier-1' ? SSC_CGL_TIER1_EXAM_PATTERN : undefined;
        } else { // CHSL
            distribution = tier === 'Tier-1' ? SSC_CHSL_TIER1_TOPIC_DISTRIBUTION : SSC_CHSL_TIER2_TOPIC_DISTRIBUTION;
            fullSyllabus = tier === 'Tier-1' ? SSC_CHSL_TIER1_SYLLABUS : SSC_CHSL_TIER2_SYLLABUS;
            examPatternForTotal = tier === 'Tier-1' ? SSC_CHSL_TIER1_EXAM_PATTERN : undefined;
        }
    }

    const allQuestions: Question[] = [];
    const sections = Object.entries(distribution);
    const totalSections = sections.length;

    for (const [index, [sectionName, subTopics]] of sections.entries()) {
        const progress = 10 + Math.round(((index + 1) / totalSections) * 80);
        updateProgress(progress, `Generating: ${sectionName}...`, index + 1);
        
        let totalQuestionsForSection = 0;
        if(examPatternForTotal) {
            const sectionInfo = examPatternForTotal.find(s => s.section === sectionName);
            if (sectionInfo) totalQuestionsForSection = sectionInfo.questions;
        } else {
             // Fallback for Tier-2 or other complex patterns
             if(exam === 'CGL' && tier === 'Tier-2') {
                const sessionInfo = SSC_CGL_TIER2_EXAM_PATTERN.find(s => s.subject === sectionName);
                if(sessionInfo) totalQuestionsForSection = sessionInfo.questions as number;
             } else if (exam === 'CHSL' && tier === 'Tier-2') {
                const sessionInfo = SSC_CHSL_TIER2_EXAM_PATTERN.find(s => s.subject === sectionName);
                if(sessionInfo) totalQuestionsForSection = sessionInfo.questions as number;
             }
        }


        let jobs = (subTopics as { topicKeywords: string[]; min: number; max: number; }[]).map(dist => ({...dist, count: Math.floor(Math.random() * (dist.max - dist.min + 1)) + dist.min }));
        let currentTotal = jobs.reduce((sum, job) => sum + job.count, 0);

        // Adjust counts to match total if specified
        if (totalQuestionsForSection > 0) {
            let difference = totalQuestionsForSection - currentTotal;
            while (difference > 0) { const j = jobs.find(j => j.count < j.max); if(j) { j.count++; difference--; } else break; }
            while (difference < 0) { const j = jobs.find(j => j.count > j.min); if(j) { j.count--; difference++; } else break; }
        }

        for (const job of jobs.filter(j => j.count > 0)) {
            // New logic: Check if keywords match unit titles first, which is common for SSC General Awareness and Engineering.
            const unitMatchingKeywords = fullSyllabus.filter(unit =>
                job.topicKeywords.some(kw => kw && unit.title.toLowerCase().includes(kw.toLowerCase()))
            );

            let potentialTopics: Topic[] = [];

            if (unitMatchingKeywords.length > 0) {
                // If keywords match unit titles (e.g., 'Geography', 'History', 'Fluid Mechanics'), collect all topics from those units.
                potentialTopics = unitMatchingKeywords.flatMap(unit => unit.topics);
            } else {
                // If no units match, fall back to searching for keywords within topic names across the entire syllabus for the given section.
                 const sectionUnits = fullSyllabus.filter(u => u.title.toLowerCase().includes(sectionName.toLowerCase()));
                 const topicsInSection = sectionUnits.flatMap(u => u.topics);
                
                potentialTopics = topicsInSection.filter(topic =>
                    job.topicKeywords.some(kw =>
                        kw && topic.name.toLowerCase().includes(kw.toLowerCase())
                    )
                );
                
                // If still nothing, search the entire syllabus as a last resort.
                if (potentialTopics.length === 0) {
                    potentialTopics = fullSyllabus
                        .flatMap(unit => unit.topics)
                        .filter(topic =>
                            job.topicKeywords.some(kw =>
                                kw && topic.name.toLowerCase().includes(kw.toLowerCase())
                            )
                        );
                }
            }
            
            if (potentialTopics.length === 0) {
                console.warn(`No matching topics found for keywords "${job.topicKeywords.join(', ')}" in section "${sectionName}". Skipping.`);
                continue;
            }
            
            const uniqueTopics = [...new Map(potentialTopics.map(item => [item.name, item])).values()];
            
            // Randomly select topics for generation from the potential pool.
            const topicsForGeneration = uniqueTopics.length > job.count
                ? Array.from({length: job.count}, () => uniqueTopics[Math.floor(Math.random() * uniqueTopics.length)])
                : uniqueTopics;

            if (topicsForGeneration.length === 0) {
                console.warn(`Could not select any topics for generation with keywords "${job.topicKeywords.join(', ')}".`);
                continue;
            }
            
            const questions = await generateSSCMCQQuestions(topicsForGeneration, job.count, difficulty, undefined, signal, true);
            allQuestions.push(...questions.map(q => ({ ...q, section: sectionName })));
        }
    }
    return allQuestions;
};

export const generateQuestionsFromPDFContent = async (
    pdfText: string, 
    topic: Topic, 
    numQuestions: number, 
    difficulty: Difficulty, 
    examType: ExamType, 
    updateProgress: (progress: number, text: string, currentStepIndex?: number) => void,
    signal?: AbortSignal
): Promise<Question[]> => {
    if (!ai) return mockQuestions.slice(0, numQuestions);

    updateProgress(40, "AI is cleaning the document text...");
    const cleanedText = await cleanExtractedPDFText(pdfText, signal);
    if (signal?.aborted) {
        const abortError = new Error('Aborted by user');
        abortError.name = 'AbortError';
        throw abortError;
    }

    if (!cleanedText.trim()) {
        throw new Error("Document appears to be empty or contain no readable text after cleaning.");
    }
    
    updateProgress(60, "Generating questions from cleaned content...");

    const systemInstruction = `You are an expert question creator for Indian competitive exams. Your task is to generate high-quality multiple-choice questions based *only* on the provided document text.`;

    const optionsCount = examType === 'Bank Exam' ? 5 : 4;
    
    let difficultyInstruction = `All questions must be of **${difficulty}** difficulty.`;
    if (difficulty === 'Mixed') {
        difficultyInstruction = `Generate a balanced mix of difficulty.`;
    }

    const userPrompt = `
**Document Content:**
---
${cleanedText}
---

**Task:**
Based *strictly* on the document content provided above, generate ${numQuestions} multiple-choice questions relevant to the topic of "${topic.name}".

**Rules:**
- **Syllabus Context:** Topic is "${topic.name}" from unit "${topic.unit}".
- **Difficulty:** ${difficultyInstruction}
- **Options:** Each question must have exactly ${optionsCount} options.
- **Relevance:** All questions, options, and explanations must be derived from the provided text. Do not use external knowledge.

Generate the questions in the required JSON format.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, questionsResponseSchema, signal, true);
    return Array.isArray(result.questions) ? result.questions : [];
};

export const generateSampleQuestionForTopic = async (topic: Topic, examType: ExamType, signal?: AbortSignal): Promise<TopicQuestion> => {
    try {
        if (!ai) {
             const mock = { ...mockQuestions[0] };
             return { topic, question: mock };
        }
        let questions: Question[];
        if (examType === 'Bank Exam') {
            questions = await generateBankMCQQuestions(topic, 1, 'Medium', undefined, signal);
        } else if (examType === 'Railway') {
            questions = await generateRailwayMCQQuestions(topic, 1, 'Medium', undefined, signal);
        } else if (examType === 'SSC') {
            questions = await generateSSCMCQQuestions(topic, 1, 'Medium', undefined, signal);
        } else {
            questions = await generateMCQQuestions(topic, 1, 'Medium', undefined, signal);
        }

        if (questions && questions.length > 0) {
            return { topic, question: questions[0] };
        } else {
            return { topic, question: null, error: "AI failed to generate a question." };
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return { topic, question: null, error: errorMessage };
    }
};

export const generateCoachFeedback = async (history: TestResult[]): Promise<CoachFeedback> => {
    if (!ai) return mockCoachFeedback;
    
    const historySummary = history.slice(0, 5).map(result => ({
        date: result.date,
        topic: result.topic.name,
        score: result.score.toFixed(0),
        correct: result.correctCount,
        incorrect: result.incorrectCount,
        total: result.totalCount,
        weak_subtopics: result.questions
            .filter((q, i) => result.userAnswers[i] !== q.correctOption && q.questionSubtype)
            .map(q => q.questionSubtype)
            .reduce((acc, subtype) => {
                if (subtype) {
                    acc[subtype] = (acc[subtype] || 0) + 1;
                }
                return acc;
            }, {} as { [key: string]: number })
    }));

    if (historySummary.length < 2) {
        throw new Error("Not enough data for a meaningful analysis. Please complete at least two tests.");
    }
    
    const systemInstruction = `You are "PrepPal", a friendly and insightful AI coach for competitive exam preparation. Your role is to analyze a user's test history and provide encouraging, actionable feedback in a structured JSON format.`;
    
    const userPrompt = `
**User's Recent Test History (summary of last ${historySummary.length} tests):**
\`\`\`json
${JSON.stringify(historySummary, null, 2)}
\`\`\`

**Your Task:**
Based on the provided history, generate a coaching report.

1.  **Greeting:** Start with a friendly, encouraging greeting.
2.  **Overall Summary:** Write a concise (2-3 sentences) summary of the user's recent performance. Mention trends if you see any (e.g., improving scores, consistent struggles in a certain area).
3.  **Strength Areas:** Identify 1-2 topics or sections where the user is performing well (high accuracy). Explain why you think it's a strength.
4.  **Weakness Areas (Focus Areas):** Identify the top 2-3 specific sub-topics where the user is making the most mistakes. This is the most important part. Be specific.
5.  **Study Plan:** Create a simple, actionable 3-step study plan to help the user improve their weak areas. The steps should be concrete (e.g., "Review concept X", "Take a 10-question practice test on topic Y").
6.  **Motivational Quote:** End with a short, relevant motivational quote.

**CRITICAL:** Be positive and encouraging, even when pointing out weaknesses. Frame weaknesses as "opportunities for improvement" or "focus areas".
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, coachFeedbackResponseSchema, undefined, true);
    return result as CoachFeedback;
};

export const generateStudyNotes = async (topic: Topic, signal?: AbortSignal): Promise<StudyNotes> => {
    if (!ai) {
        return {
            topic: topic.name,
            introduction: "This is a mock introduction because the AI service is unavailable.",
            keyPoints: ["Mock point 1: Key concepts are important.", "Mock point 2: Remember the formulas.", "Mock point 3: Practice regularly."],
            example: {
                problem: "This is a mock problem.",
                solution: "This is the mock solution."
            },
            summary: "This is a mock summary. Consistent effort is key to success."
        };
    }

    const systemInstruction = `You are an expert educator and content creator. Your task is to generate concise, high-quality study notes for a specific topic, structured in a clear JSON format.`;
    
    const userPrompt = `
Generate study notes for the following topic:
- **Topic:** ${topic.name}
- **Unit:** ${topic.unit}

**Instructions:**
1.  **Introduction:** Provide a brief, engaging introduction to the topic (2-3 sentences).
2.  **Key Points:** List 3-5 of the most crucial points, concepts, or formulas as an array of strings.
3.  **Solved Example:** Create a simple but relevant problem and provide a clear, step-by-step solution.
4.  **Summary:** Conclude with a short summary of the topic's main takeaways.

The output must be a clean JSON object adhering to the specified schema.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, studyNotesResponseSchema, signal, false);
    return result as StudyNotes;
};

export const generateStudyPlan = async (units: SyllabusUnit[], studyDays: number, examType: ExamType, signal?: AbortSignal): Promise<StudyPlanItem[]> => {
    if (!ai) {
        const firstUnit = units[0];
        // FIX: Corrected property names in mock study plan to match the StudyPlanItem interface.
        return [
            { topicName: `Mock for ${firstUnit?.topics[0]?.name || 'Topic 1'}`, startDay: 1, endDay: Math.floor(studyDays/2), durationDays: Math.floor(studyDays/2), priority: 'High', justification: 'Foundational topic.', status: 'Not Started' },
            { topicName: `Mock for ${firstUnit?.topics[1]?.name || 'Topic 2'}`, startDay: Math.floor(studyDays/2) + 1, endDay: studyDays, durationDays: Math.ceil(studyDays/2), priority: 'Medium', justification: 'Supporting topic.', status: 'Not Started' },
        ];
    }

    const systemInstruction = `You are an expert academic coach and exam strategist for Indian competitive exams. Your task is to create a structured, realistic, and prioritized study plan. The output must be a clean JSON object.`;
    
    const userPrompt = `
I am preparing for the ${examType} exam. I need a comprehensive study plan spanning exactly ${studyDays} days to cover the topics from the following syllabus units.

**Syllabus Units to Plan:**
\`\`\`json
${JSON.stringify(units.map(u => ({ title: u.title, topics: u.topics.map(t => t.name) })), null, 2)}
\`\`\`

**Your Task:**
Create a day-by-day study plan that strategically breaks down and sequences all topics from the provided syllabus over the specified duration.

**CRITICAL RULES:**
1.  **Cover All Topics:** Your plan must include study blocks for all topics. You can group smaller, related topics into logical study blocks.
2.  **Use Exact Topic Names:** The 'topicName' in your response for each plan item **MUST EXACTLY MATCH** one of the topic names provided in the syllabus units above. You can also use generic titles like 'Revision & Mock Test' for revision days.
3.  **Logical Sequencing:** Arrange the topics in a logical order. For example, start with foundational subjects before moving to advanced ones, or alternate between quantitative and theoretical subjects.
4.  **Prioritize:** Assign a 'High', 'Medium', 'Low' priority to each block based on its general importance in competitive exams.
5.  **Allocate Time:** Assign a realistic number of days ('durationDays') to each block.
6.  **Structure Chronologically:** The plan must be a sequence of blocks. Provide 'startDay' and 'endDay' for each block. The first block must start on Day 1.
7.  **Full Duration:** The 'endDay' of the last block **must** be equal to the total '${studyDays}'. The sum of all 'durationDays' must also equal '${studyDays}'.
8.  **Justify:** Provide a brief, one-sentence 'justification' for the time and priority assigned to each block.
9.  **Include Revision/Practice:** Smartly incorporate revision or practice test days into the plan, especially towards the end.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, studyPlanResponseSchema, signal, true);
    
    if (result && typeof result === 'object' && 'plan' in result && Array.isArray(result.plan)) {
        const planItems = result.plan as any[];
        return planItems
            .filter((item: any): item is Omit<StudyPlanItem, 'status'> =>
                item && 
                typeof item === 'object' && 
                typeof item.topicName === 'string' &&
                typeof item.startDay === 'number' &&
                typeof item.endDay === 'number' &&
                typeof item.durationDays === 'number' &&
                typeof item.priority === 'string' &&
                typeof item.justification === 'string'
            )
            .map((item) => ({ ...item, status: 'Not Started' }));
    }
    return [];
};

export const generateMapImage = async (prompt: string, signal?: AbortSignal): Promise<string> => {
    if (!ai) {
        throw new Error("Gemini API service is not initialized.");
    }
    if (signal?.aborted) {
        const abortError = new Error('Aborted by user');
        abortError.name = 'AbortError';
        throw abortError;
    }

    const systemInstruction = "You are an expert cartographer AI. Your task is to generate clear, accurate, and visually appealing physical maps based on the user's request. The maps should be styled for a dark theme with high contrast and readability. Label important features clearly. Do not add any text outside of the map image itself.";
    
    const fullPrompt = `Generate a physical map of: ${prompt}. The map should be simple, clear, and easy to read. Style it for a dark theme with light-colored lines and labels.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: fullPrompt }],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return base64ImageBytes;
        }
    }
    
    throw new Error("AI failed to generate an image for the map.");
};

export const getGeoFeaturesForTopic = async (topicName: string, signal?: AbortSignal): Promise<GeoFeature[]> => {
    if (!ai) {
        if (topicName.toLowerCase().includes('rivers')) {
            return Promise.resolve([
                { name: 'Ganges River', description: 'Starts in the Himalayas and flows to the Bay of Bengal.', type: 'line', path: [[28.5, 78.9], [27.0, 83.2], [25.3, 87.6], [23.1, 90.5]], layer: 'Rivers' },
                { name: 'Yamuna River', description: 'Major tributary of the Ganges.', type: 'line', path: [[31.0, 78.4], [28.6, 77.2], [25.4, 81.8]], layer: 'Rivers' }
            ]);
        }
        return Promise.resolve([{ name: 'Mock Location', description: 'API Key not configured.', type: 'point', point: [20.5937, 78.9629], layer: 'Points of Interest' }]);
    }
    const systemInstruction = `You are a geographical data expert. Your task is to provide a list of major geographical features related to a topic as a structured JSON array. Provide accurate latitude and longitude coordinates.`;
    const userPrompt = `
List up to 15 of the most important geographical features related to the topic: "${topicName}".

For each feature, provide:
- The name of the feature.
- A brief, one-sentence description.
- The type: 'point' for single locations (like a mountain peak or city) or 'line' for linear features (like a river or mountain range).
- A layer name: This is a category for the feature. Be descriptive and group similar items. For a topic like 'Monsoon in India', layers could be 'Wind Patterns', 'High-Pressure Zones', 'Low-Pressure Zones'. For 'Rivers in India', layers could be 'Major Rivers', 'Tributaries', and 'Major Cities'. For 'Mountains of India', layers could be 'Mountain Ranges' and 'Major Peaks'. Use simple, consistent categories.
- The coordinates, using ONE of the following fields based on the 'type':
  - If 'type' is 'point', populate the 'point' field with an array of [latitude, longitude]. The 'path' field must be null.
  - If 'type' is 'line', populate the 'path' field with an array of points, like [[lat1, lon1], [lat2, lon2], ...]. The 'point' field must be null.

**Example for "Major Rivers of South India":**
- Name: Godavari River
- Description: The second longest river in India.
- Type: 'line'
- Layer: 'Rivers'
- path: [[19.9, 73.5], [18.0, 79.5], [16.9, 81.7]]
- point: null

**Example for "Capitals of Indian States":**
- Name: New Delhi
- Description: The capital city of India.
- Type: 'point'
- Layer: 'Cities'
- point: [28.6139, 77.2090]
- path: null
`;
    const result = await callGeminiModel(systemInstruction, userPrompt, geoFeaturesResponseSchema, signal, true);
    if (result && Array.isArray((result as any).features)) {
        return (result as any).features as GeoFeature[];
    }
    return [];
};

export const generateDashboardCoachSummary = async (history: TestResult[]): Promise<DashboardCoachSummary> => {
    if (!ai) {
        return {
            greeting: "Hello!",
            one_line_summary: "Keep up the great work. (Mock data)",
            tip_for_today: "Review one topic you struggled with previously. (Mock data)",
            motivational_quote: "The secret to getting ahead is gettind started. (Mock data)"
        };
    }
    
    const historySummary = history.slice(-10).map(result => ({ // Analyze last 10 tests
        date: new Date(result.date).toLocaleDateString(),
        topic: result.topic.name,
        score: result.score.toFixed(0),
        weak_subtopics: result.questions
            .filter((q, i) => result.userAnswers[i] !== q.correctOption && q.questionSubtype)
            .map(q => q.questionSubtype)
    }));

    if (historySummary.length < 2) {
        throw new Error("Not enough data for a meaningful summary. Please complete at least two tests.");
    }
    
    const systemInstruction = `You are "PrepPal", a concise and motivating AI coach for exam preparation. Your role is to provide a very brief, high-level summary of a user's performance in a specific JSON format.`;
    
    const userPrompt = `
**User's Recent Test History (summary of last ${historySummary.length} tests):**
\`\`\`json
${JSON.stringify(historySummary, null, 2)}
\`\`\`

**Your Task:**
Based on the provided history, generate a very brief coaching summary.

1.  **Greeting:** A short, friendly greeting (e.g., "Hello!", "Welcome back!").
2.  **One-Line Summary:** A single, concise sentence summarizing the user's performance trend (e.g., "Your scores have been steadily improving.", "You're showing great consistency in your practice.").
3.  **Tip for Today:** Identify the single most common weak sub-topic from the history and provide one specific, actionable tip for it. Make it short and encouraging.
4.  **Motivational Quote:** Provide a short, relevant motivational quote.

**CRITICAL:** Be extremely brief and positive. This is for a small dashboard widget, not a full report.
`;

    const result = await callGeminiModel(systemInstruction, userPrompt, dashboardCoachSummarySchema, undefined, false);
    return result as DashboardCoachSummary;
};