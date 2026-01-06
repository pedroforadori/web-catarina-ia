import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = import.meta.env.VITE_API_KEY || '';

// Singleton instance helper
class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;
  private modelName = 'gemini-2.5-flash';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey });
  }

  public startChat(customInstruction?: string): void {
    try {
      this.chatSession = this.ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: customInstruction || SYSTEM_INSTRUCTION,
          temperature: 0.4, // Adjusted for professional/stable tone
          maxOutputTokens: 1024, // Increased to prevent cutoff
        },
        history: [],
      });
    } catch (error) {
      console.error("Failed to initialize chat session", error);
    }
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      this.startChat();
    }

    if (!this.chatSession) {
      throw new Error("Chat session not initialized");
    }

    try {
      const response = await this.chatSession.sendMessage({
        message: message,
      });

      return response.text || "Desculpe, houve uma instabilidade momentânea. Pode repetir?";
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      return "Estou analisando sua solicitação. Aguarde um momento.";
    }
  }
}

export const geminiService = new GeminiService();