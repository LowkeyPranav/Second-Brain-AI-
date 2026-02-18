
import { GoogleGenAI, Type } from "@google/genai";
<<<<<<< HEAD
import { Note, SummaryResponse } from "../types";
=======
import { Note, SummaryResponse, QuizQuestion, ProgressAnalysis, LessonDrill, QuizDifficulty, QuizResult } from "../types";
>>>>>>> 646a2e10861d57f71c70c303f1b98b08bceb3a7f

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const summarizeNote = async (note: Note): Promise<SummaryResponse> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Please summarize the following educational content. 
    IMPORTANT: Use LaTeX for any mathematical equations or chemical formulas (e.g., use $...$ for inline and $$...$$ for blocks).
    
    Content:
    ${note.content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A 2-3 sentence summary. Use LaTeX for math.",
          },
          keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of bullet points. Use LaTeX for math.",
          },
        },
        required: ["summary", "keyTakeaways"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as SummaryResponse;
  } catch (error) {
    console.error("Failed to parse summary JSON", error);
    return { summary: "Failed to generate summary.", keyTakeaways: [] };
  }
};

<<<<<<< HEAD
=======
export const generateQuiz = async (notes: Note[], count: number, difficulty: QuizDifficulty): Promise<QuizQuestion[]> => {
  const ai = getAIClient();
  const context = notes.map(n => n.content).join('\n\n');
  
  const difficultyPrompts = {
    'Foundational': 'focus on core concepts and clear definitions with straightforward application.',
    'Standard': 'standard IGCSE exam style questions testing understanding and typical problem-solving.',
    'Rigorous': 'tricky questions with plausible distractors, multi-step reasoning, and subtle conceptual pitfalls.',
    'Elite': 'extremely challenging, complex application-based questions designed to test absolute mastery and lateral thinking.'
  };

  // Upgraded to gemini-3-pro-preview for complex reasoning required for high-quality quiz generation
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a dynamic ${count}-question multiple choice quiz. 
    LEVEL: IGCSE Grade 10 (International General Certificate of Secondary Education).
    DIFFICULTY: ${difficulty}. ${difficultyPrompts[difficulty]}
    
    CRITICAL INSTRUCTION: Use LaTeX for EVERY SINGLE instance of a mathematical symbol, variable (like $x$, $y$), formula, equation, or scientific term. 
    
    RULES:
    1. Every question must have 4 options. 
    2. Options MUST use LaTeX if they contain values, symbols, or scientific notation.
    3. The explanation MUST detail the logic using LaTeX.
    4. Ensure the JSON is valid. Escape backslashes correctly (e.g., "\\\\frac").
    
    Notes for context:
    ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER, description: "Index of correct option (0-3)" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      },
    },
  });

  try {
    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (e) {
    console.error("Quiz generation failed", e);
    return [];
  }
};

export const analyzeProgress = async (notes: Note[], quizHistory: QuizResult[]): Promise<ProgressAnalysis> => {
  const ai = getAIClient();
  const context = notes.map(n => `Topic: ${n.name}\nContent: ${n.content}`).join('\n\n');
  const historyContext = quizHistory.map(h => `Quiz Result: ${h.score}/${h.total} on ${new Date(h.timestamp).toLocaleDateString()}`).join('\n');

  // Upgraded to gemini-3-pro-preview for complex reasoning and pedagogical audit tasks
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Perform a high-fidelity pedagogical audit. Use BOTH the study notes AND the quiz performance history to identify specific knowledge gaps and mastery levels.
    
    Notes Repository:
    ${context}
    
    Performance History:
    ${historyContext}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallMastery: { type: Type.NUMBER },
          studyTimeEstimate: { type: Type.STRING },
          streakCount: { type: Type.NUMBER },
          subjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                strength: { type: Type.ARRAY, items: { type: Type.STRING } },
                weakness: { type: Type.ARRAY, items: { type: Type.STRING } },
                masteryScore: { type: Type.NUMBER },
                completionPercentage: { type: Type.NUMBER },
                highYieldTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "strength", "weakness", "masteryScore", "completionPercentage", "highYieldTopics"]
            }
          }
        },
        required: ["overallMastery", "studyTimeEstimate", "streakCount", "subjects"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { overallMastery: 0, studyTimeEstimate: "0h", streakCount: 0, subjects: [] };
  }
};

export const generateLessonDrill = async (topic: string, subject: string, notes: Note[]): Promise<LessonDrill> => {
  const ai = getAIClient();
  const context = notes.map(n => n.content).join('\n\n');

  // Upgraded to gemini-3-pro-preview for complex reasoning tasks as per guidelines
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Create an INTERACTIVE lesson drill for "${topic}" (${subject}).
    
    MANDATORY: Use LaTeX ($...$ or $$...$$) for ALL mathematical/scientific notation.
    
    Context:
    ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conceptExplanation: { type: Type.STRING },
          exampleProblem: { type: Type.STRING },
          exampleSolution: { type: Type.STRING },
          practiceQuestion: { type: Type.STRING },
          practiceAnswer: { type: Type.STRING },
          practiceExplanation: { type: Type.STRING }
        },
        required: ["conceptExplanation", "exampleProblem", "exampleSolution", "practiceQuestion", "practiceAnswer", "practiceExplanation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to generate lesson drill");
  }
};

>>>>>>> 646a2e10861d57f71c70c303f1b98b08bceb3a7f
export const answerQuestion = async (
  question: string,
  notes: Note[],
  chatHistory: { role: 'user' | 'assistant', content: string }[]
): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  const ai = getAIClient();
<<<<<<< HEAD
  
  const context = notes.length > 0 
    ? notes.map(n => `--- Document: ${n.name} ---\n${n.content}`).join('\n\n')
    : "No documents uploaded yet.";
  
  const systemInstruction = `You are "Second Brain", a specialist pedagogical AI. 
  
  Your primary focus is to help students excel by focusing on:
  1. EXAM-PATTERN AWARENESS: Help the user identify high-yield topics and how they are typically tested.
  2. SYLLABUS STRUCTURE: Organize the user's notes into a coherent curriculum or syllabus.
  3. PAST PAPER STRATEGY: Suggest how topics might appear in exams and provide practice questions.
  4. VIDEO ROUTING: At the very end of every answer, you MUST provide ONE high-quality YouTube video recommendation (e.g., from Khan Academy, CrashCourse, or a top-rated academic channel).
  
  CORE BEHAVIOR:
  - Use the Google Search tool to find accurate, up-to-date educational resources and videos.
  - IMPORTANT: After your main answer, add a section titled "### 🎥 Recommended Deep Dive".
  - CRITICAL: Under that title, provide the Video Title and Channel Name (Format: "**Video Title** - *Channel Name*") followed by a 1-sentence description. 
  - DO NOT provide a raw URL or link. Just providing the title and channel is enough for the student to find it.
  - Use LaTeX ($...$ for inline, $$...$$ for block) for all math/science.
  - Prioritize uploaded notes but augment with external high-quality educational data.
  
  Context:
  ${context}`;

=======
  const context = notes.map(n => `--- Document: ${n.name} ---\n${n.content}`).join('\n\n');
  const systemInstruction = `You are "Second Brain", a high-performance AI learning engine.
  ALWAYS use LaTeX for math. Use Google Search for external depth.
  
  CONTEXT FROM DOCUMENTS:
  ${context}`;

  // Use gemini-3-flash-preview for general Q&A as per model selection guidelines
>>>>>>> 646a2e10861d57f71c70c303f1b98b08bceb3a7f
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...chatHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: question }] }
    ],
    config: {
      systemInstruction,
<<<<<<< HEAD
      temperature: 0.3,
=======
>>>>>>> 646a2e10861d57f71c70c303f1b98b08bceb3a7f
      tools: [{ googleSearch: {} }],
    },
  });

<<<<<<< HEAD
  const text = response.text || "I couldn't generate a response.";
  
  // Extract grounding citations if present
  const sources: { uri: string; title: string }[] = [];
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const groundingChunks = groundingMetadata?.groundingChunks;
  
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        sources.push({
          uri: chunk.web.uri,
          title: chunk.web.title || "External Resource",
        });
      }
    });
  }

=======
  // Extract text property directly as per guidelines
  const text = response.text || "";
  const sources: { uri: string; title: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((c: any) => { if (c.web?.uri) sources.push({ uri: c.web.uri, title: c.web.title }); });
  }
>>>>>>> 646a2e10861d57f71c70c303f1b98b08bceb3a7f
  return { text, sources };
};
