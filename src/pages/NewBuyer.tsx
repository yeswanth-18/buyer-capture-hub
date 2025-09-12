import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleBuyerForm } from "@/components/SimpleBuyerForm";
import { useToast } from "@/hooks/use-toast";
import type { CreateBuyerInput } from "@/lib/validations";

export default function NewBuyer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateBuyerInput) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating new buyer:", data);
      
      toast({
        title: "Success!",
        description: "New lead has been created successfully.",
        variant: "default",
      });
      
      navigate("/buyers");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead. Please try again.",
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