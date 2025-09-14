import type { Buyer } from "@/hooks/useBuyers";
import { csvBuyerSchema, type CsvBuyerInput } from "@/lib/validations";

// CSV Export functionality
export const exportBuyersToCSV = (buyers: Buyer[]) => {
  const headers = [
    'Full Name',
    'Email', 
    'Phone',
    'City',
    'Property Type',
    'BHK',
    'Purpose',
    'Budget Min',
    'Budget Max', 
    'Timeline',
    'Source',
    'Status',
    'Notes',
    'Tags',
    'Created At',
    'Updated At'
  ];

  const csvContent = [
    headers.join(','),
    ...buyers.map(buyer => [
      `"${buyer.full_name}"`,
      `"${buyer.email || ''}"`,
      `"${buyer.phone}"`,
      `"${buyer.city}"`,
      `"${buyer.property_type}"`,
      `"${buyer.bhk || ''}"`,
      `"${buyer.purpose}"`,
      buyer.budget_min || '',
      buyer.budget_max || '',
      `"${buyer.timeline}"`,
      `"${buyer.source}"`,
      `"${buyer.status}"`,
      `"${buyer.notes || ''}"`,
      `"${buyer.tags.join('; ')}"`,
      `"${buyer.created_at}"`,
      `"${buyer.updated_at}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `buyers-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// CSV Import functionality
export const parseBuyersFromCSV = (file: File): Promise<CsvBuyerInput[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          throw new Error('CSV file must contain at least a header row and one data row');
        }

        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const buyers: CsvBuyerInput[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i]);
            if (values.length === 0) continue; // Skip empty lines
            
            const buyerData: any = {};
            
            headers.forEach((header, index) => {
              const value = values[index]?.replace(/"/g, '').trim() || '';
              
              switch (header.toLowerCase()) {
                case 'full name':
                  buyerData.fullName = value;
                  break;
                case 'email':
                  buyerData.email = value || undefined;
                  break;
                case 'phone':
                  buyerData.phone = value;
                  break;
                case 'city':
                  buyerData.city = value;
                  break;
                case 'property type':
                  buyerData.propertyType = value;
                  break;
                case 'bhk':
                  buyerData.bhk = value || undefined;
                  break;
                case 'purpose':
                  buyerData.purpose = value;
                  break;
                case 'budget min':
                  buyerData.budgetMin = value ? parseFloat(value) : undefined;
                  break;
                case 'budget max':
                  buyerData.budgetMax = value ? parseFloat(value) : undefined;
                  break;
                case 'timeline':
                  buyerData.timeline = value;
                  break;
                case 'source':
                  buyerData.source = value;
                  break;
                case 'status':
                  buyerData.status = value || 'New';
                  break;
                case 'notes':
                  buyerData.notes = value || undefined;
                  break;
                case 'tags':
                  buyerData.tags = value ? value.split(';').map(tag => tag.trim()).filter(tag => tag) : [];
                  break;
              }
            });

            // Validate the buyer data
            const validatedBuyer = csvBuyerSchema.parse(buyerData);
            buyers.push(validatedBuyer);
          } catch (error) {
            errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
          }
        }

        if (errors.length > 0 && buyers.length === 0) {
          throw new Error(`Import failed:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... and ${errors.length - 5} more errors` : ''}`);
        }

        resolve(buyers);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse CSV file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

// Helper function to parse CSV line with proper comma handling
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

// Generate CSV template for download
export const downloadCSVTemplate = () => {
  const template = `"Full Name","Email","Phone","City","Property Type","BHK","Purpose","Budget Min","Budget Max","Timeline","Source","Status","Notes","Tags"
"John Doe","john@example.com","9876543210","Chandigarh","Apartment","3","Buy","5000000","7000000","3-6m","Website","New","Looking for a spacious apartment","urgent; family"
"Jane Smith","jane@example.com","9876543211","Mohali","Villa","4","Buy","10000000","15000000","0-3m","Referral","Qualified","Prefers gated community","luxury; security"`;

  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'buyers-import-template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};