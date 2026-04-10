/**
 * Client-side export of transaction list to PDF or Excel.
 * Uses jspdf + jspdf-autotable for PDF and xlsx for Excel.
 */

import type { Transaction } from "@/types/profile";
import { format } from "date-fns";

export interface ExportSummary {
  totalEarnings: number;
  totalSpent: number;
}

function formatDateTime(value?: Date | string): string {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  return format(dt, "dd MMM yyyy, HH:mm");
}

function toCellValue(value: unknown): string | number {
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "string") return value;
  if (value instanceof Date) return formatDateTime(value);
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function formatDate(d: Date): string {
  return format(new Date(d), "dd MMM yyyy");
}

function formatAmount(amount: number, currency: string = "INR"): string {
  const sign = amount >= 0 ? "" : "-";
  return `${sign}${currency === "INR" ? "₹" : ""}${Math.abs(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

/**
 * Export filtered transactions to a PDF statement.
 */
export async function exportTransactionsToPdf(
  transactions: Transaction[],
  summary: ExportSummary
): Promise<void> {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  const title = "ExtraHand – Transaction Statement";
  const generatedAt = format(new Date(), "dd MMM yyyy, HH:mm");

  doc.setFontSize(14);
  doc.text(title, 14, 18);
  doc.setFontSize(9);
  doc.text(`Generated on ${generatedAt}`, 14, 25);

  doc.setFontSize(10);
  doc.text(`Total Earnings: ${formatAmount(summary.totalEarnings)}`, 14, 33);
  doc.text(`Total Spent: ${formatAmount(summary.totalSpent)}`, 14, 39);

  const tableStartY = 46;

  const headers = ["Date", "Type", "Description", "Amount", "Status"];
  const rows = transactions.map((t) => [
    formatDate(t.createdAt),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    (t.description || t.taskTitle || "—").slice(0, 40),
    formatAmount(t.amount, t.currency),
    t.status,
  ]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: tableStartY,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 22 },
      2: { cellWidth: 70 },
      3: { cellWidth: 28 },
      4: { cellWidth: 22 },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? tableStartY;
  doc.setFontSize(8);
  doc.text(
    `Showing ${transactions.length} transaction(s).`,
    14,
    finalY + 8
  );

  const filename = `extrahand-transactions-${format(new Date(), "yyyy-MM-dd")}.pdf`;
  doc.save(filename);
}

/**
 * Export filtered transactions to an Excel file.
 */
export async function exportTransactionsToExcel(
  transactions: Transaction[],
  summary: ExportSummary
): Promise<void> {
  const xlsxModule = await import("xlsx");
  const XLSX = (xlsxModule as unknown as { default?: any }).default ?? xlsxModule;

  if (!XLSX?.utils?.aoa_to_sheet || typeof XLSX.writeFile !== "function") {
    throw new Error("Excel exporter is unavailable");
  }

  const summaryRows = [
    ["ExtraHand – Transaction Statement"],
    ["Generated", format(new Date(), "dd MMM yyyy, HH:mm")],
    [],
    ["Summary", ""],
    ["Total Earnings", summary.totalEarnings],
    ["Total Spent", summary.totalSpent],
    [],
  ];

  const headers = [
    "Transaction ID",
    "Payout ID",
    "Created At",
    "Completed At",
    "Type",
    "Status",
    "Raw Status",
    "Currency",
    "Amount",
    "Description",
    "Task ID",
    "Task Title",
    "Task Category",
    "Task Status",
    "Assigned To",
    "Paid To",
    "Poster UID",
    "Payment Method ID",
    "Payout Method ID",
    "Escrow Status",
    "Task Amount",
    "Platform Fee",
    "GST Amount",
    "Total Paid",
    "Penalty Deducted",
    "Penalty Lines",
    "Metadata",
  ];
  const dataRows = transactions.map((t) => [
    toCellValue(t.id),
    toCellValue(t.payoutId),
    formatDateTime(t.createdAt),
    formatDateTime(t.completedAt),
    toCellValue(t.type),
    toCellValue(t.status),
    toCellValue(t.rawStatus),
    toCellValue(t.currency),
    t.amount,
    toCellValue(t.description || t.taskTitle || ""),
    toCellValue(t.taskId),
    toCellValue(t.taskTitle),
    toCellValue(t.taskCategory),
    toCellValue(t.taskStatus),
    toCellValue(t.assignedToName),
    toCellValue(t.paidToName),
    toCellValue(t.posterUid),
    toCellValue(t.paymentMethodId),
    toCellValue(t.payoutMethodId),
    toCellValue(t.escrowStatus),
    toCellValue(t.taskAmount),
    toCellValue(t.platformFee),
    toCellValue(t.gstAmount),
    toCellValue(t.totalPaid),
    toCellValue(t.penaltyDeducted),
    toCellValue(t.penaltyLines),
    toCellValue(t.metadata),
  ]);

  const wsData = [...summaryRows, headers, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const colWidths = [
    { wch: 24 },
    { wch: 24 },
    { wch: 20 },
    { wch: 20 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 10 },
    { wch: 14 },
    { wch: 45 },
    { wch: 20 },
    { wch: 35 },
    { wch: 18 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 22 },
    { wch: 22 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 40 },
    { wch: 50 },
  ];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");

  const filename = `extrahand-transactions-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(wb, filename);
}
