import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "ai-impact ", 
    name: "AImpact", 
    credentials: {
        gemini: {
            apiKey: process.env.GEMINI_API_KEY
        }
    }
}) 