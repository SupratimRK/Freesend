"use client";

import { Mail, KeyRound, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { useNeonEffects } from "@/hooks/use-neon-effects";
import { useState, useEffect, useCallback } from "react";

interface DashboardData {
  totalEmails: number;
  activeApiKeys: number;
  totalApiKeys: number;
  emailsByDay: any[];
  hoursData: any[];
  monthlyData: any[];
  recentEmails: any[];
}

interface DashboardClientProps extends DashboardData {
  emailsLastHour: number;
}

export function DashboardClient({
  totalEmails: initialTotalEmails,
  activeApiKeys: initialActiveApiKeys,
  totalApiKeys: initialTotalApiKeys,
  emailsByDay: initialEmailsByDay,
  hoursData: initialHoursData,
  monthlyData: initialMonthlyData,
  recentEmails: initialRecentEmails,
  emailsLastHour,
}: DashboardClientProps) {
  const { containerRef, handlePointerMove, handlePointerLeave, getCardStyle } = useNeonEffects();
  
  // State for dashboard data
  const [data, setData] = useState<DashboardData>({
    totalEmails: initialTotalEmails,
    activeApiKeys: initialActiveApiKeys,
    totalApiKeys: initialTotalApiKeys,
    emailsByDay: initialEmailsByDay,
    hoursData: initialHoursData,
    monthlyData: initialMonthlyData,
    recentEmails: initialRecentEmails,
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard-data');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const {
    totalEmails,
    activeApiKeys,
    totalApiKeys,
    emailsByDay,
    hoursData,
    monthlyData,
    recentEmails,
  } = data;

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Emails Card */}
        <Card 
          style={getCardStyle(0)} 
          onPointerMove={e => handlePointerMove(e, 0)} 
          onPointerLeave={handlePointerLeave} 
          className="relative overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmails}</div>
            <p className="text-xs text-muted-foreground">
              {emailsByDay[emailsByDay.length - 1]?.emails || 0} sent today
            </p>
          </CardContent>
        </Card>
        {/* Activity Card (moved to second position) */}
        <Card 
          style={getCardStyle(1)} 
          onPointerMove={e => handlePointerMove(e, 1)} 
          onPointerLeave={handlePointerLeave} 
          className="relative overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hoursData.reduce((sum, hour) => sum + hour.emails, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {emailsLastHour} sent last hour
            </p>
          </CardContent>
        </Card>
        {/* This Week Card */}
        <Card 
          style={getCardStyle(2)} 
          onPointerMove={e => handlePointerMove(e, 2)} 
          onPointerLeave={handlePointerLeave} 
          className="relative overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {emailsByDay.reduce((sum, day) => sum + day.emails, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              emails sent this week
            </p>
          </CardContent>
        </Card>
        {/* Active API Keys Card (moved to last position) */}
        <Card 
          style={getCardStyle(3)} 
          onPointerMove={e => handlePointerMove(e, 3)} 
          onPointerLeave={handlePointerLeave} 
          className="relative overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApiKeys}</div>
            <p className="text-xs text-muted-foreground">
              {totalApiKeys} total keys
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts 
        emailsByDay={emailsByDay}
        hoursData={hoursData}
        monthlyData={monthlyData}
        recentEmails={recentEmails}
      />
    </div>
  );
}
