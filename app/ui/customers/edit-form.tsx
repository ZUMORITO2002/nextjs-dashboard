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

let global_id = "";

const profileFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone_number: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function EditCustomerForm({ customerId }: { customerId: string }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      try {
        console.log(customerId)
        const response = await fetch(`http://localhost:8000/get_customer/${customerId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
  
        const customerData = await response.json();
        console.log("this is id ",customerData.id)
        console.log("this is name", customerData.name)
        global_id = customerData.id;
        return {
          id: customerData.id, // Ensure ID is included in the returned object
          name: customerData.name,
          email: customerData.email,
          phone_number: customerData.phone_number,
        };
        return customerData; // Return the fetched customer data
      } catch (error) {
        console.error("Error fetching customer data:", error);
        // Handle errors (e.g., show error message)
        return {
          id:"",
          name: "",
          email: "",
          phone_number: "", // Set defaults if fetching fails
        };
      }
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    console.log("Button Was Clicked")
    console.log("This is data variable", data)
    // data.id = global_id
    console.log("This is global" + global_id)
    let new_data ={
        id : global_id,
        name : data.name,
        email : data.email,
        phone_number : data.phone_number
    }
    console.log("This is new data" + new_data)
    try {
      const response = await fetch(`http://localhost:8000/update_customer`, {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer name</FormLabel>
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
          name="phone_number"
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

      <Button type="submit">Update Customer</Button>
      </form>
    </Form>
  );
} 