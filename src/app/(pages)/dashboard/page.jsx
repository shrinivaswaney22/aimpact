import React from 'react'
import { redirect } from 'next/navigation';
import { getUserOnboardingStatus } from '../../../../actions/user';
import { getIndustryInsights } from '../../../../actions/dashboard';
import DashBoardView from './_components/DashBoardView';

const IndustryInsightsPage = async () => {
    const {isOnboarded} = await getUserOnboardingStatus();
    const insights = await getIndustryInsights( )
    
    // Only redirect if user is NOT onboarded
    if (!isOnboarded) {
        redirect('/onboarding');
    }
    
    // If user is onboarded, show the page content
    return (
        <div className="container mx-auto">
            <DashBoardView insights={insights} />
        </div>
    )
}

export default IndustryInsightsPage