"use server"
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
    const {userId} = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({ 
        where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    try {
        const result = await db.$transaction(
            async(txn) => {
                // First, check if industry insights exist for this industry
                let industryInsights = await txn.industryInsight.findUnique({
                    where: { industry: data.industry },
                });

                // If industry insights don't exist, create them
                if (!industryInsights) {
                    const insights = await generateAIInsights(data.industry);
                    industryInsights = await txn.industryInsight.create({
                        data: {
                            industry: data.industry,
                            salaryRanges: insights.salaryRanges,
                            growthRate: insights.growthRate,
                            demandLevel: insights.demandLevel,
                            topSkills: insights.topSkills,
                            marketOutlook: insights.marketOutlook,
                            keyTrends: insights.keyTrends,
                            recommendedSkills: insights.recommendedSkills,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        },
                    });
                }

                // Then update the user
                const updatedUser = await txn.user.update({
                    where: { id: user.id },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    },
                });

                return { updatedUser, industryInsights };
            },
            { timeout: 15000 } // Increased timeout since AI generation can take time
        );
        
        return { success: true, ...result };
    } catch (error) {
        console.error("Error updating user:", error);
        
        // More specific error handling
        if (error.message.includes('enum')) {
            throw new Error("Invalid industry data format. Please try again.");
        }
        if (error.message.includes('timeout')) {
            throw new Error("Operation timed out. Please try again.");
        }
        
        throw new Error(`Failed to update user: ${error.message}`);
    }
}

export async function getUserOnboardingStatus() {
    const {userId} = await auth();
    if (!userId) throw new Error("User not authenticated");

    try {
        const user = await db.user.findUnique({ 
            where: { clerkUserId: userId },
            select: {
                industry: true,
                experience: true,
                bio: true,
                skills: true,
            }
        });
        
        if (!user) throw new Error("User not found");

        return {
            isOnboarded: !!user?.industry,
            hasProfile: !!(user?.industry && user?.experience && user?.bio && user?.skills?.length > 0),
            user: user
        };
    } catch (error) {
        console.error("Error fetching user onboarding status:", error.message);
        throw new Error("Failed to fetch user onboarding status");
    }
}