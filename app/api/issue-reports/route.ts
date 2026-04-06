import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import IssueReport, { type IssueType } from "@/lib/models/IssueReport";

export const runtime = "nodejs";

interface CreateIssueReportBody {
   issueType: IssueType;
   issueLabel: string;
   pageContext: string;
   message: string;
   userId?: string;
   userUid?: string;
   metadata?: Record<string, unknown>;
}

function isIssueType(value: string): value is IssueType {
   return ["payment", "task", "chat", "general"].includes(value);
}

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json()) as Partial<CreateIssueReportBody>;

      if (!body.issueType || !isIssueType(body.issueType)) {
         return NextResponse.json(
            { message: "Invalid issue type" },
            { status: 400 }
         );
      }

      const issueLabel = body.issueLabel?.trim();
      const pageContext = body.pageContext?.trim();
      const message = body.message?.trim();

      if (!issueLabel || !pageContext || !message) {
         return NextResponse.json(
            { message: "issueLabel, pageContext, and message are required" },
            { status: 400 }
         );
      }

      if (message.length < 5) {
         return NextResponse.json(
            { message: "Issue description must be at least 5 characters" },
            { status: 400 }
         );
      }

      if (message.length > 2000) {
         return NextResponse.json(
            { message: "Issue description must be under 2000 characters" },
            { status: 400 }
         );
      }

      await connectDB();

      const created = await IssueReport.create({
         issueType: body.issueType,
         issueLabel,
         pageContext,
         message,
         userId: body.userId?.trim(),
         userUid: body.userUid?.trim(),
         metadata: {
            ...(body.metadata || {}),
            userAgent: request.headers.get("user-agent") || "unknown",
            source: "web-app-nextjs",
         },
      });

      return NextResponse.json(
         {
            message: "Issue report submitted successfully",
            data: {
               id: created._id,
               issueType: created.issueType,
               issueLabel: created.issueLabel,
               pageContext: created.pageContext,
               createdAt: created.createdAt,
            },
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Failed to submit issue report:", error);
      return NextResponse.json(
         { message: "Failed to submit issue report" },
         { status: 500 }
      );
   }
}
