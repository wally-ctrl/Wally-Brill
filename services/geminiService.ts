import { GoogleGenAI, Type } from "@google/genai";
import { ASHLEY_PERSONA } from '../constants';
import { Question, EvaluationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The specific model version requested for this app
const MODEL_NAME = 'gemini-2.5-flash-preview-09-2025';

export const evaluateWithGemini = async (
  question: Question,
  response: string
): Promise<EvaluationResult> => {
  const prompt = `
    You are a casting director and expert judge of character voice.
    You are evaluating if an AI model successfully embodies the persona of "Ashley".

    --- PERSONA DEFINITION ---
    ${JSON.stringify(ASHLEY_PERSONA, null, 2)}

    --- THE TEST ---
    Input Question: "${question.text}"
    Trap Context: ${question.trapReason}
    SUCCESS CRITERIA: ${question.successCriteria}

    --- CANDIDATE RESPONSE ---
    "${response}"

    --- INSTRUCTIONS ---
    Evaluate the response strictly against the Success Criteria and the Ashley Persona.
    1. Did the response sound like a 26-year-old terminally online Brooklynite?
    2. Did it use the right slang ("brain rot", "cinema", etc) naturally, not forcefully?
    3. Did it avoid being a helpful assistant?
  `;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "1-5, where 1 is robotic/AI, 5 is perfect character embodiment" },
            passed: { type: Type.BOOLEAN, description: "True if score >= 4" },
            reasoning: { type: Type.STRING, description: "Short summary of why it passed/failed" },
            critique: { type: Type.STRING, description: "Specific constructive feedback on tone/vocabulary" }
          },
          required: ["score", "passed", "reasoning", "critique"]
        }
      }
    });

    if (result.text) {
        return JSON.parse(result.text) as EvaluationResult;
    }
    throw new Error("No text returned from model");

  } catch (error) {
    console.error("Evaluation Error:", error);
    return {
      score: 0,
      passed: false,
      reasoning: "Error connecting to Judge API. Please check configuration.",
      critique: "System Error."
    };
  }
};

export const simulateResponse = async (
  question: Question,
  type: 'good' | 'bad'
): Promise<string> => {
  const prompt = type === 'good'
    ? `Roleplay as Ashley (26, Brooklyn, Pop Culture Critic, intense, ironic, uses internet slang like 'brain rot' and 'main character energy'). Respond to: "${question.text}". Keep it short. Be slightly judgmental but funny.`
    : `Act as a helpful AI assistant. Respond to: "${question.text}". Be polite, objective, and robotic.`;

  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return result.text || "Error: Empty response.";
  } catch (e) {
    console.error("Simulation Error:", e);
    return "Error generating simulation.";
  }
};