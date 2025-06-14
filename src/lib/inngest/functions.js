import { GoogleGenerativeAI } from "@google/generative-ai";
import db from "../db";
import { inngest } from "./client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const generateIndustryAIInsights = inngest.createFunction(
    {name:"Generate Industry Insights"},
    {cron:"0 0 * * 0"},
    async ({step}) => {
        if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set in environment variables");
        const industries = await step.run("Fetch Industries", async () => {
            try {
                return await db.industryInsight.findMany({
                select: {industry:true}
            })
            } catch (error) {
                throw new Error(`Failed to fetch industries: ${error.message}`);
            }
        })
        for (const { industry } of industries) {
            const prompt = `Analyze the current state of the ${industry} industry in India and provide insights in ONLY the following JSON format without any additional notes or explanations:
                {
                  "salaryRanges": [{ "role": "string", "min": number, "max": number, "median": number, "location": "string" }],
                  "growthRate": number,
                  "demandLevel": "HIGH" | "MEDIUM" | "LOW",
                  "topSkills": ["skill1", "skill2"],
                  "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
                  "keyTrends": ["trend1", "trend2"],
                  "recommendedSkills": ["skill1", "skill2"]
                }
            IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
            Include at least 5 common roles for salary ranges.
            Growth rate should be a percentage.
            Include at least 5 skills and trends.`;

            const res = await step.run(`Generate insights for ${industry}`, async () => {
        try {
          const result = await model.generateContent(prompt);
          const text = result.response.candidates[0]?.content?.parts[0]?.text;
          if (!text) {
            throw new Error("No valid response from Gemini API");
          }
          const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
          try {
            return JSON.parse(cleanedText);
          } catch (error) {
            throw new Error(`Failed to parse Gemini response as JSON: ${error.message}`);
          }
        } catch (error) {
          throw new Error(`Failed to generate insights for ${industry}: ${error.message}`);
        }
      });
      
      await step.run(`Updating ${industry} insights`, async () => {
        try {
          await db.industryInsight.update({
            where: { industry },
            data: {
              ...res,
              lastUpdated: new Date(), // Adjusted to match earlier schema
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
            },
          });
        } catch (error) {
          throw new Error(`Failed to update insights for ${industry}: ${error.message}`);
        }
      });

        }
        return { message: "Industry insights updated successfully" };
    }
)