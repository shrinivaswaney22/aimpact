import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: "ai-impact-01", 
    name: "AImpact", 
    credentials: {
        gemini: {
            apiKey: process.env.GEMINI_API_KEY
        }
    }
}) 
