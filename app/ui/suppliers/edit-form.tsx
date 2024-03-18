"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";

// ... other imports
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { addCustomer } from "@/app/lib/actions"

let global_supplier_id = "";

const supplierFormSchema = z.object({
  supplier_name: z.string(),
  email: z.string(),
  phone: z.string(),
  rating: z.string(),
  organization: z.string(),
  location: z.string(),
  year: z.string(),
  purchase: z.string(),
});

type supplierFormValues = z.infer<typeof supplierFormSchema>

export default function EditSupplierForm({ supplierId }: { supplierId: string }) {
  const form = useForm<supplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      try {
        console.log(supplierId)
        const response = await fetch(`http://localhost:8000/get_suppliers/${supplierId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch supplier data");
        }
  
        const supplierData = await response.json();
        console.log("this is id ",supplierData.supplier_id)
        global_supplier_id = supplierData.supplier_id;
        console.log("first golbal supplier id is ", global_supplier_id)
        return {
          supplier_id: supplierData.supplier_id, // Ensure ID is included in the returned object
          supplier_name: supplierData.supplier_name,
          email: supplierData.email,
          phone: supplierData.phone,
          rating: supplierData.rating,
          organization: supplierData.organization,
          location: supplierData.location,
          year: supplierData.year,
          purchase: supplierData.purchase
        };
        return supplierData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          supplier_id:"",
          supplier_name: "",
          email: "",
          phone: "",
          rating: "", 
          organization: "", 
          location: "", 
          year: "", 
          purchase: "",  
        };
      }
    },
  });

  async function onSubmit(data: supplierFormValues) {
    console.log("Button Was Clicked")
    console.log("This is data variable", data)
    // data.id = global_id
    console.log("This is global" + global_supplier_id)
    let new_data ={
        id : global_supplier_id,
        supplier_name : data.supplier_name,
        email : data.email,
        phone: data.phone,
        rating: data.rating,
        organiztion: data.organization,
        location: data.location,
        year: data.year,
        purchase: data.purchase
    }
    console.log("This is new data" + new_data)
    try {
      const response = await fetch(`http://localhost:8000/update_suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(new_data),
      });

      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      // Handle successful response (e.g., show success toast)
      toast({
        title: "Supplier updated successfully!",
        description: "Supplier information has been updated.",
      });
      // Navigate back or handle success as needed
    } catch (error) {
      // Handle errors (e.g., show error toast)
      toast({
        title: "Failed to update supplier.",
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
          name="supplier_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />



        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="purchase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* {form.formState.errors.phone && (
                <FormMessage>{form.formState.errors.phone.message}</FormMessage>
              )} */}
            </FormItem>
          )}
        />

      <Button type="submit">Update Customer</Button>
      </form>
    </Form>
  );
} 



