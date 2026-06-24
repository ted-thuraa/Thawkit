import { db } from "@/drizzle/db";
import { analyticsEvents, projects, quizResponses } from "@/drizzle/schema";
import { sql, asc, eq, and, gte } from "drizzle-orm"; // Added eq, and, gte
import { BasicProjectQueryResponse, getBasicProjectDetails } from "./project";
import { getAuthenticatedOrganizationId } from "./organization";

// --- Types for Data Transfer ---
export type DailyAnalyticsData = {
  date: string;
  views: number;
  uniqueVisitors: number;
};

export type DailyLeadsData = {
  date: string;
  completedLeads: number;
};

export type LeadMetrics = {
  totalViews: number;
  totalUniqueVisitors: number;
  totalLeadsStarted: number;
  totalLeadsCompleted: number;
  conversionRate: number; // Completed Leads / Total Views
};

export type AnalyticsDashboardData = LeadMetrics & {
  dailyVisits: DailyAnalyticsData[];
  dailyLeads: DailyLeadsData[];
};

export type TimeRange = "7d" | "30d" | "90d";

// --- Utility Functions ---

// ... (Keep your Types and existing logic mostly the same) ...

const getStartDate = (range: TimeRange): Date => {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const date = new Date();
  date.setDate(date.getDate() - days);
  // Return a Date object, not a string, for better comparison with Timestamps
  return date;
};

export async function getAnalyticsData(
  appRef: string,
  timeRange: TimeRange = "90d"
): Promise<
  | { success: true; data: AnalyticsDashboardData }
  | { success: false; error: string }
> {
  try {
    const startDate = getStartDate(timeRange);
    const organizationId = await getAuthenticatedOrganizationId();
    const [project] = await db
      .select({
        id: projects.id,
      })
      .from(projects)
      .where(
        and(
          eq(projects.ref, appRef),
          eq(projects.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!project) {
      return { success: false, error: "Project not found." };
    }
    const projectId: string = project?.id;

    // 1. Fetch Aggregated Metrics (All Time)
    // FIX: Use eq() for stable ID comparison
    const [metrics] = await db
      .select({
        totalViews: sql<number>`CAST(COUNT(*) as SIGNED)`,
        totalUniqueVisitors: sql<number>`CAST(COUNT(DISTINCT ${analyticsEvents.visitorId}) as SIGNED)`,
      })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.projectId, projectId));

    // 2. Fetch Leads Metrics (All Time)
    // FIX: Use eq() here as well
    const [leadsCounts] = await db
      .select({
        totalLeadsStarted: sql<number>`CAST(COUNT(CASE WHEN ${quizResponses.status} = 'RECEIVED' THEN 1 END) as SIGNED)`,
        totalLeadsCompleted: sql<number>`CAST(COUNT(CASE WHEN ${quizResponses.status} = 'COMPLETED' THEN 1 END) as SIGNED)`,
      })
      .from(quizResponses)
      .where(eq(quizResponses.projectId, projectId));

    const totalLeadsCompleted = leadsCounts?.totalLeadsCompleted || 0;
    const totalViews = metrics?.totalViews || 0;

    const conversionRate =
      totalViews > 0 ? (totalLeadsCompleted / totalViews) * 100 : 0;

    const leadMetrics: LeadMetrics = {
      totalViews: totalViews,
      totalUniqueVisitors: metrics?.totalUniqueVisitors || 0,
      totalLeadsStarted: leadsCounts?.totalLeadsStarted || 0,
      totalLeadsCompleted: totalLeadsCompleted,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };

    // 3. Daily Visits Data
    // FIX: Use and() combining eq() and gte().
    // comparison is now done on the Timestamp directly (Index friendly)
    const dailyVisits = await db
      .select({
        date: sql<string>`DATE(${analyticsEvents.createdAt})`,
        views: sql<number>`CAST(COUNT(*) as SIGNED)`,
        uniqueVisitors: sql<number>`CAST(COUNT(DISTINCT ${analyticsEvents.visitorId}) as SIGNED)`,
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.projectId, projectId),
          gte(analyticsEvents.createdAt, startDate)
        )
      )
      .groupBy(sql`DATE(${analyticsEvents.createdAt})`)
      .orderBy(asc(sql`DATE(${analyticsEvents.createdAt})`));

    // 4. Daily Leads Data
    // FIX: Use and(), eq(), and gte()
    const dailyLeads = await db
      .select({
        date: sql<string>`DATE(${quizResponses.completedAt})`,
        completedLeads: sql<number>`CAST(COUNT(*) as SIGNED)`,
      })
      .from(quizResponses)
      .where(
        and(
          eq(quizResponses.projectId, projectId),
          eq(quizResponses.status, "COMPLETED"),
          gte(quizResponses.completedAt, startDate)
        )
      )
      .groupBy(sql`DATE(${quizResponses.completedAt})`)
      .orderBy(asc(sql`DATE(${quizResponses.completedAt})`));

    const result: AnalyticsDashboardData = {
      ...leadMetrics,
      dailyVisits: dailyVisits.map((d) => ({
        ...d,
        views: d.views || 0,
        uniqueVisitors: d.uniqueVisitors || 0,
      })),
      dailyLeads: dailyLeads.map((d) => ({
        ...d,
        completedLeads: d.completedLeads || 0,
      })),
    };

    return { success: true, data: result };
  } catch (e) {
    console.error("Analytics Query Error:", e);
    return { success: false, error: "Database query failed" };
  }
}
