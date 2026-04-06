import mongoose, { Schema, type Model, type Types } from "mongoose";

export type IssueType = "payment" | "task" | "chat" | "general";

export interface IssueReportDocument {
   _id: Types.ObjectId;
   issueType: IssueType;
   issueLabel: string;
   pageContext: string;
   message: string;
   status: "open" | "closed";
   userId?: string;
   userUid?: string;
   metadata?: Record<string, unknown>;
   createdAt: Date;
   updatedAt: Date;
}

const IssueReportSchema = new Schema<IssueReportDocument>(
   {
      issueType: {
         type: String,
         enum: ["payment", "task", "chat", "general"],
         required: true,
      },
      issueLabel: {
         type: String,
         required: true,
         trim: true,
      },
      pageContext: {
         type: String,
         required: true,
         trim: true,
      },
      message: {
         type: String,
         required: true,
         trim: true,
         minlength: 5,
         maxlength: 2000,
      },
      status: {
         type: String,
         enum: ["open", "closed"],
         default: "open",
      },
      userId: {
         type: String,
         trim: true,
      },
      userUid: {
         type: String,
         trim: true,
      },
      metadata: {
         type: Schema.Types.Mixed,
      },
   },
   {
      timestamps: true,
   }
);

const IssueReport: Model<IssueReportDocument> =
   (mongoose.models.IssueReport as Model<IssueReportDocument>) ||
   mongoose.model<IssueReportDocument>("IssueReport", IssueReportSchema);

export default IssueReport;
