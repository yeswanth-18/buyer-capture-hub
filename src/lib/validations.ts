import { z } from "zod";

export const citySchema = z.enum(["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]);

export const propertyTypeSchema = z.enum(["Apartment", "Villa", "Plot", "Office", "Retail"]);

export const bhkSchema = z.enum(["Studio", "1", "2", "3", "4"]);

export const purposeSchema = z.enum(["Buy", "Rent"]);

export const timelineSchema = z.enum(["0-3m", "3-6m", ">6m", "Exploring"]);

export const sourceSchema = z.enum(["Website", "Referral", "Walk-in", "Call", "Other"]);

export const statusSchema = z.enum(["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"]);

export const createBuyerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(80, "Name must be less than 80 characters"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10-15 digits"),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional(),
  purpose: purposeSchema,
  budgetMin: z.number().min(0, "Budget must be positive").optional(),
  budgetMax: z.number().min(0, "Budget must be positive").optional(),
  timeline: timelineSchema,
  source: sourceSchema,
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
  tags: z.array(z.string()).optional().default([]),
}).refine((data) => {
  // BHK is required for Apartment and Villa
  if (["Apartment", "Villa"].includes(data.propertyType) && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: "BHK is required for Apartment and Villa property types",
  path: ["bhk"]
}).refine((data) => {
  // Budget validation
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false;
  }
  return true;
}, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"]
});

export const updateBuyerSchema = createBuyerSchema.extend({
  status: statusSchema,
});

export const csvBuyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/),
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional().or(z.literal("")),
  purpose: purposeSchema,
  budgetMin: z.number().min(0).optional().or(z.literal("")),
  budgetMax: z.number().min(0).optional().or(z.literal("")),
  timeline: timelineSchema,
  source: sourceSchema,
  notes: z.string().max(1000).optional().or(z.literal("")),
  tags: z.string().optional().or(z.literal("")), // CSV tags as comma-separated string
  status: statusSchema.default("New"),
});

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type CsvBuyerInput = z.infer<typeof csvBuyerSchema>;