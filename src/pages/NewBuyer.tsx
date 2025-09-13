import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleBuyerForm } from "@/components/SimpleBuyerForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CreateBuyerInput } from "@/lib/validations";

export default function NewBuyer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateBuyerInput) => {
    setIsSubmitting(true);
    try {
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
      
      toast({
        title: "Success!",
        description: "New lead has been created successfully.",
        variant: "default",
      });
      
      navigate("/buyers");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/buyers");
  };

  return (
    <SimpleBuyerForm
      title="Create New Lead"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}