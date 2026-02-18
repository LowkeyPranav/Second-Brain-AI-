
import { GoogleGenAI, Type } from "@google/genai";
import { Note, SummaryResponse } from "../types";

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

export const answerQuestion = async (
  question: string,
  notes: Note[],
  chatHistory: { role: 'user' | 'assistant', content: string }[]
): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  const ai = getAIClient();
  
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
      temperature: 0.3,
      tools: [{ googleSearch: {} }],
    },
  });

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

  return { text, sources };
};
