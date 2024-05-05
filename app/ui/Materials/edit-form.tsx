'use client';

import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useForm } from "react-hook-form";
import { updateMaterial } from '@/app/lib/actions';
import { MaterialsField, MaterialsForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { toast } from "@/components/ui/use-toast";


// const materialFormSchema = z.object({
//   material_name: z
//     .string(),

//   material_amount: z
//     .string(),
// })

// type MaterialFormValues = z.infer<typeof materialFormSchema>

  export default function EditMaterialForm({ materialId }: { materialId: string;}) {
  // const initialState = { message: null, errors: {} };
  // const updateMaterialWithId = updateMaterial.bind(null, material.materials_id);
  // const [state, dispatch] = useFormState(updateMaterialWithId, initialState);
  const form = useForm({
    mode: "onChange",
    defaultValues: async () => {
      try {
        console.log(materialId)
        const response = await fetch(`http://localhost:8000/get_material/${materialId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
  
        const materialData = await response.json();
        return {
          material_id: materialData.material_id,
          material_name: materialData.material_name,
          material_amount: materialData.material_amount,
        };
        return materialData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          material_id:"",
          material_name: "",
          material_amount: "", // Set defaults if fetching fails
        };
      }
    },
  });

  async function onSubmit(data: any) {
    console.log("Button Was Clicked")
    console.log("This is data variable", data)
    // data.id = global_i
    let new_data ={
      material_id : materialId,
      material_name : data.material_name,
      material_amount: data.material_amount

    }
    console.log("This is new data" + new_data)
    try {
      const response = await fetch(`http://localhost:8000/update_material`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_data),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      // Handle successful response (e.g., show success toast)
      toast({
        title: "Customer updated successfully!",
        description: "Customer information has been updated.",
      });
      // Navigate back or handle success as needed
    } catch (error) {
      // Handle errors (e.g., show error toast)
      toast({
        title: "Failed to update customer.",
        description: "Please try again or contact support.",
      });
    }
  }
 
  return (
    <Form {...form}>
      {/* Form fields for name, email, phone_number (same as create-customer) */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="material_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="material_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />
      
      <Button type="submit">Update Material</Button>
      </form>
    </Form>
  );

}

    