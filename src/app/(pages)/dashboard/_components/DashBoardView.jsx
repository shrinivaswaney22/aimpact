"use client";

import { Brain, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DashBoardView = ({insights}) => {
    const salaryData = insights.salaryRanges.map((r)=> ({
        name: r.role,
        min: r.min/1000,
        max: r.max/1000,
        median: r.median/1000,
    }));

    const getDemandLevelColour = (level) => {
        switch (level.toLowerCase()) {
            case 'high':
                return 'bg-green-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    const marketOutlookInfo = (ol) => {
        switch (ol.toLowerCase()) {
            case 'positive':
                return {icon:TrendingUp,color:'text-green-500'};
            case 'neutral':
                return {icon:LineChart,color:'text-yellow-500'};
            case 'negative':
                return {icon:TrendingDown,color:'text-red-500'};
            default:
                return {icon:LineChart,color:'text-gray-500'};
        }
    }

    const OutlookIcon = marketOutlookInfo(insights.marketOutlook).icon;
    const outlookColor = marketOutlookInfo(insights.marketOutlook).color;

    const lastUpdatedDate = format(new Date(insights.lastUpdated), 'dd/MMM/yyyy');
    const nextUpdatedDistance = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true });
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Badge variant={'outline'}>Last Updated: {lastUpdatedDate}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Market Outlook
                    </CardTitle>
                    <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {insights.marketOutlook}
                    </div>
                    <p className="text-sm text-muted-foreground">Next Update {nextUpdatedDistance}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Industry Growth
                    </CardTitle>
                    <TrendingUp className={`h-4 w-4 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {insights.growthRate.toFixed(1)}%
                    </div>
                    <Progress value={insights.growthRate} className={'mt-2'} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Demand Level
                    </CardTitle>
                    <BriefcaseIcon className={`h-4 w-4 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {insights.demandLevel}
                    </div>
                    <div className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColour(insights.demandLevel)}`}>

                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Top Skills
                    </CardTitle>
                    <Brain className={`h-4 w-4 text-muted-foreground`} />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-1">
                        {insights.topSkills.map((skill)=> {
                            return <Badge key={skill} variant={'secondary'}>
                                {skill}
                            </Badge>
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>
                    Salary Range by Role
                </CardTitle>
                <CardDescription>
                    Displaying Minimum,Median and Maximum Salaries (in Thousands)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salaryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={({active,payload,label})=>{
                                if (active && payload && payload.length) {
                                    return <div className="bg-background border rounded-lg p-2 shadow-md">
                                        <p className="font-medium">{label}</p>
                                        {payload.map((item)=> {
                                            return <p key={item.name} className="text-sm">
                                                {item.name}:${item.value}K
                                            </p>
                                        })}
                                    </div>
                                }
                            }} />
                            <Bar dataKey="min" fill="#94a3b8" name={'Min Salary'} />
                            <Bar dataKey="median" fill="#64748b" name={'Median Salary'} />
                            <Bar dataKey="max" fill="#475569" name={'Max Salary'} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Key Industry Trends
                    </CardTitle>
                    <CardDescription>
                        Current Trends Shaping the Industry
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {insights.keyTrends.map((tr,idx)=>{
                            return <li key={idx} className="flex items-center space-x-2">
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                                <span>{tr}</span>
                            </li>
                        })}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Recommended Skills
                    </CardTitle>
                    <CardDescription>
                        Skills to Consider Developing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {insights.recommendedSkills.map((skill)=> {
                            return <Badge key={skill} variant={'secondary'}>
                                {skill}
                            </Badge>
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
        
    </div>
  )
}

export default DashBoardView