import { useI18n } from "vue-i18n";
import { useCategoryStore } from "../stores/categoryStore";
import type { Transaction } from "../types";

export function useExport() {
  const { t } = useI18n();
  const categoryStore = useCategoryStore();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
  };

  // Export to CSV
  const exportToCSV = (
    transactions: Transaction[],
    filename: string = "transactions",
  ) => {
    console.log("exportToCSV called with", transactions.length, "transactions");

    if (transactions.length === 0) {
      alert(t("noDataExport"));
      return;
    }

    // CSV Header
    const headers = [
      "ID",
      t("title"),
      t("amount"),
      t("category"),
      t("type"),
      t("status"),
      t("date"),
      t("notes"),
    ];

    // CSV Rows
    const rows = transactions.map((transaction) => {
      const category = categoryStore.getCategoryById(transaction.category);
      return [
        transaction.id,
        `"${transaction.title}"`,
        transaction.amount,
        `"${category?.name || "N/A"}"`,
        t(transaction.type),
        t(
          `status${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}`,
        ),
        formatDate(transaction.date),
        `"${transaction.notes || ""}"`,
      ].join(",");
    });

    // Combine header and rows
    const csvContent = [headers.join(","), ...rows].join("\n");
    console.log("CSV content generated");

    // Create blob and download
    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("CSV download triggered");
  };

  // Export to Excel using xlsx library
  const exportToExcel = async (
    transactions: Transaction[],
    filename: string = "transactions",
  ) => {
    console.log(
      "exportToExcel called with",
      transactions.length,
      "transactions",
    );

    if (transactions.length === 0) {
      alert(t("noDataExport"));
      return;
    }

    try {
      // Dynamically import xlsx
      const XLSX = await import("xlsx");
      console.log("XLSX loaded");

      // Prepare data
      const data = transactions.map((transaction) => {
        const category = categoryStore.getCategoryById(transaction.category);
        return {
          ID: transaction.id,
          [t("title")]: transaction.title,
          [t("amount")]: transaction.amount,
          [t("category")]: category?.name || "N/A",
          [t("type")]: t(transaction.type),
          [t("status")]: t(
            `status${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}`,
          ),
          [t("date")]: formatDate(transaction.date),
          [t("notes")]: transaction.notes || "",
        };
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");

      // Generate Excel file and download
      XLSX.writeFile(
        wb,
        `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      console.log("Excel download triggered");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Lỗi khi xuất Excel: " + error);
    }
  };

  // Export to PDF using jsPDF
  const exportToPDF = async (
    transactions: Transaction[],
    filename: string = "transactions",
  ) => {
    console.log("exportToPDF called with", transactions.length, "transactions");

    if (transactions.length === 0) {
      alert(t("noDataExport"));
      return;
    }

    try {
      // Dynamically import jsPDF
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text(t("transactions"), 14, 20);

      // Summary
      doc.setFontSize(11);
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      doc.text(`${t("monthlyIncome")}: ${formatCurrency(totalIncome)}`, 14, 30);
      doc.text(
        `${t("monthlyExpense")}: ${formatCurrency(totalExpense)}`,
        14,
        36,
      );
      doc.text(
        `${t("balance")}: ${formatCurrency(totalIncome - totalExpense)}`,
        14,
        42,
      );

      // Table headers
      doc.setFontSize(10);
      const headers = [
        [t("title"), t("category"), t("type"), t("amount"), t("date")],
      ];

      // Table data
      const tableData = transactions.map((transaction) => {
        const category = categoryStore.getCategoryById(transaction.category);
        return [
          transaction.title,
          category?.name || "N/A",
          t(transaction.type),
          formatCurrency(transaction.amount),
          formatDate(transaction.date),
        ];
      });

      // Create table
      const tableY = 50;
      let currentY = tableY;

      // Draw headers
      doc.setFillColor(52, 73, 94);
      doc.rect(14, currentY - 7, 180, 7, "F");
      doc.setTextColor(255, 255, 255);

      const columnWidths = [50, 35, 25, 35, 35];
      let currentX = 14;

      headers[0].forEach((header, index) => {
        doc.text(header, currentX + 2, currentY - 2);
        currentX += columnWidths[index];
      });

      // Draw rows
      doc.setTextColor(0, 0, 0);
      currentY += 3;

      tableData.forEach((row, rowIndex) => {
        if (currentY > 270) {
          // Add new page if needed
          doc.addPage();
          currentY = 20;
        }

        currentX = 14;
        row.forEach((cell, cellIndex) => {
          doc.text(String(cell), currentX + 2, currentY);
          currentX += columnWidths[cellIndex];
        });

        // Draw row line
        doc.setDrawColor(200, 200, 200);
        doc.line(14, currentY + 1, 194, currentY + 1);

        currentY += 7;
      });

      // Save PDF
      doc.save(`${filename}_${new Date().toISOString().split("T")[0]}.pdf`);
      console.log("PDF download triggered");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Lỗi khi xuất PDF: " + error);
    }
  };

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF,
  };
}
