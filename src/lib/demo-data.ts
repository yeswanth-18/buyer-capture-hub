import type { Buyer } from "@/types/buyer";

// Demo data for the buyer leads app
export const demoUser = {
  id: "user-1",
  name: "Demo User",
  email: "demo@leadflow.com"
};

export const demoBuyers: Buyer[] = [
  {
    id: "buyer-1",
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "9876543210",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "3",
    purpose: "Buy",
    budgetMin: 5000000,
    budgetMax: 7500000,
    timeline: "0-3m",
    source: "Website",
    status: "New",
    notes: "Looking for a 3BHK apartment in Sector 22. Prefers high floor with park view.",
    tags: ["high-priority", "3bhk", "sector-22"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-10T10:30:00Z"),
    createdAt: new Date("2024-09-10T10:30:00Z"),
  },
  {
    id: "buyer-2",
    fullName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "9876543211",
    city: "Mohali",
    propertyType: "Villa",
    bhk: "4",
    purpose: "Buy",
    budgetMin: 12000000,
    budgetMax: 15000000,
    timeline: "3-6m",
    source: "Referral",
    status: "Qualified",
    notes: "Interested in independent villa with garden. Ready for site visits next week.",
    tags: ["villa", "garden", "premium"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-09T14:20:00Z"),
    createdAt: new Date("2024-09-09T14:20:00Z"),
  },
  {
    id: "buyer-3",
    fullName: "Amit Singh",
    email: "",
    phone: "9876543212",
    city: "Zirakpur",
    propertyType: "Plot",
    purpose: "Buy",
    budgetMin: 2500000,
    budgetMax: 4000000,
    timeline: ">6m",
    source: "Walk-in",
    status: "Contacted",
    notes: "Looking for residential plot for future construction. Flexible on location.",
    tags: ["plot", "future-construction"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-08T09:15:00Z"),
    createdAt: new Date("2024-09-08T09:15:00Z"),
  },
  {
    id: "buyer-4",
    fullName: "Sneha Gupta",
    email: "sneha.gupta@email.com",
    phone: "9876543213",
    city: "Panchkula",
    propertyType: "Apartment",
    bhk: "2",
    purpose: "Rent",
    budgetMin: 25000,
    budgetMax: 35000,
    timeline: "0-3m",
    source: "Call",
    status: "Visited",
    notes: "Young professional looking for 2BHK rental near IT park. Pet-friendly preferred.",
    tags: ["rental", "young-professional", "pet-friendly"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-07T16:45:00Z"),
    createdAt: new Date("2024-09-07T16:45:00Z"),
  },
  {
    id: "buyer-5",
    fullName: "Vikram Mehta",
    email: "vikram.mehta@business.com",
    phone: "9876543214",
    city: "Chandigarh",
    propertyType: "Office",
    purpose: "Buy",
    budgetMin: 8000000,
    budgetMax: 12000000,
    timeline: "3-6m",
    source: "Website",
    status: "Negotiation",
    notes: "Expanding business, needs 2000 sq ft office space in commercial hub.",
    tags: ["commercial", "office-space", "expansion"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-06T11:30:00Z"),
    createdAt: new Date("2024-09-06T11:30:00Z"),
  },
  {
    id: "buyer-6",
    fullName: "Nisha Patel",
    email: "nisha.patel@email.com",
    phone: "9876543215",
    city: "Mohali",
    propertyType: "Retail",
    purpose: "Rent",
    budgetMin: 50000,
    budgetMax: 80000,
    timeline: "0-3m",
    source: "Referral",
    status: "Converted",
    notes: "Successfully rented 800 sq ft retail space for boutique store.",
    tags: ["retail", "boutique", "converted"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-05T13:20:00Z"),
    createdAt: new Date("2024-09-05T13:20:00Z"),
  },
  {
    id: "buyer-7",
    fullName: "Rohit Agarwal",
    email: "",
    phone: "9876543216",
    city: "Other",
    propertyType: "Apartment",
    bhk: "1",
    purpose: "Rent",
    budgetMin: 15000,
    budgetMax: 22000,
    timeline: "Exploring",
    source: "Other",
    status: "Dropped",
    notes: "Budget constraints, looking for more affordable options.",
    tags: ["budget-constraint", "affordable"],
    ownerId: "user-1",
    updatedAt: new Date("2024-09-04T08:10:00Z"),
    createdAt: new Date("2024-09-04T08:10:00Z"),
  }
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800";
    case "Qualified":
      return "bg-green-100 text-green-800";
    case "Contacted":
      return "bg-yellow-100 text-yellow-800";
    case "Visited":
      return "bg-purple-100 text-purple-800";
    case "Negotiation":
      return "bg-orange-100 text-orange-800";
    case "Converted":
      return "bg-success text-success-foreground";
    case "Dropped":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const formatBudget = (min?: number, max?: number) => {
  const formatAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
  };

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  } else if (min) {
    return `${formatAmount(min)}+`;
  } else if (max) {
    return `Up to ${formatAmount(max)}`;
  }
  return "Not specified";
};