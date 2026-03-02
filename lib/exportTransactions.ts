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
  const XLSX = (await import("xlsx")).default;

  const summaryRows = [
    ["ExtraHand – Transaction Statement"],
    ["Generated", format(new Date(), "dd MMM yyyy, HH:mm")],
    [],
    ["Summary", ""],
    ["Total Earnings", summary.totalEarnings],
    ["Total Spent", summary.totalSpent],
    [],
  ];

  const headers = ["Date", "Type", "Description", "Amount", "Currency", "Status"];
  const dataRows = transactions.map((t) => [
    formatDate(t.createdAt),
    t.type,
    t.description || t.taskTitle || "",
    t.amount,
    t.currency,
    t.status,
  ]);

  const wsData = [...summaryRows, headers, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const colWidths = [
    { wch: 12 },
    { wch: 10 },
    { wch: 45 },
    { wch: 14 },
    { wch: 8 },
    { wch: 10 },
  ];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");

  const filename = `extrahand-transactions-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(wb, filename);
}
