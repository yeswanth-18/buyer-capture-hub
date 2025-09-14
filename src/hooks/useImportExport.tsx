import { useState } from "react";
import { exportBuyersToCSV, parseBuyersFromCSV, downloadCSVTemplate } from "@/lib/csv-utils";
import { useBuyers } from "@/hooks/useBuyers";
import { toast } from "sonner";
import type { CsvBuyerInput } from "@/lib/validations";

export const useImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { buyers, createBuyer } = useBuyers();

  const handleExport = async () => {
    try {
      setExporting(true);
      if (buyers.length === 0) {
        toast.error("No buyers to export");
        return;
      }
      exportBuyersToCSV(buyers);
      toast.success(`Exported ${buyers.length} buyers to CSV`);
    } catch (error) {
      toast.error("Failed to export buyers");
      console.error("Export error:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file: File) => {
    try {
      setImporting(true);
      
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error("Please select a CSV file");
      }

      const buyersData = await parseBuyersFromCSV(file);
      
      if (buyersData.length === 0) {
        throw new Error("No valid buyer data found in CSV");
      }

      // Import buyers one by one
      let successCount = 0;
      let errorCount = 0;
      
      for (const buyerData of buyersData) {
        try {
          // Convert CSV data to CreateBuyerInput format
          const createBuyerData = {
            fullName: buyerData.fullName,
            email: buyerData.email || undefined,
            phone: buyerData.phone,
            city: buyerData.city,
            propertyType: buyerData.propertyType,
            bhk: buyerData.bhk || undefined,
            purpose: buyerData.purpose,
            budgetMin: buyerData.budgetMin || undefined,
            budgetMax: buyerData.budgetMax || undefined,
            timeline: buyerData.timeline,
            source: buyerData.source,
            notes: buyerData.notes || undefined,
            tags: typeof buyerData.tags === 'string' 
              ? buyerData.tags.split(';').map(tag => tag.trim()).filter(tag => tag)
              : buyerData.tags || []
          };
          await createBuyer(createBuyerData);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error("Failed to import buyer:", error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} buyers${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      } else {
        toast.error("Failed to import any buyers. Please check your CSV format.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to import CSV");
      console.error("Import error:", error);
    } finally {
      setImporting(false);
    }
  };

  const handleTemplateDownload = () => {
    try {
      downloadCSVTemplate();
      toast.success("Downloaded CSV template");
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  return {
    importing,
    exporting,
    handleExport,
    handleImport,
    handleTemplateDownload,
  };
};