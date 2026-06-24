import { NextResponse } from "next/server";
import {} from "@/lib/querries/project";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import {
  fetchProjectPublicDataMainPage,
  ProjectPublicDataMainPageResponse,
} from "@/lib/querries/campaignPublic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ domain: string; responseId: string }> }
) {
  const { domain, responseId } = await params;

  if (!domain) {
    return NextResponse.json(
      { success: false, error: "Domain parameter is required" },
      { status: 400 }
    );
  }

  try {
    // 2. Fetch Data FIRST (Public access by default)
    // We do this before Auth because public pages shouldn't require a session
    const data: ProjectPublicDataMainPageResponse =
      await fetchProjectPublicDataMainPage({
        domain,
        context: "Result_Page",
        responseId,
      });

    if (!data.projectData) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    // 3. Handle Draft Mode (Auth required only here)
    if (data.projectData.draftMode) {
      try {
        const sessionData = await auth.api.getSession({
          headers: await headers(),
        });

        // If no session exists, we can't verify ownership
        if (!sessionData?.session) {
          return NextResponse.json(
            {
              success: false,
              error: "This tool is private (Draft Mode).",
              isPrivate: true,
              projectTitle: data.projectData.title,
            },
            { status: 403 }
          );
        }

        const organizationData = await auth.api.getFullOrganization({
          query: {
            organizationId: sessionData.session.activeOrganizationId as string,
          },
          headers: await headers(),
        });

        const visitorId = sessionData.session.userId;
        const organisationOwner = organizationData?.members.find(
          (member) => member.role === "owner"
        );

        // If visitor is not the owner, block access
        if (visitorId !== organisationOwner?.id) {
          return NextResponse.json(
            {
              success: false,
              error: "This tool is private.",
              isPrivate: true,
              projectTitle: data.projectData.title,
            },
            { status: 403 }
          );
        }
      } catch (authError) {
        // If auth checks fail (e.g. 401), treat as Forbidden for draft content
        console.warn("Auth check failed for draft page:", authError);
        return NextResponse.json(
          { success: false, error: "Unauthorized access to draft" },
          { status: 403 }
        );
      }
    }

    // 4. Validate Funnel Pages
    if (!data.funnelPages[0]) {
      return NextResponse.json(
        { success: false, error: "Landing page not found for this project" },
        { status: 404 }
      );
    }

    // 5. Return Success
    const responseHeaders = new Headers();
    responseHeaders.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return NextResponse.json(
      { success: true, data: data },
      { status: 200, headers: responseHeaders }
    );
  } catch (error: any) {
    console.error("API Error fetching project:", error);

    // Determine if it's a known error or generic 500
    const status = error?.statusCode || 500;
    return NextResponse.json(
      { success: false, error: "An internal server error occurred" },
      { status }
    );
  }
}
