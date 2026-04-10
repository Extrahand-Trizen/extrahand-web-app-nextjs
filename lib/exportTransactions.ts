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

function getMetadata(t: Transaction): Record<string, unknown> {
  if (!t.metadata || typeof t.metadata !== "object" || Array.isArray(t.metadata)) {
    return {};
  }
  return t.metadata as Record<string, unknown>;
}

function getStringField(value: unknown): string {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  return "";
}

function getTransactionTypeLabel(t: Transaction): "Payment" | "Refund" | "Earning" | "Payout" {
  if (t.type === "payment") return "Payment";
  if (t.type === "refund") return "Refund";

  if (t.type === "payout") {
    const meta = getMetadata(t);
    const payoutHints = [
      meta.destination,
      meta.destinationBank,
      meta.bankName,
      meta.maskedAccount,
      meta.accountNumber,
      meta.upiId,
      meta.payoutMode,
      meta.transferType,
    ];

    const hasPayoutHint = payoutHints.some((v) => getStringField(v).length > 0);
    if (hasPayoutHint || Boolean(t.payoutMethodId)) return "Payout";
    return "Earning";
  }

  return "Earning";
}

function getFeeBreakdown(t: Transaction): { platformFee: number; gst: number; penalty: number; total: number } {
  const platformFee = typeof t.platformFee === "number" ? t.platformFee : 0;
  const gst = typeof t.gstAmount === "number" ? t.gstAmount : 0;
  const penalty = typeof t.penaltyDeducted === "number" ? t.penaltyDeducted : 0;

  let total = platformFee + gst + penalty;

  // Some records only persist gross and net. Derive total fee from that delta.
  if (total <= 0 && getTransactionTypeLabel(t) === "Earning") {
    const gross = typeof t.taskAmount === "number" ? t.taskAmount : t.amount;
    const net = typeof t.totalPaid === "number" ? t.totalPaid : undefined;
    if (typeof net === "number") {
      const derived = gross - net;
      if (Number.isFinite(derived) && derived > 0) {
        total = derived;
      }
    }
  }

  return {
    platformFee,
    gst,
    penalty,
    total: Number.isFinite(total) ? total : 0,
  };
}

function getGrossFeeNet(t: Transaction): { gross: number; fee: number; net: number } {
  const normalizedType = getTransactionTypeLabel(t);
  const feeBreakdown = getFeeBreakdown(t);

  if (normalizedType === "Earning") {
    const gross = typeof t.taskAmount === "number" ? t.taskAmount : t.amount;
    const fee = feeBreakdown.total;
    const net = typeof t.totalPaid === "number" ? t.totalPaid : gross - fee;
    return { gross, fee, net };
  }

  if (normalizedType === "Payout") {
    const gross = t.amount;
    const fee = feeBreakdown.total;
    return { gross, fee, net: gross - fee };
  }

  return { gross: t.amount, fee: 0, net: t.amount };
}

function normalizeStatus(raw: string): string {
  const value = raw.trim().toLowerCase();
  if (!value) return "Pending";
  if (value.includes("escrow") || value.includes("held")) return "Pending";
  if (value.includes("pending")) return "Pending";
  if (value.includes("failed")) return "Failed";
  if (value.includes("cancel")) return "Cancelled";
  if (value.includes("processing")) return "Pending";
  if (value.includes("complete") || value.includes("success") || value.includes("processed")) return "Completed";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getDisplayStatus(t: Transaction): string {
  const typeLabel = getTransactionTypeLabel(t);
  const meta = getMetadata(t);
  const metaStatus = getStringField(meta.status) || getStringField(meta.payoutStatus) || getStringField(meta.refundStatus);
  const raw = normalizeStatus(metaStatus || t.rawStatus || t.status || "pending");

  if (typeLabel === "Refund") {
    return raw === "Completed" ? "Refunded" : "Pending";
  }

  if (typeLabel === "Earning") {
    return raw === "Completed" ? "Available" : "Pending Release";
  }

  if (typeLabel === "Payout") {
    return raw === "Completed" ? "Processed" : "Pending";
  }

  return raw === "Completed" ? "Pending" : raw;
}

function getTaskOrDestination(t: Transaction): string {
  const typeLabel = getTransactionTypeLabel(t);
  const meta = getMetadata(t);
  if (typeLabel === "Payout") {
    const destination =
      getStringField(meta.destination) ||
      getStringField(meta.destinationBank) ||
      getStringField(meta.bankName) ||
      getStringField(meta.maskedAccount) ||
      getStringField(meta.accountNumber) ||
      getStringField(meta.upiId);
    return destination || "Bank Transfer";
  }

  return t.taskTitle || t.description || "—";
}

function getCounterparty(t: Transaction): string {
  const typeLabel = getTransactionTypeLabel(t);
  if (typeLabel === "Refund") return "Customer";
  if (typeLabel === "Payment") return t.assignedToName || t.paidToName || "Worker/Platform";
  if (typeLabel === "Earning") return t.paidToName || t.assignedToName || "Customer";
  return t.paidToName || t.assignedToName || "Bank";
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

function formatAmount(amount: number): string {
  const sign = amount >= 0 ? "" : "-";
  return `${sign}${Math.abs(amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
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

  const headers = ["Date", "Transaction ID", "Task / Destination", "Type", "Gross", "Fee", "Net", "Status"];
  const rows = transactions.map((t) => [
    formatDate(t.createdAt),
    t.id,
    getTaskOrDestination(t).slice(0, 28),
    getTransactionTypeLabel(t),
    formatAmount(getGrossFeeNet(t).gross),
    formatAmount(getGrossFeeNet(t).fee),
    formatAmount(getGrossFeeNet(t).net),
    getDisplayStatus(t),
  ]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: tableStartY,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 28 },
      2: { cellWidth: 34 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 14 },
      6: { cellWidth: 18 },
      7: { cellWidth: 24 },
    },
  });

  const finalY = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY ?? tableStartY;
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
  type XlsxLike = {
    utils: {
      aoa_to_sheet: (data: Array<Array<string | number>>) => unknown;
      book_new: () => unknown;
      book_append_sheet: (workbook: unknown, worksheet: unknown, name: string) => void;
    };
    writeFile: (workbook: unknown, fileName: string) => void;
  };

  const xlsxModule = await import("xlsx");
  const XLSX = ((xlsxModule as unknown as { default?: XlsxLike }).default ?? xlsxModule) as XlsxLike;

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
    "Date",
    "Transaction ID",
    "Task",
    "Type",
    "Gross",
    "Fee",
    "Platform Fee",
    "GST",
    "Net",
    "Status",
    "Counterparty",
  ];
  const includePenaltyColumn = transactions.some((t) => getFeeBreakdown(t).penalty > 0);
  if (includePenaltyColumn) {
    headers.splice(8, 0, "Penalty");
  }

  const dataRows = transactions.map((t) => {
    const grossFeeNet = getGrossFeeNet(t);
    const feeBreakdown = getFeeBreakdown(t);

    const row: Array<string | number> = [
      formatDate(t.createdAt),
      toCellValue(t.id),
      toCellValue(getTaskOrDestination(t)),
      toCellValue(getTransactionTypeLabel(t)),
      grossFeeNet.gross,
      grossFeeNet.fee,
      feeBreakdown.platformFee,
      feeBreakdown.gst,
      grossFeeNet.net,
      toCellValue(getDisplayStatus(t)),
      toCellValue(getCounterparty(t)),
    ];

    if (includePenaltyColumn) {
      row.splice(8, 0, feeBreakdown.penalty > 0 ? feeBreakdown.penalty : "");
    }

    return row;
  });

  const wsData = [...summaryRows, headers, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const colWidths = [
    { wch: 14 },
    { wch: 24 },
    { wch: 45 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 20 },
    { wch: 22 },
  ];
  if (includePenaltyColumn) {
    colWidths.splice(8, 0, { wch: 10 });
  }
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");

  const filename = `extrahand-transactions-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  XLSX.writeFile(wb, filename);
}
