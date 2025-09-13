import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BuyerFilters } from "@/types/buyer";
import type { CreateBuyerInput, UpdateBuyerInput } from "@/lib/validations";

export interface Buyer {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  city: string;
  property_type: string;
  bhk?: string;
  purpose: string;
  budget_min?: number;
  budget_max?: number;
  timeline: string;
  source: string;
  status: string;
  notes?: string;
  tags: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useBuyers = (filters?: BuyerFilters) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('buyers')
        .select('*')
        .order('updated_at', { ascending: false });

      // Apply filters
      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.propertyType) {
        query = query.eq('property_type', filters.propertyType);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.timeline) {
        query = query.eq('timeline', filters.timeline);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBuyers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, [filters]);

  const createBuyer = async (data: CreateBuyerInput) => {
    const { error } = await supabase.from('buyers').insert({
      full_name: data.fullName,
      email: data.email || null,
      phone: data.phone,
      city: data.city,
      property_type: data.propertyType,
      bhk: data.bhk || null,
      purpose: data.purpose,
      budget_min: data.budgetMin || null,
      budget_max: data.budgetMax || null,
      timeline: data.timeline,
      source: data.source,
      notes: data.notes || null,
      tags: data.tags || [],
    } as any);

    if (error) throw error;
    await fetchBuyers(); // Refresh the list
  };

  const updateBuyer = async (id: string, data: UpdateBuyerInput) => {
    const { error } = await supabase.from('buyers').update({
      full_name: data.fullName,
      email: data.email || null,
      phone: data.phone,
      city: data.city,
      property_type: data.propertyType,
      bhk: data.bhk || null,
      purpose: data.purpose,
      budget_min: data.budgetMin || null,
      budget_max: data.budgetMax || null,
      timeline: data.timeline,
      source: data.source,
      status: data.status,
      notes: data.notes || null,
      tags: data.tags || [],
      updated_at: new Date().toISOString(),
    } as any).eq('id', id);

    if (error) throw error;
    await fetchBuyers(); // Refresh the list
  };

  const deleteBuyer = async (id: string) => {
    const { error } = await supabase.from('buyers').delete().eq('id', id);
    if (error) throw error;
    await fetchBuyers(); // Refresh the list
  };

  return {
    buyers,
    loading,
    error,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    refetch: fetchBuyers,
  };
};